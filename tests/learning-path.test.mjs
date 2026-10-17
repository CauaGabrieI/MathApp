import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { IDBFactory } from 'fake-indexeddb';
import { parseMathMarkdown } from '../scripts/import-curriculum.mjs';
import { createRoadmap } from '../content/roadmap.mjs';
import { createLearningPath } from '../content/learning-path.mjs';
import { validateRoadmap, lessonState, journeyProgress, nextLesson, learnedQuestions, learnedCards, examSelection } from '../public/journey-model.js';
import { makeBackup, validateBackup, mergeBackups, hydrateRecords } from '../public/backup-model.js';
import { openDB, closeDB, snapshot, saveLearningTopic, migrateRoadmap, saveCardReview, beginModuleExam, saveExamAnswer, restoreBackup } from '../public/db.js';

const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const curriculum = readJSON('public/curriculum.json');
const source = parseMathMarkdown(fs.readFileSync('content/math-curriculum.md', 'utf8'));
const legacyIndex = readJSON('public/curriculum-index.json');
const { roadmap: legacyRoadmap, questions: legacyQuestions } = createRoadmap();
const { path, index } = createLearningPath(curriculum, legacyRoadmap, legacyIndex);
const bank = [...new Map([...readJSON('public/bank.json'), ...legacyQuestions].map(question => [question.id, question])).values()];
const oldLessons = new Map(legacyRoadmap.modules.flatMap(module => module.lessons.map(lesson => [lesson.id, lesson])));
const now = Date.now();
const mark = (id, studied = true) => ({ id, studied, startedAt: now - 2000, studiedAt: studied ? now - 1000 : null, updatedAt: now - 1000 });
const entriesFor = (...modules) => modules.flatMap(module => module.lessons.map(lesson => mark(lesson.id)));
const unique = values => [...new Set(values)];
const sorted = values => [...values].sort();

async function withDB(action) {
  closeDB();
  globalThis.indexedDB = new IDBFactory();
  await openDB();
  try { await action(); } finally { closeDB(); }
}

test('a trilha publica exatamente os 25 módulos e 199 subtópicos do Markdown como aulas estáveis', () => {
  assert.equal(path.schemaVersion, 2);
  assert.equal(validateRoadmap(path), true);
  assert.equal(validateRoadmap(legacyRoadmap), true, 'O acervo schema 1 continua válido');
  assert.equal(path.modules.length, 25);
  assert.equal(path.modules.flatMap(module => module.lessons).length, 199);
  path.modules.forEach((module, moduleIndex) => {
    const sourceModule = source[moduleIndex];
    assert.equal(module.id, `math.m${String(moduleIndex + 1).padStart(2, '0')}`);
    assert.equal(module.title, sourceModule.title);
    assert.equal(module.level, sourceModule.level);
    assert.equal(module.order, sourceModule.sourceNumber);
    assert.equal(module.sourceStudyAfter, sourceModule.sourceStudyAfter);
    assert.deepEqual(module.lessons.map(lesson => lesson.title), sourceModule.topics);
    assert.deepEqual(module.lessons.map(lesson => lesson.order), sourceModule.topics.map((_, i) => i + 1));
    assert.deepEqual(module.lessons.map(lesson => lesson.id), curriculum.modules[moduleIndex].topics.map(topic => topic.id));
  });
  assert.deepEqual(readJSON('public/learning-path.json'), path, 'O build deve entregar a trilha canônica');
  assert.deepEqual(readJSON('public/learning-path-index.json'), index, 'O índice publicado corresponde à trilha');
});

test('três etapas cobrem cada módulo uma vez na ordem e no nível da fonte, com dependências sem ciclos', () => {
  assert.deepEqual(path.stages.map(stage => stage.level), ['Básico', 'Intermediário', 'Avançado']);
  assert.deepEqual(path.stages.map(stage => stage.order), [1, 2, 3]);
  const covered = path.stages.flatMap(stage => stage.moduleIds);
  assert.equal(new Set(covered).size, 25);
  assert.deepEqual(covered, path.modules.map(module => module.id));
  for (const stage of path.stages) assert.deepEqual(stage.moduleIds, source.filter(module => module.level === stage.level).map(module => `math.m${String(module.sourceNumber).padStart(2, '0')}`));
  const byId = new Map(path.modules.map(module => [module.id, module]));
  const done = new Set(), active = new Set();
  function visit(id) {
    assert.ok(byId.has(id), `Pré-requisito inexistente: ${id}`);
    assert.equal(active.has(id), false, `Ciclo em ${id}`);
    if (done.has(id)) return;
    active.add(id);
    byId.get(id).prerequisiteIds.forEach(visit);
    active.delete(id); done.add(id);
  }
  path.modules.forEach(module => visit(module.id));
  assert.equal(path.prerequisitePolicy, 'recommended');
  assert.ok(!byId.get('math.m13').prerequisiteIds.includes('math.m12'));
  assert.ok(!byId.get('math.m18').prerequisiteIds.includes('math.m17'));
  assert.ok(!byId.get('math.m21').prerequisiteIds.includes('math.m20'));
  const repeated = structuredClone(path);
  repeated.stages[1].moduleIds.push(repeated.stages[0].moduleIds[0]);
  assert.throws(() => validateRoadmap(repeated));
  const cyclic = structuredClone(path);
  cyclic.modules[0].prerequisiteIds = ['math.m02'];
  assert.throws(() => validateRoadmap(cyclic));
});

test('apoios e exercícios mantêm suas identidades e associações; tópicos sem material ficam explicitamente vazios', () => {
  assert.equal(path.archiveModules.length, 11);
  assert.equal(path.archiveModules.flatMap(module => module.lessons).length, 98);
  assert.deepEqual(path.archiveModules.map(({ archived, ...module }) => module), legacyRoadmap.modules);
  const questionIds = new Set(bank.map(question => question.id));
  for (const module of path.modules) {
    for (const lesson of module.lessons) {
      for (const resource of lesson.resources) assert.deepEqual(resource, oldLessons.get(resource.id), `Material alterado ou inventado: ${resource.id}`);
      const expected = unique([
        ...lesson.resources.flatMap(resource => resource.questionIds),
        ...(legacyIndex.topicQuestions[lesson.id] ?? []).filter(id => {
          const tags = legacyIndex.questionTags[id];
          return tags?.moduleIds?.length === 1 && tags.moduleIds[0] === module.id;
        }),
      ]);
      assert.deepEqual(lesson.questionIds, expected, `Exercícios indevidos na aula ${lesson.id}`);
      assert.deepEqual(index.lessonQuestions[lesson.id], expected);
      assert.ok(lesson.questionIds.every(id => questionIds.has(id)), `Questão inexistente em ${lesson.id}`);
      assert.ok(lesson.legacyIds.every(id => oldLessons.has(id)));
      if (!lesson.resources.length) assert.equal(lesson.card, undefined, 'Não criar cards sem conteúdo de apoio');
    }
    assert.deepEqual(index.moduleQuestions[module.id], unique(module.lessons.flatMap(lesson => lesson.questionIds)));
  }
  for (const [id, tags] of Object.entries(legacyIndex.questionTags)) if (tags.moduleIds.length) assert.deepEqual(index.requiredModules[id], tags.moduleIds, `Associação temática alterada: ${id}`);
  assert.ok(path.modules.flatMap(module => module.lessons).some(lesson => !lesson.resources.length));
  assert.ok(path.modules.flatMap(module => module.lessons).some(lesson => !lesson.questionIds.length));
  const integrated = 'enemhub:db6ce216-0136-4890-9025-392c7c8b614e';
  const moduleTwo = path.modules.find(module => module.id === 'math.m02');
  assert.equal(moduleTwo.lessons.flatMap(lesson => lesson.questionIds).includes(integrated), false);
  assert.equal(moduleTwo.lessons.find(lesson => lesson.id === 'math.m02.t08').questionIds.includes(integrated), false);
  assert.equal(examSelection(moduleTwo, bank, [], () => 0.2).includes(integrated), false);
  assert.equal(index.requiredModules[integrated].length > 1, true);
  const module = path.modules[0], examIds = examSelection(module, bank, [], () => 0.31);
  assert.ok(examIds.length > 0);
  assert.equal(examIds.length, new Set(examIds).size);
  assert.ok(examIds.every(id => index.moduleQuestions[module.id].includes(id)));
});

test('aulas distinguem não iniciada, em andamento e concluída sem converter acesso em conclusão', () => {
  assert.equal(lessonState(), 'not_started');
  assert.equal(lessonState({ studied: false }), 'not_started');
  assert.equal(lessonState(mark('math.m01.t01', false)), 'in_progress');
  assert.equal(lessonState(mark('math.m01.t01')), 'completed');
  const module = path.modules[0], opened = mark(module.lessons[0].id, false);
  const p = journeyProgress(path, [opened]);
  assert.equal(p.completed, 0);
  assert.equal(p.started, 1);
  assert.equal(p.modules[0].lessonStates[opened.id], 'in_progress');
  assert.deepEqual(p.learnedIds, []);
  assert.deepEqual(learnedCards(path, [opened]), []);
  assert.deepEqual(learnedQuestions(path, [opened], bank, index), []);
});

test('progresso de etapa e total usa quantidade real de aulas, ignorando marcadores arquivados', () => {
  const first = path.modules[0], second = path.modules[1], advanced = path.modules[24];
  const entries = [...entriesFor(first), mark(second.lessons[0].id), mark(advanced.lessons[0].id, false), ...entriesFor(...legacyRoadmap.modules)];
  const p = journeyProgress(path, entries);
  const basic = p.stages.find(stage => stage.level === 'Básico');
  assert.equal(p.completed, 11);
  assert.equal(p.started, 12);
  assert.equal(p.total, 199);
  assert.equal(p.percent, 11 / 199 * 100);
  assert.equal(basic.completed, 11);
  assert.equal(basic.total, 42);
  assert.equal(basic.percent, 11 / 42 * 100);
  assert.equal(basic.completedModules, 1);
  assert.notEqual(basic.percent, p.modules.slice(0, 5).reduce((sum, module) => sum + module.percent, 0) / 5);
  assert.deepEqual(p.learnedIds, [first.id]);
});

test('concluir um módulo libera prática e cards sem prova, e qualquer aula avançada pode ser retomada livremente', () => {
  const module = path.modules[0], entries = entriesFor(module);
  const p = journeyProgress(path, entries, []);
  assert.ok(p.learnedIds.includes(module.id));
  assert.equal(p.modules[0].latestExam, null);
  const eligible = learnedQuestions(path, entries, bank, index);
  assert.ok(eligible.length > 0);
  assert.deepEqual(sorted(eligible.filter(question => question.source === 'equacao').map(question => question.id)), sorted(index.moduleQuestions[module.id].filter(id => id.startsWith('equacao:'))));
  for (const question of eligible) {
    assert.equal(question.learning.moduleId, module.id);
    if (question.learning.lessonId) assert.ok(index.lessonQuestions[question.learning.lessonId].includes(question.id));
    if (question.source !== 'equacao') assert.ok(index.requiredModules[question.id].every(id => p.learnedIds.includes(id)));
  }
  const cards = learnedCards(path, entries);
  assert.equal(cards.length, module.lessons.filter(lesson => lesson.card).length);
  assert.ok(cards.every(card => card.moduleId === module.id && module.lessons.some(lesson => lesson.id === card.id)));
  assert.deepEqual(learnedCards(path, entries.slice(1)), []);
  assert.deepEqual(learnedQuestions(path, entries.slice(1), bank, index), []);
  const advanced = path.modules.find(row => row.level === 'Avançado').lessons[0];
  assert.equal(nextLesson(path, [], advanced.id).id, advanced.id);
  assert.equal(nextLesson(path, [mark(advanced.id, false)], advanced.id).id, advanced.id);
});

test('questões oficiais integradas aguardam todos os módulos associados sem depender das provas', () => {
  const mixed = Object.entries(index.requiredModules).find(([, required]) => required.length > 1);
  assert.ok(mixed, 'O acervo deve permitir verificar uma questão com múltiplas associações');
  const [id, required] = mixed, question = bank.find(row => row.id === id);
  assert.ok(question);
  const modules = required.map(moduleId => path.modules.find(module => module.id === moduleId));
  assert.deepEqual(learnedQuestions(path, entriesFor(...modules.slice(1)), [question], index), []);
  assert.equal(learnedQuestions(path, entriesFor(...modules), [question], index)[0].id, id);
});

test('iniciar, concluir e desmarcar uma aula persistem ao reabrir o banco sem apagar o contexto', async () => {
  await withDB(async () => {
    const id = 'math.m21.t01';
    await saveLearningTopic(id);
    closeDB(); await openDB();
    let state = await snapshot(), entry = state.learningEntries.find(row => row.id === id);
    assert.equal(lessonState(entry), 'in_progress');
    assert.equal(state.learningLastTopicId, id);
    const startedAt = entry.startedAt;
    await saveLearningTopic(id, true);
    closeDB(); await openDB();
    entry = (await snapshot()).learningEntries.find(row => row.id === id);
    assert.equal(lessonState(entry), 'completed');
    assert.equal(entry.startedAt, startedAt);
    await saveLearningTopic(id, false);
    closeDB(); await openDB();
    entry = (await snapshot()).learningEntries.find(row => row.id === id);
    assert.equal(lessonState(entry), 'in_progress');
    assert.equal(entry.studiedAt, null);
    assert.equal(entry.startedAt, startedAt);
  });
});

test('migração conserva marcadores antigos, exige equivalência completa e respeita aula nova desmarcada', async () => {
  await withDB(async () => {
    await saveLearningTopic('roadmap.m01.l01', true); // equivalente às quatro operações
    await saveLearningTopic('roadmap.m01.l02', true);
    await saveLearningTopic('roadmap.m01.l03', true); // apoio amplo de frações, sem equivalência integral
    await saveLearningTopic('roadmap.m03.l06', true); // apenas metade da equivalência de composição/inversa
    await saveLearningTopic('math.m01.t06', true);
    await saveLearningTopic('math.m01.t06', false); // escolha recente do usuário prevalece
    await migrateRoadmap(path);
    const first = await snapshot(), byId = new Map(first.learningEntries.map(entry => [entry.id, entry]));
    assert.equal(byId.get('roadmap.m01.l01').studied, true);
    assert.equal(byId.get('math.m01.t05').studied, true);
    assert.equal(byId.get('math.m01.t06').studied, false);
    assert.notEqual(byId.get('math.m01.t03')?.studied, true);
    assert.notEqual(byId.get('math.m08.t09')?.studied, true);
    assert.deepEqual(journeyProgress(path, first.learningEntries).learnedIds, []);
    await migrateRoadmap(path);
    assert.deepEqual((await snapshot()).learningEntries, first.learningEntries, 'Migração repetida deve ser idempotente');
  });
});

test('backup e restauração preservam cards e provas dos IDs curriculares e do acervo anterior', async () => {
  let saved;
  await withDB(async () => {
    const module = path.modules[0], question = legacyQuestions.find(row => index.moduleQuestions[module.id].includes(row.id));
    await saveLearningTopic('math.m01.t05', true);
    await saveLearningTopic('roadmap.m01.l01', true);
    await saveCardReview('math.m01.t05', true);
    await saveCardReview('roadmap.m01.l01', false);
    const currentExam = await beginModuleExam(module.id, [question.id]);
    await saveExamAnswer(currentExam.id, question, question.answer, true);
    const oldExam = await beginModuleExam(question.learning.moduleId, [question.id]);
    await saveExamAnswer(oldExam.id, question, question.answer, true);
    const state = await snapshot();
    saved = makeBackup(state, 123);
    assert.deepEqual(sorted(saved.cards.map(card => card.id)), ['math.m01.t05', 'roadmap.m01.l01']);
    assert.deepEqual(sorted(saved.exams.map(exam => exam.moduleId)), [module.id, question.learning.moduleId].sort());
    assert.equal(validateBackup(saved, 123).exams.length, 2);
    assert.equal(hydrateRecords(saved, bank).length, 1);
    const older = makeBackup({ records: [], learningEntries: [mark('math.m01.t05')], cards: [], exams: [] }, 123);
    assert.equal(mergeBackups(older, saved).cards.length, 2);
    assert.equal(mergeBackups(saved, older).exams.length, 2);
  });
  await withDB(async () => {
    await restoreBackup(saved, bank, 123);
    closeDB(); await openDB();
    const restored = await snapshot();
    assert.equal(restored.exams.length, 2);
    assert.equal(restored.cards.length, 2);
    assert.equal(restored.learningEntries.filter(entry => entry.studied).length, 2);
    assert.ok(restored.exams.some(exam => exam.moduleId === 'math.m01'));
    assert.ok(restored.exams.some(exam => exam.moduleId === 'roadmap.m01'));
  });
});

test('restauração atualiza o último tópico para o marcador mais recente do backup', async () => {
  const future = Date.now() + 1000;
  const remote = makeBackup({
    records: [],
    learningEntries: [{ id: 'math.m02.t01', studied: false, startedAt: future, studiedAt: null, updatedAt: future }],
    learningLastTopicId: 'math.m02.t01',
    exams: [], cards: [],
  }, 123);
  await withDB(async () => {
    await saveLearningTopic('math.m01.t01', false);
    await restoreBackup(remote, bank, 123);
    assert.equal((await snapshot()).learningLastTopicId, 'math.m02.t01');
  });
});
