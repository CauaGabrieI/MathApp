import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { makeBackup, hydrateRecords, normalizeQuestionSnapshot } from '../public/backup-model.js';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const studyBank = read('public/study-bank.json');
const officialBank = read('public/bank.json');
const now = Date.now();
const baseState = { records: [], learningEntries: [], learningLastTopicId: null, cards: [] };

test('snapshots são idempotentes para os 392 itens autorais publicados', () => {
  assert.equal(studyBank.length, 392);
  for (const question of studyBank) {
    const once = normalizeQuestionSnapshot(question, question.id);
    assert.deepEqual(normalizeQuestionSnapshot(once, question.id), once, question.id);
  }
});

test('snapshot autoral com quatro alternativas e registro oficial com imagem sobrevivem ao banco alterado', () => {
  const authorial = {
    id: 'equacao:math.m01.t01:v2:01', source: 'equacao', level: 'EASY', levelOrigin: 'curriculum', year: null,
    title: 'Item autoral', topic: 'Naturais', statement: 'Quanto é 2 + 2?', format: 'markdown', introduction: '', files: [],
    alternatives: ['A', 'B', 'C', 'D'].map(letter => ({ letter, text: letter, file: null })), answer: 'D',
    question: 'Quanto é 2 + 2?', dedupeKey: 'authorial:math.m01.t01:v2:01', explanation: 'Somamos as parcelas.',
    learning: { moduleId: 'math.m01', lessonId: 'math.m01.t01' },
  };
  const official = officialBank.find(question => question.files?.length);
  assert.ok(official, 'banco oficial deve conter ao menos uma questão com imagem');
  const backup = makeBackup({ ...baseState, records: [{
    id: official.id, question: official, choices: official.alternatives.map(a => a.letter),
    seenAt: now, completedAt: now, selectedAnswer: official.answer, learningContext: null,
  }] }, 71);
  const authorialSnapshot = normalizeQuestionSnapshot(authorial, authorial.id);
  assert.equal(authorialSnapshot.alternatives.length, 4);
  assert.deepEqual(normalizeQuestionSnapshot(authorialSnapshot, authorial.id), authorialSnapshot);
  assert.deepEqual(hydrateRecords(backup, officialBank.filter(question => question.id !== official.id))[0].question.files, official.files);
});

test('prova histórica sem snapshot não é apresentada como recuperável quando a questão saiu do banco', () => {
  const question = studyBank[0];
  const exam = { id: 'exam:integration12345', moduleId: 'math.m01', kind: 'diagnostic', questionIds: [question.id],
    answers: { [question.id]: question.answer }, startedAt: now, updatedAt: now, completedAt: now };
  const catalog = new Map([['math.m01', new Set([question.id])]]);
  const withoutSnapshot = makeBackup({ ...baseState, exams: [exam] }, 72);
  assert.throws(() => hydrateRecords(withoutSnapshot, [], catalog), /Atualize o app/);
  const withSnapshot = makeBackup({ ...baseState, exams: [{ ...exam, questionSnapshots: [question] }] }, 72);
  assert.doesNotThrow(() => hydrateRecords(withSnapshot, [], catalog));
});
