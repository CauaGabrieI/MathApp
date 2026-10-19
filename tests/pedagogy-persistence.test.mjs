import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { makeBackup, validateBackup, hydrateRecords } from '../public/backup-model.js';
import { beginModuleExam, closeDB, openDB, restoreBackup, saveExamAnswer, saveLearningTopic, snapshot } from '../public/db.js';

const moduleId = 'math.m01';
const lessonId = 'math.m01.t01';
const ids = ['enemdev:2024:1', 'enemdev:2024:2'];
const question = (id, answer = 'B') => ({
  id, source: 'enemdev', level: 'MEDIUM', levelOrigin: 'estimated', year: 2024,
  title: 'Questão de teste', topic: 'Matemática', statement: 'Enunciado estável de teste.',
  format: 'markdown', introduction: '', files: [],
  alternatives: ['A', 'B', 'C', 'D', 'E'].map(letter => ({ letter, text: letter })),
  answer, question: 'Enunciado estável de teste.', dedupeKey: `dedupe:${id}`,
  explanation: 'Explicação armazenada.', learning: { moduleId, lessonId },
});
const bank = ids.map(id => question(id));

async function resetDB() {
  closeDB();
  globalThis.indexedDB = new IDBFactory();
  await openDB();
}

test('contentVersionSeen opcional sobrevive ao IndexedDB e ao backup, sem exigir versão em entradas antigas', async () => {
  await resetDB();
  try {
    await saveLearningTopic(lessonId, true, 'v2.1');
    await saveLearningTopic('math.m01.t02', false);
    await saveLearningTopic(lessonId, true);
    const current = await snapshot();
    assert.equal(current.learningEntries.find(entry => entry.id === lessonId).contentVersionSeen, 'v2.1');
    assert.equal(Object.hasOwn(current.learningEntries.find(entry => entry.id === 'math.m01.t02'), 'contentVersionSeen'), false);
    const backup = makeBackup(current, 41);
    assert.equal(backup.learningEntries.find(entry => entry.id === lessonId).contentVersionSeen, 'v2.1');
    assert.equal(Object.hasOwn(backup.learningEntries.find(entry => entry.id === 'math.m01.t02'), 'contentVersionSeen'), false);
    assert.throws(() => validateBackup({ ...backup, learningEntries: backup.learningEntries.map(entry => entry.id === lessonId ? { ...entry, contentVersionSeen: '../unsafe' } : entry) }), /Backup inválido/);
  } finally { closeDB(); }
});

test('prova com snapshots mantém gabarito e enunciado ao hidratar contra banco alterado', async () => {
  await resetDB();
  try {
    const started = await beginModuleExam(moduleId, ids, 'diagnostic', ids, bank);
    assert.equal(started.questionSnapshots.length, 2);
    const changed = { ...bank[0], answer: 'C', explanation: 'Texto novo que não deve substituir a prova.' };
    await saveExamAnswer(started.id, changed, 'B', false);
    const before = await snapshot();
    assert.equal(before.exams[0].questionSnapshots[0].answer, 'B');
    assert.equal(before.records[0].question.answer, 'B');
    const backup = makeBackup(before, 42);
    const alteredBank = [question(ids[0], 'C')];
    const restoredRecords = hydrateRecords(backup, alteredBank, new Map([[moduleId, new Set(ids)]]));
    assert.equal(restoredRecords[0].question.answer, 'B');
    assert.equal(restoredRecords[0].question.explanation, 'Explicação armazenada.');
  } finally { closeDB(); }
});

test('registro moderno mantém seu próprio snapshot e não é substituído por snapshot de prova', () => {
  const now = Date.now();
  const stable = question(ids[0], 'B');
  const backup = makeBackup({
    records: [{ id: stable.id, question: stable, choices: ['A', 'B', 'C', 'D', 'E'], seenAt: now, completedAt: now, selectedAnswer: 'B', learningContext: null }],
    learningEntries: [], learningLastTopicId: null, exams: [], cards: [],
  }, 43);
  assert.equal(backup.records[0].questionSnapshot.answer, 'B');
  const restored = hydrateRecords(backup, [question(ids[0], 'C')]);
  assert.equal(restored[0].question.answer, 'B');
  assert.equal(restored[0].question.explanation, stable.explanation);
});

test('snapshots rejeitam campos arbitrários e planos incompletos', async () => {
  await resetDB();
  try {
    await assert.rejects(beginModuleExam(moduleId, ids, 'diagnostic', ids, [{ ...bank[0], unsafe: true }, bank[1]]), /Snapshot de questão inválido/);
    await assert.rejects(beginModuleExam(moduleId, ids, 'diagnostic', ids, [bank[0]]), /Snapshot de questão inválido/);
  } finally { closeDB(); }
});

test('prova aceita item autoral versionado com quatro alternativas', async () => {
  await resetDB();
  try {
    const id = 'equacao:math.m01.t01:v2:01';
    const authorial = { ...question(id), alternatives: ['A', 'B', 'C', 'D'].map(letter => ({ letter, text: letter, file: null })), answer: 'D' };
    const started = await beginModuleExam(moduleId, [id], 'diagnostic', [id], [authorial]);
    assert.equal(started.questionSnapshots[0].id, id);
    assert.equal(started.questionSnapshots[0].alternatives.length, 4);
  } finally { closeDB(); }
});

test('restoreBackup grava snapshot próprio em transação mesmo sem a questão no banco atual', async () => {
  await resetDB();
  try {
    const q = question(ids[0]);
    const remote = makeBackup({
      records: [{ id: q.id, question: q, choices: q.alternatives.map(a => a.letter), seenAt: Date.now(), completedAt: Date.now(), selectedAnswer: q.answer, learningContext: null }],
      learningEntries: [], learningLastTopicId: null, exams: [], cards: [],
    }, 74);
    const result = await restoreBackup(remote, [], 74);
    assert.equal(result instanceof Error, false);
    assert.equal((await snapshot()).records[0].question.answer, q.answer);
  } finally { closeDB(); }
});
