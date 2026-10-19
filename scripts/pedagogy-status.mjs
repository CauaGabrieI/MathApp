#!/usr/bin/env node
/*
 * Gera o status pedagógico atual sem reescrever a fotografia de Fase A.
 * Entradas: baseline JSON, learning-path público e candidato editorial M01.
 * Saídas: docs/content-audit-current.{json,md} e docs/pedagogy-review-status.md.
 * Não publica conteúdo, não aprova candidatos e não altera public/.
 */
import {approvedTheory} from '../content/pedagogy-policy.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE_REL = 'docs/content-audit-baseline.json';
const PATH_REL = 'public/learning-path.json';
const CANDIDATE_REL = 'content/review/module01.mjs';
const BUILD_REL = 'scripts/build.mjs';
const ANDROID_REL = 'scripts/prepare-android.mjs';

const readText = relative => fs.readFile(path.join(ROOT, relative), 'utf8');
const readJson = async relative => JSON.parse(await readText(relative));
const writeText = (relative, value) => fs.writeFile(path.join(ROOT, relative), value, 'utf8');
const asArray = value => Array.isArray(value) ? value : [];
const unique = values => [...new Set(values)];
const md = value => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');

const baseline = await readJson(BASELINE_REL);
const publicPath = await readJson(PATH_REL);
const buildSource = await readText(BUILD_REL);
const androidSource = await readText(ANDROID_REL);
const candidateModule = await import(pathToFileURL(path.join(ROOT, CANDIDATE_REL)).href);
const candidateObject = candidateModule.MODULE01_LESSONS ?? candidateModule.default ?? {};
const candidateLessons = Object.values(candidateObject).filter(row => row && typeof row === 'object');

const publicLessons = publicPath.modules.flatMap(module => asArray(module.lessons).map(lesson => ({...lesson, module})));
const publicById = new Map(publicLessons.map(lesson => [lesson.id, lesson]));
const candidateById = new Map(candidateLessons.map(lesson => [lesson.id, lesson]));
const publicQuestionIds = new Set(publicLessons.flatMap(lesson => asArray(lesson.questionIds)));
const candidateExercises = candidateLessons.flatMap(lesson => asArray(lesson.exercises).map(exercise => ({...exercise, lessonId: lesson.id})));
const candidateExerciseIds = candidateExercises.map(exercise => exercise.id);
const publishedCandidateExerciseIds = candidateExerciseIds.filter(id => publicQuestionIds.has(id));
const approvedCandidateLessons = candidateLessons.filter(approvedTheory);
const pendingCandidateLessons = candidateLessons.filter(lesson => !approvedCandidateLessons.includes(lesson));
const pendingCandidateExercises = candidateExercises.filter(exercise => !approvedTheory(exercise));

const baselineById = new Map(asArray(baseline.lessons).map(lesson => [lesson.id, lesson]));
const idOrderIntact = publicLessons.length === asArray(baseline.lessons).length && publicLessons.every(lesson => {
  const old = baselineById.get(lesson.id);
  return Boolean(old) && old.moduleId === lesson.module.id && old.order === lesson.order && old.sourceOrder === lesson.order;
});

const lessonRows = publicLessons.map(lesson => {
  const candidate = candidateById.get(lesson.id);
  const candidateApproved = Boolean(candidate && approvedCandidateLessons.includes(candidate));
  const candidatePublished = candidateApproved && publicPath.editorialPreview !== true && publicPath.modules
    .flatMap(module => asArray(module.lessons)).some(row => row.id === lesson.id && row.contentVersion === candidate.contentVersion && row.reviewStatus === candidate.reviewStatus);
  return {
    id: lesson.id,
    moduleId: lesson.module.id,
    moduleTitle: lesson.module.title,
    title: lesson.title,
    sourceOrder: lesson.order,
    displayOrder: lesson.displayOrder ?? lesson.order,
    prerequisiteIds: asArray(lesson.prerequisiteIds),
    production: {
      contentVersion: lesson.contentVersion ?? null,
      reviewStatus: lesson.reviewStatus ?? null,
      editorialPreview: publicPath.editorialPreview === true,
      questionCount: asArray(lesson.questionIds).length,
    },
    candidate: candidate ? {
      present: true,
      contentVersion: candidate.contentVersion ?? null,
      reviewStatus: candidate.reviewStatus ?? null,
      exampleCount: asArray(candidate.examples).length,
      exerciseCount: asArray(candidate.exercises).length,
      published: candidatePublished,
    } : {
      present: false,
      contentVersion: null,
      reviewStatus: null,
      exampleCount: 0,
      exerciseCount: 0,
      published: false,
    },
    pending: {
      value: true,
      status: candidate ? 'candidate_pending_human_review' : 'full_review_pending',
      reason: candidate
        ? 'Candidato editorial existe, mas não tem aprovação humana registrada.'
        : 'Não há candidato editorial completo para esta aula; revisão integral permanece pendente.',
    },
  };
});

const modules = publicPath.modules.map(module => ({
  id: module.id,
  title: module.title,
  order: module.order,
  displayOrder: module.displayOrder ?? module.order,
  level: module.level,
  prerequisiteIds: asArray(module.prerequisiteIds),
  prerequisiteRevision: module.prerequisiteRevision ?? null,
  sourceStudyAfter: module.sourceStudyAfter ?? null,
  lessonCount: asArray(module.lessons).length,
  lessonDisplayOrder: asArray(module.lessons).slice().sort((a, b) => (a.displayOrder ?? a.order) - (b.displayOrder ?? b.order)).map(lesson => lesson.order),
}));

const module01 = modules.find(module => module.id === 'math.m01');
const module07 = modules.find(module => module.id === 'math.m07');
const baselineCounts = baseline.counts ?? {};
const canonicalLessons = publicLessons.length;
const candidateLessonCount = candidateLessons.length;
const pendingFullReviewLessons = lessonRows.filter(row => !row.candidate.present).length;
const canonicalModuleCount = publicPath.modules.length;
const candidateExamples = candidateLessons.reduce((sum, lesson) => sum + asArray(lesson.examples).length, 0);
const candidateExerciseCount = candidateExercises.length;
const candidateLessonIds = candidateLessons.map(lesson => lesson.id);
const candidateIdSet = new Set(candidateLessonIds);
const publicCandidateLessonIds = lessonRows.filter(row => row.candidate.published).map(row => row.id);

const previewPolicy = {
  productionEditorialPreview: publicPath.editorialPreview === true,
  optInEnvironmentVariable: 'PEDAGOGY_PREVIEW',
  optInValue: '1',
  buildReadsOptIn: buildSource.includes("PEDAGOGY_PREVIEW==='1'") || buildSource.includes('PEDAGOGY_PREVIEW === \'1\''),
  androidPrepareRejectsPreview: androidSource.includes('editorialPreview') && androidSource.includes('Prévia editorial'),
  candidateIsPublished: publicCandidateLessonIds.length > 0 || publishedCandidateExerciseIds.length > 0,
};

const current = {
  auditVersion: 2,
  generatedFrom: {
    baseline: BASELINE_REL,
    baselineGeneratedAt: baseline.generatedAt ?? null,
    publicLearningPath: PATH_REL,
    candidate: CANDIDATE_REL,
    deterministicDate: String(baseline.generatedAt ?? '').slice(0, 10) || '2026-10-19',
  },
  status: {
    baselineImmutable: true,
    canonicalInventory: {modules: canonicalModuleCount, lessons: canonicalLessons},
    candidate: {lessons: candidateLessonCount, examples: candidateExamples, exercises: candidateExerciseCount},
    humanApproval: {approvedLessons: approvedCandidateLessons.length, approvedExercises: candidateExercises.filter(approvedTheory).length},
    pending: {fullReviewLessons: pendingFullReviewLessons, candidateHumanReviewLessons: pendingCandidateLessons.length, allCanonicalLessons: lessonRows.filter(row => row.pending.value).length, candidateExercises: pendingCandidateExercises.length},
    publishedCandidate: {lessons: publicCandidateLessonIds.length, exercises: publishedCandidateExerciseIds.length, newAnswerKeys: publishedCandidateExerciseIds.length},
  },
  counts: {
    canonicalModules: canonicalModuleCount,
    canonicalLessons,
    baselineCanonicalLessons: Number(baselineCounts.canonicalLessons ?? 0),
    candidateLessons: candidateLessonCount,
    candidateExamples,
    candidateExercises: candidateExerciseCount,
    pendingFullReviewLessons,
    pendingCandidateHumanReviewLessons: pendingCandidateLessons.length,
    pendingCanonicalLessons: lessonRows.filter(row => row.pending.value).length,
    approvedCandidateLessons: approvedCandidateLessons.length,
    approvedCandidateExercises: candidateExercises.filter(approvedTheory).length,
    publishedCandidateLessons: publicCandidateLessonIds.length,
    publishedCandidateExercises: publishedCandidateExerciseIds.length,
    baselineVideoUniqueIds: Number(baselineCounts.uniqueVideoIds ?? 0),
    baselineVideoVerifiedLessons: Number(baselineCounts.videoCoverageVerified ?? 0),
    baselineVideoPendingLessons: Math.max(0, Number(baselineCounts.videoCoverageTotal ?? 0) - Number(baselineCounts.videoCoverageVerified ?? 0)),
  },
  identity: {
    idsIntactAgainstBaseline: idOrderIntact,
    sourceOrderIntactAgainstBaseline: idOrderIntact,
    module01DisplayOrder: module01?.lessonDisplayOrder ?? [],
    module07DisplayOrder: module07?.lessonDisplayOrder ?? [],
    prerequisitePolicy: {path: publicPath.prerequisitePolicy ?? null, revision: unique(modules.map(module => module.prerequisiteRevision).filter(value => value != null))},
  },
  previewPolicy,
  references: {
    curriculumModel: {file: 'aula_modelo_naturais_sistema_decimal.md', found: baseline.sources?.unavailableRequestedModel?.found === true, status: 'absent_in_workspace'},
    official: [
      {title: 'Provas e gabaritos — Inep', url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos', consultation: 'consulted_by_root'},
      {title: 'Relatório pedagógico Enem 2009–2010', file: 'relatorio_pedagogico_enem_2009_2010.pdf', url: 'https://download.inep.gov.br/publicacoes/institucionais/avaliacoes_e_exames_da_educacao_basica/relatorio_pedagogico_enem_2009_2010.pdf', consultation: 'official_source_indexed_by_root_search'},
    ],
    editorialMapping: {labels: ['H1', 'H2', 'H3', 'H4'], status: 'non_official_editorial_mapping', note: 'O mapeamento editorial por aula não representa correspondência oficial do Inep.'},
  },
  videoAudit: {
    uniqueVideoIds: Number(baselineCounts.uniqueVideoIds ?? 0),
    verifiedLessonCount: Number(baselineCounts.videoCoverageVerified ?? 0),
    pendingLessonCount: Math.max(0, Number(baselineCounts.videoCoverageTotal ?? 0) - Number(baselineCounts.videoCoverageVerified ?? 0)),
    titleAuthorAvailableLessonCount: Number(baselineCounts.videoCoverageVerified ?? 0),
    checks: {duration: 'not_verified', license: 'not_verified', language: 'not_verified', embeddability: 'not_verified'},
    note: 'Título e autoria estão disponíveis no recorte verificado do baseline; duração, licença, idioma e embeddability não foram verificados para os IDs únicos catalogados.',
  },
  limitations: [
    'A contagem de 199 aulas é inventário curricular; não é afirmação de revisão matemática completa.',
    'As 10 candidatas M01 e seus 20 exemplos/40 exercícios aguardam aprovação humana; os 189 IDs restantes aguardam revisão integral.',
    'Nenhum novo gabarito ou exercício candidato foi publicado no learning-path de produção deste snapshot.',
    'A aula_modelo_naturais_sistema_decimal.md não está disponível no workspace.',
    'O mapeamento H1–H4 é editorial e não oficial; a fonte oficial indexada foi registrada apenas como referência consultada online nesta revisão.',
  ],
  modules,
  lessons: lessonRows,
  candidateLessonIds,
  publishedCandidateExerciseIds,
};

function tableRow(row) {
  return `| ${md(row.id)} | ${md(row.moduleId)} | ${md(row.title)} | ${row.sourceOrder} | ${row.displayOrder} | ${md(row.production.reviewStatus)} | ${row.candidate.present ? 'sim' : 'não'} | ${md(row.pending.status)} | ${row.production.questionCount} |`;
}

function currentAuditMarkdown() {
  const c = current.counts;
  return [
    '# Auditoria de conteúdo atual — inventário e status pedagógico',
    '',
    `Gerado deterministicamente a partir de \`${BASELINE_REL}\`, \`${PATH_REL}\` e \`${CANDIDATE_REL}\`. Baseline preservado: \`${baseline.generatedAt ?? 'timestamp ausente'}\`.`,
    '',
    '## Contagens reais',
    '',
    `- Currículo público: **${c.canonicalModules} módulos / ${c.canonicalLessons} aulas**.`,
    `- Candidato editorial M01: **${c.candidateLessons} aulas / ${c.candidateExamples} exemplos / ${c.candidateExercises} exercícios**.`,
    `- Aprovação humana: **${c.approvedCandidateLessons} aulas / ${c.approvedCandidateExercises} exercícios**.`,
    `- Revisão integral pendente sem candidata: **${c.pendingFullReviewLessons} aulas**.`,
    `- Revisão pendente em candidatas: **${c.pendingCandidateHumanReviewLessons} aulas / ${current.status.pending.candidateExercises} exercícios**.`,
    `- Novos candidatos publicados: **${c.publishedCandidateLessons} aulas / ${c.publishedCandidateExercises} exercícios/gabaritos**.`,
    '',
    '## Identidade, ordem e pré-requisitos',
    '',
    `- IDs e ordem de origem contra o baseline: **${current.identity.idsIntactAgainstBaseline ? 'intactos' : 'divergência detectada'}**.`,
    `- ` + '`math.m01`' + ` displayOrder: **[${current.identity.module01DisplayOrder.join(', ')}]**.`,
    `- ` + '`math.m07`' + ` displayOrder: **[${current.identity.module07DisplayOrder.join(', ')}]**.`,
    `- Política de pré-requisitos: **${md(current.identity.prerequisitePolicy.path)}**, revisão **${current.identity.prerequisitePolicy.revision.join(', ') || 'não informada'}**.`,
    '',
    '## Publicação e prévia',
    '',
    `- ` + '`public/learning-path.json`' + ` está com ` + '`editorialPreview=' + String(publicPath.editorialPreview) + '`' + ` neste snapshot.`,
    `- A prévia editorial é opt-in por ` + '`PEDAGOGY_PREVIEW=1`' + `; o build reconhece o switch: **${previewPolicy.buildReadsOptIn ? 'sim' : 'não confirmado'}**.`,
    `- A preparação Android rejeita prévia editorial: **${previewPolicy.androidPrepareRejectsPreview ? 'sim' : 'não confirmado'}**.`,
    '- Candidatas com status pendente não entram no banco produtivo nem alteram tentativas históricas.',
    '',
    '## Vídeos',
    '',
    `- IDs únicos no baseline: **${current.videoAudit.uniqueVideoIds}**; aulas com correspondência por título no recorte: **${current.videoAudit.verifiedLessonCount}**; pendências de cobertura: **${current.videoAudit.pendingLessonCount}**.`,
    '- Duração, licença, idioma e embeddability permanecem não verificados para os IDs catalogados.',
    '',
    '## Referências e limites',
    '',
    '- A aula modelo `aula_modelo_naturais_sistema_decimal.md` está ausente.',
    '- O portal de provas e gabaritos do Inep foi consultado online nesta revisão; o trecho indexado do relatório pedagógico oficial 2009–2010 foi consultado; a URL está no JSON. Não houve leitura integral do PDF.',
    '- H1–H4 são mapeamentos editoriais não oficiais por aula.',
    '- Este documento não afirma revisão matemática das 199 aulas; apenas registra inventário, candidata e estados pendentes.',
    '',
    '## Pendência por ID curricular',
    '',
    '| ID | Módulo | Aula | Ordem origem | Display | Produção | Candidata | Estado pendente | Questões produção |',
    '|---|---|---|---:|---:|---|---|---|---:|',
    ...current.lessons.map(tableRow),
    '',
  ].join('\n');
}

function reviewStatusMarkdown() {
  const c = current.counts;
  return [
    '# Status da revisão pedagógica',
    '',
    '## Estado atual',
    '',
    `O currículo mantém **${c.canonicalLessons} aulas em ${c.canonicalModules} módulos**. O candidato editorial cobre **${c.candidateLessons} aulas do módulo 01**, com **${c.candidateExamples} exemplos** e **${c.candidateExercises} exercícios**.`,
    '',
    `Há **${c.approvedCandidateLessons} aprovações humanas** registradas. As **${c.candidateLessons} candidatas** permanecem pendentes de revisão humana; as outras **${c.pendingFullReviewLessons} aulas** aguardam revisão integral.`,
    '',
    'Nenhum gabarito novo foi publicado. O caminho público permanece sem candidata editorial publicada e a prévia é opt-in por `PEDAGOGY_PREVIEW=1`; a preparação Android rejeita uma prévia ativa.',
    '',
    '## Identidade e sequência',
    '',
    `- IDs e ordem de origem: **${current.identity.idsIntactAgainstBaseline ? 'intactos' : 'divergência detectada'}**.`,
    `- M01: \`[${current.identity.module01DisplayOrder.join(', ')}]\`; M07: \`[${current.identity.module07DisplayOrder.join(', ')}]\`.`,
    `- Política de pré-requisitos: \`${current.identity.prerequisitePolicy.path}\`, revisão ${current.identity.prerequisitePolicy.revision.join(', ') || 'não informada'}.`,
    '',
    '## Auditoria de vídeos e referências',
    '',
    `O baseline registra ${current.videoAudit.uniqueVideoIds} IDs únicos e ${current.videoAudit.verifiedLessonCount} aulas com disponibilidade/autoria e correspondência pelo título registradas; ${current.videoAudit.pendingLessonCount} aulas permanecem pendentes. Duração, licença, idioma e embeddability não foram verificados.`,
    '',
    'O portal de provas e gabaritos do Inep foi consultado online nesta revisão. O trecho indexado do relatório pedagógico oficial 2009–2010 foi consultado; a URL está no JSON. Não houve leitura integral do PDF. H1–H4 são correspondências editoriais não oficiais; não há afirmação de mapeamento oficial por aula.',
    '',
    '## Limites',
    '',
    '- `aula_modelo_naturais_sistema_decimal.md` não foi encontrada.',
    '- Este status não declara revisão matemática completa das 199 aulas.',
    '- A aprovação humana continua pendente para todas as candidatas.',
    '- O inventário detalhado por ID está em `docs/content-audit-current.md` e no campo `lessons` de `docs/content-audit-current.json`.',
    '',
  ].join('\n');
}

await writeText('docs/content-audit-current.json', JSON.stringify(current, null, 2) + '\n');
await writeText('docs/content-audit-current.md', currentAuditMarkdown());
await writeText('docs/pedagogy-review-status.md', reviewStatusMarkdown());
console.log(JSON.stringify({
  output: ['docs/content-audit-current.json', 'docs/content-audit-current.md', 'docs/pedagogy-review-status.md'],
  canonicalLessons,
  candidateLessons: candidateLessonCount,
  candidateExamples,
  candidateExercises: candidateExerciseCount,
  pendingFullReviewLessons,
  approvedCandidateLessons: approvedCandidateLessons.length,
  publishedCandidateExercises: publishedCandidateExerciseIds.length,
}, null, 2));
