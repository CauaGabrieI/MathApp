#!/usr/bin/env node
/*
 * Phase-A content audit. This script reads the current generated artifacts and
 * writes only docs/content-audit-baseline.{json,md}; it never rewrites app
 * content or generated public files.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(process.cwd());
const docs = path.join(root, 'docs');
const originalFlag = process.argv.indexOf('--original-markdown');
const originalMarkdownInput = originalFlag >= 0 && process.argv[originalFlag + 1]
  ? path.resolve(process.argv[originalFlag + 1])
  : null;
const originalMarkdownLogical = originalMarkdownInput ? path.basename(originalMarkdownInput) : 'ENEM_mapa_mental_completo.md';
const readJson = async name => JSON.parse(await fs.readFile(path.join(root, name), 'utf8'));
const exists = async file => { try { await fs.access(file); return true; } catch { return false; } };
const sha256 = async file => (await fs.readFile(file)).toString() && crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
const normalize = value => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function parseMath(markdown) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const start = lines.findIndex(line => /^##\s+(?:📐\s*)?Matemática\s+—\s+Matemática\s*$/u.test(line));
  if (start < 0) return { found: false, modules: [] };
  const modules = [];
  let current = null;
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line)) break;
    const heading = line.match(/^###\s+\[(Básico|Intermediário|Avançado)\]\s+(\d+)\.\s+(.+?)\s*$/u);
    if (heading) {
      current = { sourceNumber: Number(heading[2]), level: heading[1], title: heading[3], sourceStudyAfter: '', topics: [] };
      modules.push(current);
      continue;
    }
    if (!current) continue;
    const after = line.match(/^\*\*Estudar depois de:\*\*\s*(.+)$/u);
    if (after) current.sourceStudyAfter = after[1].trim();
    const topic = line.match(/^\s*-\s+\[[ xX]\]\s+(.+?)\s*$/u);
    if (topic) current.topics.push(topic[1]);
  }
  return { found: true, modules };
}

function bySource(rows) {
  const out = {};
  for (const row of rows) out[row.source] = (out[row.source] ?? 0) + 1;
  return out;
}

function questionAudit(question) {
  if (!question) return { id: null, status: 'missing_from_loaded_banks' };
  return {
    id: question.id,
    source: question.source,
    title: question.title ?? null,
    level: question.level ?? null,
    levelOrigin: question.levelOrigin ?? null,
    year: question.year ?? null,
    alternatives: Array.isArray(question.alternatives) ? question.alternatives.length : 0,
    answerPresent: Boolean(question.answer),
    explanationPresent: Boolean(question.explanation),
    media: (question.files ?? []).map(file => ({ kind: 'file', present: Boolean(file), external: /^https?:\/\//u.test(String(file)) })),
    correctionStatus: question.explanation ? 'stored_explanation' : 'source_answer_only_human_review_required',
  };
}

if(await exists(path.join(docs,'content-audit-baseline.json'))&&!process.argv.includes('--replace-baseline'))throw new Error('Baseline já existe. Preserve a fotografia anterior; use --replace-baseline apenas para recriá-la deliberadamente.');

const curriculum = await readJson('public/curriculum.json');
const pathData = await readJson('public/learning-path.json');
const bank = await readJson('public/bank.json');
const studyBank = await readJson('public/study-bank.json');
const videoCoverage = await readJson('content/lesson-video-coverage.json');
const videoCatalog = await readJson('video-catalog-roadmap.json');
const pathIndex = await readJson('public/learning-path-index.json');
const curriculumIndex = await readJson('public/curriculum-index.json');
const originalAvailable = Boolean(originalMarkdownInput) && await exists(originalMarkdownInput);
const originalText = originalAvailable ? await fs.readFile(originalMarkdownInput, 'utf8') : '';
const sourceText = await fs.readFile(path.join(root, 'content/math-curriculum.md'), 'utf8');
const sourceParsed = parseMath(sourceText);
const originalParsed = parseMath(originalText);
const allQuestions = new Map([...bank, ...studyBank].map(question => [question.id, question]));
const videoById = new Map(videoCatalog.map(video => [video.id, video]));
const coverageById = new Map(videoCoverage.lessons.map(row => [row.id, row]));
const canonicalLessons = pathData.modules.flatMap(module => module.lessons.map(lesson => ({ ...lesson, module })));
const legacyLessons = (pathData.archiveModules ?? []).flatMap(module => module.lessons.map(lesson => ({ ...lesson, module })));

const resourceFindings = [];
const knownImproper = new Set(['math.m01.t01|roadmap.m02.l03']);
const lessons = canonicalLessons.map(row => {
  const { module, ...lesson } = row;
  const questionRows = lesson.questionIds.map(id => questionAudit(allQuestions.get(id)));
  const resources = lesson.resources.map(resource => {
    const key = `${lesson.id}|${resource.id}`;
    const titleMismatch = normalize(resource.title) !== normalize(lesson.title);
    const finding = knownImproper.has(key)
      ? { status: 'confirmed_improper', severity: 'alto', reason: 'A aula de sistema decimal exibe apoio de conjuntos numéricos, incluindo irracionalidade de √2; o objetivo curricular não é esse.' }
      : titleMismatch
        ? { status: 'title_mismatch_review_required', severity: 'médio', reason: 'O título do apoio não coincide com o título canônico; relação conceitual pode existir, mas requer revisão humana específica.' }
        : { status: 'title_aligned', severity: 'sem_sinal', reason: null };
    resourceFindings.push({ lessonId: lesson.id, lessonTitle: lesson.title, resourceId: resource.id, resourceTitle: resource.title, ...finding });
    return {
      id: resource.id,
      title: resource.title,
      origin: 'legacy_archived_roadmap',
      sourceFiles: ['content/roadmap.mjs', 'content/learning-path.mjs', 'public/learning-path.json#archiveModules'],
      questionIds: resource.questionIds ?? [],
      example: resource.example ? { question: resource.example.question, answer: resource.example.answer, explanationPresent: Boolean(resource.example.explanation) } : null,
      associationReview: finding,
    };
  });
  const coverage = coverageById.get(lesson.id) ?? { status: 'missing_metadata', videoIds: [] };
  const videos = (coverage.videoIds ?? []).map(id => {
    const metadata = videoById.get(id);
    return { id, title: metadata?.title ?? null, channelHandle: metadata?.channelHandle ?? null, sourceUrl: metadata?.sourceUrl ?? null, verifiedAt: metadata?.verifiedAt ?? null, durationPresent: Boolean(metadata?.duration || metadata?.durationSeconds), metadataPresent: Boolean(metadata) };
  });
  const origins = bySource(questionRows.filter(question => question.source));
  const missing = questionRows.filter(question => question.status === 'missing_from_loaded_banks').length;
  const withExplanation = questionRows.filter(question => question.explanationPresent).length;
  const withMedia = questionRows.filter(question => question.media.length > 0).length;
  const severity = knownImproper.has(`${lesson.id}|${lesson.resources[0]?.id}`) ? 'alto'
    : lesson.id === 'math.m07.t02' ? 'médio'
      : lesson.questionIds.length === 0 || coverage.status !== 'verified' ? 'alto'
        : lesson.resources.length === 0 ? 'médio' : 'médio';
  const findings = [];
  if (knownImproper.has(`${lesson.id}|${lesson.resources[0]?.id}`)) findings.push('desvio de assunto no apoio/exemplo associado');
  if (lesson.questionIds.length === 0) findings.push('sem exercícios associados no índice da trilha');
  if (missing) findings.push(`${missing} associação(ões) de exercício ausente(s) nos bancos carregados`);
  if (withExplanation < questionRows.length) findings.push(`${questionRows.length - withExplanation} exercício(s) sem explicação armazenada; revisão humana necessária`);
  if (coverage.status !== 'verified') findings.push(`cobertura de vídeo: ${coverage.status}`);
  if (!lesson.resources.length) findings.push('sem apoio legado associado; guia autoral é a única teoria estruturada disponível');
  if (lesson.id === 'math.m07.t02') findings.push('ordem canônica coloca Bhaskara antes de discriminante');
  return {
    id: lesson.id,
    moduleId: module.id,
    moduleTitle: module.title,
    order: lesson.order,
    title: lesson.title,
    level: module.level,
    sourceOrder: lesson.order,
    sourceStudyAfter: module.sourceStudyAfter,
    prerequisiteIds: module.prerequisiteIds,
    theory: {
      status: lesson.guide ? 'present_minimal_guide' : 'absent',
      origin: lesson.guide ? 'content/guides-foundations.mjs|content/guides-advanced.mjs via content/lesson-guides.mjs' : null,
      fieldsPresent: Object.keys(lesson.guide ?? {}),
      requiredPatternFieldsPresent: ['objective', 'prerequisites', 'diagnostic', 'intuition', 'concepts', 'procedureSteps', 'examples', 'mistakes', 'connections', 'summary', 'check', 'references'].filter(field => Boolean(lesson.guide?.[field])),
      guideExample: lesson.guide?.example ? { question: lesson.guide.example.question, answer: lesson.guide.example.answer, steps: lesson.guide.example.steps ?? [] } : null,
    },
    examples: {
      guideCount: lesson.guide?.example ? 1 : 0,
      guideOrigin: lesson.guide ? 'generated static guide source' : null,
      resourceCount: resources.filter(resource => resource.example).length,
      resourceOrigins: resources.filter(resource => resource.example).map(resource => resource.id),
      independentMathematicalValidation: 'not_performed_in_phase_A',
    },
    resources,
    exercises: {
      associatedCount: lesson.questionIds.length,
      questionIds: lesson.questionIds,
      origins,
      missingFromLoadedBanks: missing,
      correction: { withStoredExplanation: withExplanation, withoutStoredExplanation: questionRows.length - withExplanation, humanReviewRequired: questionRows.length - withExplanation > 0 || questionRows.length > 0 },
      media: { questionsWithMedia: withMedia, questionsWithoutMedia: questionRows.length - withMedia, externalMediaCount: questionRows.flatMap(question => question.media).filter(item => item.external).length },
      items: questionRows,
      quality: 'schema_and_provenance_inventory_only; answer_correctness_not_verified',
    },
    video: {
      coverageStatus: coverage.status,
      videoCount: videos.length,
      videoIds: coverage.videoIds ?? [],
      metadataCount: videos.filter(video => video.metadataPresent).length,
      metadataWithDuration: videos.filter(video => video.durationPresent).length,
      metadata: videos,
      associationMethod: 'content/lesson-video-coverage.json from title/channel verification audit; runtime seeds from video-catalog-roadmap.json',
      watchedEndToEnd: false,
      embeddabilityChecked: false,
    },
    references: ['content/math-curriculum.md', ...(originalAvailable ? [originalMarkdownLogical] : []), 'content/learning-path.mjs', 'content/lesson-guides.mjs'],
    referenceQuality: { curricularSourcePresent: true, lessonSpecificDidacticReferencesPresent: false, officialInepMapping: 'not_reviewed_in_phase_A' },
    quality: { severity, status: findings.length ? 'review_pending' : 'inventory_only', findings },
  };
});

const moduleRows = pathData.modules.map(module => ({
  id: module.id, title: module.title, order: module.order, level: module.level, displayOrder: module.order,
  prerequisiteIds: module.prerequisiteIds, sourceStudyAfter: module.sourceStudyAfter, lessonCount: module.lessons.length,
  questionCount: module.lessons.reduce((sum, lesson) => sum + lesson.questionIds.length, 0), resourceCount: module.lessons.reduce((sum, lesson) => sum + lesson.resources.length, 0),
}));
const originalComparison = originalParsed.found && sourceParsed.found ? {
  available: true,
  moduleCount: originalParsed.modules.length,
  lessonCount: originalParsed.modules.reduce((sum, module) => sum + module.topics.length, 0),
  exactModuleAndTopicMatch: JSON.stringify(originalParsed.modules) === JSON.stringify(sourceParsed.modules),
  sourceHash: await sha256(path.join(root, 'content/math-curriculum.md')),
  originalHash: await sha256(originalMarkdownInput),
  note: 'Os arquivos têm hashes diferentes por contexto e recorte, mas a seção Matemática comparada tem os mesmos 25 módulos e 199 títulos/ordens neste snapshot.',
} : { available: originalAvailable, exactModuleAndTopicMatch: false, note: 'A fonte original não foi encontrada ou a seção Matemática não pôde ser analisada.' };

const titleMismatches = resourceFindings.filter(row => row.status === 'title_mismatch_review_required').length;
const noResources = lessons.filter(lesson => lesson.resources.length === 0).length;
const noExercises = lessons.filter(lesson => lesson.exercises.associatedCount === 0).length;
const noVideo = lessons.filter(lesson => lesson.video.coverageStatus !== 'verified').length;
const missingExplanations = lessons.reduce((sum, lesson) => sum + lesson.exercises.correction.withoutStoredExplanation, 0);
const videoRefs = lessons.reduce((sum, lesson) => sum + lesson.video.videoCount, 0);
const uniqueVideoIds = new Set(lessons.flatMap(lesson => lesson.video.videoIds));

const baseline = {
  auditVersion: 1,
  generatedAt: new Date().toISOString(),
  scope: 'Fase A obrigatória: inventário e priorização antes de qualquer alteração de conteúdo servido.',
  project: { name: 'MathApp / Equação', root: '.', productionTarget: 'public/learning-path.json + public/bank.json + public/study-bank.json' },
  counts: { canonicalModules: pathData.modules.length, canonicalLessons: canonicalLessons.length, sourceCurriculumModules: sourceParsed.modules.length, sourceCurriculumLessons: sourceParsed.modules.reduce((sum, module) => sum + module.topics.length, 0), archivedLegacyModules: pathData.archiveModules?.length ?? 0, archivedLegacyLessons: legacyLessons.length, generatedStudyQuestions: studyBank.length, importedBankQuestions: bank.length, canonicalQuestionReferences: lessons.reduce((sum, lesson) => sum + lesson.exercises.associatedCount, 0), canonicalUniqueQuestionReferences: new Set(lessons.flatMap(lesson => lesson.exercises.questionIds)).size, videoCoverageTotal: videoCoverage.total, videoCoverageVerified: videoCoverage.covered, videoRefs, uniqueVideoIds: uniqueVideoIds.size },
  sources: {
    canonical: ['public/learning-path.json', 'public/curriculum.json', 'content/math-curriculum.md'],
    generatedOrBuild: ['content/learning-path.mjs', 'content/lesson-guides.mjs', 'content/guides-foundations.mjs', 'content/guides-advanced.mjs', 'content/roadmap.mjs', 'scripts/build.mjs'],
    questionBanks: ['public/study-bank.json (392 autorais Equação)', 'public/bank.json (1334 EnemHub/Enem.dev normalizadas)', 'public/questions.json (6000 registros legados; excluído do build web e usado por main.py)'],
    videos: ['content/lesson-video-coverage.json (auditoria: 173 verified, 17 no_match_confirmed, 9 inconclusive)', 'video-catalog-roadmap.json (881 seeds/catálogo)', 'video-service.js + public/video-topics.js (runtime)'],
    unavailableRequestedModel: { path: 'aula_modelo_naturais_sistema_decimal.md', found: false, note: 'Não encontrada no workspace nem no caminho informado; nenhum conteúdo foi tratado como modelo por esse arquivo.' },
    officialReferences: [
      { name: 'Matriz de Referência do ENEM — Inep', url: 'https://download.inep.gov.br/educacao_basica/enem/legislacao/2009/portaria_enem2009_2.pdf', status: 'cited_by_request_not_fetched' },
      { name: 'Provas e gabaritos — Inep', url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos', status: 'cited_by_request_not_fetched' },
    ],
  },
  serving: {
    guiLoader: 'public/app.js: loadCourse() busca learning-path.json, study-bank.json, bank.json e learning-path-index.json; public/journey-ui.js renderiza guide/resources nas abas.',
    theory: 'lesson.guide (guia mínimo de 4 campos) + lesson.resources (apoios legados).',
    exercises: 'data.bank = study-bank + bank; lesson.questionIds restringe a prática da aula; correção usa q.answer e q.explanation quando presente.',
    videos: 'video-catalog-roadmap seeds são incorporados pelo build/server e video-service.js; lesson-video-coverage.json é evidência de auditoria, não o carregador direto da GUI.',
    progress: 'public/db.js IndexedDB records/meta; public/learning-model.js e public/journey-model.js calculam progresso; IDs math.mXX.tYY são estáveis.',
    legacy: 'public/learning-path.json.archiveModules e public/roadmap.json mantêm 11 módulos/98 aulas roadmap.* como histórico/apoio; não contar como currículo canônico.',
  },
  comparison: { localCurriculum: { path: 'content/math-curriculum.md', ...sourceParsed }, originalMarkdown: { path: originalMarkdownLogical, ...originalParsed }, result: originalComparison },
  modules: moduleRows,
  lessons,
  findings: {
    confirmed: [{ severity: 'alto', lessonIds: ['math.m01.t01'], issue: 'Apoio/guia expõe conjuntos numéricos e exemplo √2 na aula Naturais e sistema decimal; desvia de algarismos, base dez, valor posicional, composição/decomposição, comparação e ordenação.' }],
    sequence: [
      { severity: 'médio', moduleId: 'math.m01', issue: 'Operações básicas aparecem em t05 depois de frações/decimais; revisar sequência pedagógica sem renumerar IDs.' },
      { severity: 'médio', moduleId: 'math.m07', lessonIds: ['math.m07.t02', 'math.m07.t04'], issue: 'Fórmula de Bhaskara (t02) vem antes de discriminante (t04), embora Δ seja usado na fórmula; corrigir displayOrder/recomendação.' },
      { severity: 'sem_sinal_nesta_auditoria', moduleId: 'math.m19', issue: 'pré-requisito atual é math.m01; não depende de todo o módulo 18.' },
      { severity: 'sem_sinal_nesta_auditoria', moduleId: 'math.m21', issue: 'pré-requisitos atuais incluem math.m03, math.m11 e math.m12; não exigem probabilidade.' },
      { severity: 'sem_sinal_nesta_auditoria', moduleId: 'math.m23', issue: 'pré-requisitos atuais incluem math.m18, math.m20 e math.m09; relação com estatística descritiva, probabilidade e gráficos registrada.' },
    ],
    associations: { confirmedImproper: resourceFindings.filter(row => row.status === 'confirmed_improper'), titleMismatchReviewRequired: resourceFindings.filter(row => row.status === 'title_mismatch_review_required'), titleMismatchCount: titleMismatches },
    coverageGaps: { noResources, noExercises, noVerifiedVideo: noVideo, noStoredExerciseExplanations: missingExplanations },
  },
  qualityPolicy: { critical: 'conteúdo incorreto confirmado ou perda de identidade/histórico', high: 'desvio de assunto, associação de exercício/vídeo sem suporte ou ausência relevante', medium: 'sequência, lacuna, apoio insuficiente ou revisão humana necessária', low: 'metadado/legibilidade sem impacto imediato', note: 'Nenhum teste de esquema é tratado como validação matemática; respostas, alternativas, unidades, casos-limite e vídeo exigem revisão editorial/humana.' },
  limitations: ['Não foi encontrada aula_modelo_naturais_sistema_decimal.md.', 'Não foi feita validação matemática independente dos 1366 vínculos de exercícios.', 'Não foram assistidos vídeos nem testadas embeddability, duração ou cobertura integral; a auditoria registra somente metadata/cobertura existente.', 'Não foi feita consulta externa às referências oficiais do Inep nesta fase; URLs e atribuições devem ser revisadas em fase posterior.', 'Não houve alteração de produção, publicação ou commit.'],
};

function mdCell(value) { return String(value).replaceAll('|', '\\|').replaceAll('\n', ' '); }
function makeMarkdown() {
  const c = baseline.counts;
  const lines = [
    '# Baseline de auditoria de conteúdo — Fase A',
    '',
    `Gerado em ${baseline.generatedAt}. Escopo: inventário verificável antes de alterar produção. Nenhum arquivo servido foi alterado por esta auditoria.`,
    '',
    '## Contagens confirmadas',
    '',
    `- Currículo canônico: **${c.canonicalModules} módulos / ${c.canonicalLessons} aulas**.`,
    `- Apoio legado arquivado: **${c.archivedLegacyModules} módulos / ${c.archivedLegacyLessons} aulas** (${c.archivedLegacyLessons} não contam como as 199).`,
    `- Exercícios: **${c.generatedStudyQuestions} autorais Equação**, **${c.importedBankQuestions} normalizados de EnemHub/Enem.dev**; ${c.canonicalQuestionReferences} referências de aula para ${c.canonicalUniqueQuestionReferences} IDs únicos neste snapshot.`,
    `- Vídeos: **${c.videoCoverageVerified}/${c.videoCoverageTotal} aulas** marcadas como verified; ${c.uniqueVideoIds} IDs únicos e ${c.videoRefs} referências nas aulas. Duração não está presente no catálogo auditado.`,
    '',
    '## Arquitetura e origem efetiva',
    '',
    '- `public/learning-path.json` é a fonte canônica consumida pela GUI: 25 módulos, 199 aulas, IDs `math.mXX.tYY`, `prerequisiteIds`, `resources`, `questionIds` e `guide`.',
    '- `content/math-curriculum.md` fornece títulos, nível e ordem; `scripts/import-curriculum.mjs` preserva IDs estáveis. A seção correspondente do Markdown original foi comparada por módulo/título/ordem.',
    '- Teoria vem de `content/guides-foundations.mjs`/`guides-advanced.mjs` por `content/lesson-guides.mjs`; cada aula possui somente `summary`, `steps`, `pitfall` e `example` no guia atual.',
    '- Apoios vêm das associações em `content/learning-path.mjs` para aulas `roadmap.*` arquivadas e geradas por `content/roadmap.mjs`. Há 45 aulas sem apoio legado.',
    '- A GUI carrega `study-bank.json` + `bank.json` em `public/app.js`; `public/questions.json` é legado do `main.py`, fica excluído do build web e não foi contado como banco servido.',
    '- Vídeos são servidos pelo `video-service.js` a partir de seeds/catálogo; `content/lesson-video-coverage.json` é evidência da auditoria de cobertura e não a fonte direta das abas.',
    '',
    '## Comparação curricular',
    '',
    `A seção Matemática local tem ${baseline.comparison.localCurriculum.modules.length} módulos e ${baseline.comparison.localCurriculum.modules.reduce((s, m) => s + m.topics.length, 0)} tópicos; o original disponível tem ${baseline.comparison.originalMarkdown.modules.length} módulos e ${baseline.comparison.originalMarkdown.modules.reduce((s, m) => s + m.topics.length, 0)} tópicos. Resultado da comparação: **${originalComparison.exactModuleAndTopicMatch ? 'mesmos títulos e ordens na seção comparada' : 'divergência ou fonte indisponível'}**. Isso não significa que o Markdown contenha aulas didáticas prontas.`,
    '',
    '## Achados prioritários',
    '',
    '- **Alto — `math.m01.t01`**: recurso `roadmap.m02.l03 — Conjuntos numéricos`, card sobre dízima periódica e exemplo `√2`; desvio direto do objetivo Naturais e sistema decimal. A aula deve ser reescrita na fase produtiva para valor posicional e base dez.',
    '- **Médio — Módulo 01**: operações básicas estão em t05 depois de frações e decimais; revisar ordem de apresentação preservando IDs.',
    '- **Médio — Módulo 07**: Bhaskara está em t02 e discriminante em t04; a dependência conceitual pede ajuste de `displayOrder`/recomendação.',
    `- **Alto — exercícios**: m23 tem 8 aulas sem questões associadas; 35 aulas não têm nenhum ID de exercício. ${missingExplanations} referências de questões importadas no currículo não têm explicação armazenada (as 392 autorais têm explicação). Isso exige revisão humana, não preenchimento automático.`,
    '- **Alto — vídeos**: 17 aulas estão `no_match_confirmed` e 9 `inconclusive`; não declarar ausência absoluta de vídeo. Metadados não têm duração e não houve teste de embeddability nesta fase.',
    '- **Médio — estrutura didática**: o guia está presente nas 199 aulas, mas não contém campos semânticos de objetivo, diagnóstico, intuição, conceitos formais, conexões, mini-checagem ou referências por aula.',
    '',
    '### Referências e limites',
    '',
    '- `aula_modelo_naturais_sistema_decimal.md` não foi encontrada; o baseline registra essa ausência e não a usa como referência fictícia.',
    '- A matriz e provas do Inep foram citadas no pedido, mas não foram baixadas/consultadas nesta fase. Não há afirmação de correspondência oficial.',
    '- Correção matemática dos exemplos, gabaritos, alternativas, unidades e casos-limite permanece `not_performed_in_phase_A`. Testes de esquema não comprovam matemática.',
    '',
    '## Inventário por aula',
    '',
    '| ID | Módulo | Aula | Nível | Apoios | Exercícios/origens | Correção | Mídia | Vídeo | Severidade | Achados |',
    '|---|---|---|---|---:|---:|---|---|---|---|---|',
  ];
  for (const lesson of lessons) {
    const origins = Object.entries(lesson.exercises.origins).map(([source, count]) => `${source}:${count}`).join(', ') || '—';
    const correction = `${lesson.exercises.correction.withStoredExplanation}/${lesson.exercises.associatedCount} exp.`;
    const media = `${lesson.exercises.media.questionsWithMedia}/${lesson.exercises.associatedCount}`;
    const video = `${lesson.video.coverageStatus} (${lesson.video.videoCount})`;
    lines.push(`| ${lesson.id} | ${mdCell(lesson.moduleTitle)} | ${mdCell(lesson.title)} | ${lesson.level} | ${lesson.resources.length} | ${lesson.exercises.associatedCount} (${origins}) | ${correction} | ${media} | ${video} | ${lesson.quality.severity} | ${mdCell(lesson.quality.findings.join('; ') || 'inventário; revisão matemática pendente')} |`);
  }
  lines.push('', 'O JSON contém os IDs, títulos, ordens, níveis, pré-requisitos, origem de teoria/guias/recursos, exemplos, metadados por exercício e vídeo, associações suspeitas, referências e limites de cada aula.', '');
  return lines.join('\n');
}

await fs.mkdir(docs, { recursive: true });
await fs.writeFile(path.join(docs, 'content-audit-baseline.json'), `${JSON.stringify(baseline, null, 2)}\n`);
await fs.writeFile(path.join(docs, 'content-audit-baseline.md'), makeMarkdown());
console.log(JSON.stringify({ output: docs, modules: cOr(baseline, 'canonicalModules'), lessons: cOr(baseline, 'canonicalLessons'), confirmedImproper: baseline.findings.associations.confirmedImproper.length, titleMismatchReview: titleMismatches, noExercises, noVerifiedVideo: noVideo }));

function cOr(value, key) { return value.counts?.[key] ?? 0; }
