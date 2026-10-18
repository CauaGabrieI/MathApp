import test from 'node:test';
import assert from 'node:assert/strict';
import {IDBFactory} from 'fake-indexeddb';
import {makeBackup} from '../public/backup-model.js';
import {closeDB,openDB,restoreBackup,saveCardReview,snapshot} from '../public/db.js';

const ownerId=90210;

async function resetDB(){
  closeDB();
  await new Promise((resolve,reject)=>{
    const request=indexedDB.deleteDatabase('equacao-history');
    request.onsuccess=resolve;
    request.onerror=()=>reject(request.error);
    request.onblocked=resolve;
  });
}

test('revisão de card persiste no IndexedDB e restauração mantém o scheduler',async()=>{
  globalThis.indexedDB=new IDBFactory();
  await resetDB();
  await openDB();

  const first=await saveCardReview('math.m01.t01','good');
  assert.equal(first.rating,'good');
  assert.equal((await snapshot()).cards[0].id,'math.m01.t01');

  closeDB();
  await openDB();
  const reopened=(await snapshot()).cards[0];
  assert.equal(reopened.rating,'good');
  assert.equal(reopened.cardSchemaVersion,2);
  assert.equal(reopened.dueAt,first.dueAt);
  assert.equal(reopened.updatedAt,first.updatedAt);

  const reviewedAt=Date.now()-1000,updatedAt=Date.now();
  const remote=makeBackup({
    records:[],learningEntries:[],learningLastTopicId:null,exams:[],
    cards:[{id:'math.m01.t01',remembered:true,rating:'easy',reviewedAt,updatedAt,
      dueAt:updatedAt+4*24*60*60*1000,interval:4,ease:2.65,repetitions:2,lapses:0}]
  },ownerId);
  await restoreBackup(remote,[],ownerId);
  const restored=(await snapshot()).cards[0];
  assert.equal(restored.rating,'easy');
  assert.equal(restored.interval,4);
  assert.equal(restored.ease,2.65);
  assert.equal(restored.repetitions,2);
  assert.equal(restored.dueAt,updatedAt+4*24*60*60*1000);
  closeDB();
});
