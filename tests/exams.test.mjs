import test from 'node:test';
import assert from 'node:assert/strict';
import { indexedDB } from 'fake-indexeddb';
import { examSelection, examComparison } from '../public/journey-model.js';
import { makeBackup, mergeBackups, validateBackup, hydrateRecords } from '../public/backup-model.js';
import { openDB, closeDB, snapshot, beginModuleExam, restoreBackup } from '../public/db.js';

globalThis.indexedDB = indexedDB;
const module = { id: 'math.m01', lessons: Array.from({ length: 5 }, (_, i) => ({ id: `math.m01.t0${i + 1}`, questionIds: Array.from({ length: 3 }, (_, j) => `enemdev:2020:${i * 3 + j + 1}`) })) };
const bank = module.lessons.flatMap(lesson => lesson.questionIds.map(id => ({ id, source: 'enemdev', answer: 'A', alternatives: ['A', 'B', 'C', 'D', 'E'].map(letter => ({ letter, text: letter })) })));
const exam = (kind, ids, startedAt = 1000, completedAt = null, id = `exam:${kind}0123456789`) => ({ id, moduleId: module.id, ...(kind === 'legacy' ? {} : { kind }), questionIds: ids, answers: Object.fromEntries(ids.map(id => [id, 'A'])), startedAt, updatedAt: completedAt ?? startedAt, completedAt });
const resetDB = async () => { closeDB(); await new Promise((resolve, reject) => { const request = indexedDB.deleteDatabase('equacao-history'); request.onsuccess = resolve; request.onerror = () => reject(request.error); request.onblocked = resolve; }); };

test('beginModuleExam rejeita planos vazios, duplicados, longos e IDs inválidos', async () => {
  await resetDB(); await openDB();
  for (const plan of [[], ['bad'], [bank[0].id, bank[0].id], Array.from({ length: 31 }, (_, i) => `enemdev:2020:${i + 1}`)]) await assert.rejects(beginModuleExam(module.id, plan), /Plano de prova inválido/);
  closeDB();
});
test('duas aberturas concorrentes do mesmo kind retomam o mesmo UUID', async () => {
  await resetDB(); await openDB(); const ids = bank.slice(0, 5).map(q => q.id), results = await Promise.all([beginModuleExam(module.id, ids, 'diagnostic'), beginModuleExam(module.id, ids, 'diagnostic')]);
  assert.equal(results[0].id, results[1].id); assert.equal((await snapshot()).exams.length, 1); closeDB();
});
test('kinds distintos não podem reutilizar questões e a transação não grava a prova rejeitada', async () => {
  await resetDB(); await openDB(); const ids = bank.slice(0, 5).map(q => q.id);
  await beginModuleExam(module.id, ids, 'diagnostic'); await assert.rejects(beginModuleExam(module.id, ids, 'final'), /já usadas/);
  assert.equal((await snapshot()).exams.length, 1); closeDB();
});
test('catálogo confiável bloqueia questão fora do módulo para provas novas', async () => {
  const ids = bank.slice(0, 2).map(q => q.id), saved = makeBackup({ records: [], learningEntries: [], learningLastTopicId: null, exams: [exam('diagnostic', ids)], cards: [] }, 123);
  assert.throws(() => hydrateRecords(saved, bank, new Map([[module.id, new Set([ids[0]])]])), /não pertence ao módulo/);
  await resetDB(); await openDB(); await assert.rejects(beginModuleExam(module.id, ids, 'final', [ids[0]]), /fora do módulo/); assert.equal((await snapshot()).exams.length, 0); closeDB();
});
test('seleção exclui prova anterior, permite questão vista em prática e mantém dedupe', () => {
  const first = bank.slice(0, 5).map(q => q.id), records = [{ id: bank[5].id }];
  const selected = examSelection(module, bank, records, () => 0.2, { exams: [exam('legacy', first)] });
  assert.equal(selected.length, 5); assert.ok(!selected.some(id => first.includes(id))); assert.ok(selected.includes(bank[5].id));
  const duplicateBank = bank.map((q, i) => i === 6 || i === 7 ? { ...q, dedupeKey: 'same' } : q);
  const keys = examSelection(module, duplicateBank, [], () => 0.1).map(id => duplicateBank.find(q => q.id === id)?.dedupeKey).filter(Boolean);
  assert.equal(new Set(keys).size, keys.length);
  const remainderModule = { id: 'math.m02', lessons: [{ id: 'math.m02.t01', questionIds: duplicateBank.map(q => q.id) }] };
  const allSame = duplicateBank.map(q => ({ ...q, dedupeKey: 'same' }));
  assert.deepEqual(examSelection(remainderModule, allSame, [], () => 0.1), []);
});
test('backup rejeita UUID duplicado e merge rejeita kind imutável divergente', () => {
  const ids = bank.slice(0, 2).map(q => q.id), left = makeBackup({ records: [], learningEntries: [], learningLastTopicId: null, exams: [exam('diagnostic', ids)], cards: [] }, 123);
  assert.throws(() => validateBackup({ ...left, exams: [left.exams[0], { ...left.exams[0], kind: 'final' }] }));
  const right = makeBackup({ records: [], learningEntries: [], learningLastTopicId: null, exams: [{ ...exam('final', ids), id: left.exams[0].id }], cards: [] }, 123);
  assert.throws(() => mergeBackups(left, right));
});
test('comparação não troca cronologia e sem baseline expõe final sem delta', () => {
  const diag = exam('diagnostic', bank.slice(0, 5).map(q => q.id), 2000, 3000), earlyFinal = exam('final', bank.slice(5, 10).map(q => q.id), 2500, 4000);
  const invalid = examComparison(module.id, [diag, earlyFinal], bank); assert.equal(invalid.final, null); assert.equal(invalid.percentDelta, null);
  const onlyFinal = examComparison(module.id, [earlyFinal], bank); assert.equal(onlyFinal.baseline, null); assert.equal(onlyFinal.final.id, earlyFinal.id); assert.equal(onlyFinal.finalResult.total, 5); assert.equal(onlyFinal.percentDelta, null);
});
test('prova legacy é restaurada e retomada pelo kind normalizado', async () => {
  await resetDB(); await openDB(); const ids = bank.slice(0, 5).map(q => q.id); const started = await beginModuleExam(module.id, ids);
  const remote = makeBackup(await snapshot(), 123); await resetDB(); await openDB(); await restoreBackup(remote, bank, 123);
  const resumed = await beginModuleExam(module.id, ids, 'legacy'); assert.equal(resumed.id, started.id); closeDB();
});
