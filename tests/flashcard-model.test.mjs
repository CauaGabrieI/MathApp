import test from 'node:test';
import assert from 'node:assert/strict';
import {nextReview,normalizeCard,previewIntervals,reviewQueue} from '../public/flashcard-model.js';
import {BACKUP_APP,mergeBackups,validateBackup} from '../public/backup-model.js';

const DAY=24*60*60*1000,now=Date.UTC(2026,0,15,12);
const fresh={id:'math.m01.t01',remembered:true,reviewedAt:now-2*DAY};

test('ratings agendam intervalos crescentes e again reinicia a aprendizagem',()=>{
  const first=nextReview(fresh,'good',now);
  assert.equal(first.interval,1); assert.equal(first.dueAt,now+DAY); assert.equal(first.repetitions,2); assert.equal(first.remembered,true);
  const easy=nextReview({...first},'easy',now+DAY);
  assert.ok(easy.interval>first.interval); assert.ok(easy.ease>first.ease);
  const again=nextReview(easy,'again',now+2*DAY);
  assert.equal(again.interval,0); assert.equal(again.dueAt,now+2*DAY+60*1000); assert.equal(again.repetitions,0); assert.equal(again.remembered,false); assert.equal(again.lapses,1);
});

test('primeira revisão usa janelas de aprendizagem de um e seis minutos',()=>{
  const base={id:'math.m01.t02'};
  assert.equal(nextReview(base,'again',now).dueAt-now,60*1000);
  const hard=nextReview(base,'hard',now);
  assert.equal(hard.interval,0); assert.equal(hard.dueAt-now,6*60*1000);
  assert.equal(nextReview(base,'good',now).dueAt-now,DAY);
  assert.equal(nextReview(base,'easy',now).dueAt-now,4*DAY);
});

test('datas usam duração fixa de 24 horas, sem mudança por DST ou fuso',()=>{
  const card=nextReview({id:'roadmap.m01.l01'},'good',now);
  assert.equal(card.dueAt-now,DAY);
  assert.deepEqual(Object.keys(previewIntervals(card,now)).sort(),['again','easy','good','hard']);
});

test('migração de card antigo preserva remembered e IDs e a fila usa dueAt',()=>{
  const old=normalizeCard({id:'roadmap.m01.l01',remembered:false,reviewedAt:now-DAY},now);
  assert.equal(old.id,'roadmap.m01.l01'); assert.equal(old.remembered,false); assert.equal(old.rating,'again');
  const queue=reviewQueue([old,{id:'math.m01.t01',remembered:true,reviewedAt:now,dueAt:now+DAY}],now);
  assert.deepEqual(queue.map(card=>card.id),['roadmap.m01.l01']);
});

test('normalização legada sem timestamp é determinística e não inventa repetição',()=>{
  const first=normalizeCard({id:'math.m01.t03',remembered:true},now),second=normalizeCard({id:'math.m01.t03',remembered:true},now+DAY);
  assert.deepEqual(first,second); assert.equal(first.repetitions,0); assert.equal(first.dueAt,0); assert.equal(first.updatedAt,0);
  const edited=normalizeCard({id:'math.m01.t03',remembered:true,updatedAt:now},now);
  assert.equal(edited.repetitions,0); assert.equal(edited.reviewedAt,0);
});

test('rating inválido não altera o card',()=>{
  assert.throws(()=>nextReview(fresh,'remember',now),/inválida/);
});

test('backup v2 normaliza cards antigos e merge escolhe a revisão mais recente',()=>{
  const base={app:BACKUP_APP,schemaVersion:2,ownerId:7,records:[],learningEntries:[],lastTopicId:null,exams:[]};
  const ratings=['again','hard','good','easy'];
  const roundtrip=validateBackup({...base,cards:ratings.map((rating,index)=>({id:`math.m01.t0${index+1}`,remembered:rating!=='again',rating,reviewedAt:now+index,updatedAt:now+index,dueAt:now+index,interval:rating==='again'?0:1,ease:2.5,repetitions:rating==='again'?0:1,lapses:rating==='again'?1:0}))},7);
  assert.deepEqual(roundtrip.cards.map(card=>card.rating),ratings);
  const old=validateBackup({...base,cards:[{id:'math.m01.t01',remembered:true,reviewedAt:now}]},7);
  const newer=validateBackup({...base,cards:[{id:'math.m01.t01',remembered:false,rating:'again',reviewedAt:now+DAY,updatedAt:now+DAY,dueAt:now+DAY,lapses:1}]},7);
  assert.equal(old.cards[0].cardSchemaVersion,2);
  const merged=mergeBackups(old,newer);
  assert.equal(merged.cards[0].rating,'again'); assert.equal(merged.cards[0].remembered,false); assert.equal(merged.cards[0].updatedAt,now+DAY);
});
