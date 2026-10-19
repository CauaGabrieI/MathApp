import test from 'node:test';
import assert from 'node:assert/strict';
import {IDBFactory} from 'fake-indexeddb';
import {subjectForModule,subjectForLesson,subjectRoute,parseAppRoute} from '../public/journey-navigation.js';
import {journeyProgress,learnedCards,learnedQuestions} from '../public/journey-model.js';
import {makeBackup,validateBackup} from '../public/backup-model.js';
import {closeDB,openDB,restoreBackup,saveCardReview,saveLearningTopic,snapshot} from '../public/db.js';

const now=Date.now();
const lesson=(id,title,card=true)=>({id,title,order:1,questionIds:[`equacao:${id}:1`],resources:[],legacyIds:[],...(card?{card:{id,question:`Como resolver ${title}?`,answer:'A'}}:{})});
const roadmap={schemaVersion:2,stages:[
 {id:'stage.math',title:'Matemática',description:'Números e formas.',order:1,moduleIds:['math.m01','math.m02']},
 {id:'stage.language',title:'Linguagens',description:'Leitura e escrita.',order:2,moduleIds:['math.m03']},
],modules:[
 {id:'math.m01',title:'Operações',description:'Operações fundamentais.',order:1,level:'fundamentos',prerequisiteIds:[],lessons:[lesson('math.m01.t01','Adição')]},
 {id:'math.m02',title:'Geometria',description:'Formas básicas.',order:2,level:'fundamentos',prerequisiteIds:[],lessons:[lesson('math.m02.t01','Figuras')]},
 {id:'math.m03',title:'Leitura',description:'Leitura inicial.',order:3,level:'fundamentos',prerequisiteIds:[],lessons:[lesson('math.m03.t01','Texto')]},
],archiveModules:[{id:'roadmap.m01',title:'Acervo de matemática',description:'Material anterior.',order:1,archived:true,lessons:[{id:'roadmap.m01.l01',title:'Operações antigas'}]}]};
const completeMath=[{id:'math.m01.t01',studied:true,startedAt:now-3000,studiedAt:now-2000,updatedAt:now-2000}];
const bank=[
 {id:'equacao:math.m01.t01:1',source:'equacao',learning:{moduleId:'math.m01',lessonId:'math.m01.t01'}},
 {id:'equacao:math.m03.t01:1',source:'equacao',learning:{moduleId:'math.m03',lessonId:'math.m03.t01'}},
];

test('duas matérias mantêm rota, progresso e gating separados',()=>{
 assert.equal(subjectRoute('stage.math'),'mapa/materia/stage.math');
 assert.equal(subjectForModule(roadmap,'math.m01')?.id,'stage.math');
 assert.equal(subjectForLesson(roadmap,'math.m03.t01')?.id,'stage.language');
 assert.deepEqual(parseAppRoute('#mapa/materia/stage.language',roadmap),{page:'mapa',subjectId:'stage.language',route:'mapa/materia/stage.language',invalid:false});
 const progress=journeyProgress(roadmap,completeMath);
 assert.equal(progress.stages.find(stage=>stage.id==='stage.math').completed,1);
 assert.equal(progress.stages.find(stage=>stage.id==='stage.language').completed,0);
 assert.deepEqual(learnedQuestions(roadmap,completeMath,bank,{}).map(question=>question.id),['equacao:math.m01.t01:1']);
 assert.deepEqual(learnedCards(roadmap,completeMath).map(card=>card.id),['math.m01.t01']);
});

test('legacy archive lesson resolves back to the Math subject',()=>{
 assert.equal(subjectForModule(roadmap,'roadmap.m01')?.id,'stage.math');
 assert.equal(subjectForLesson(roadmap,'roadmap.m01.l01')?.id,'stage.math');
});

test('learning entries and card reviews survive IndexedDB backup/restore',async()=>{
 closeDB();globalThis.indexedDB=new IDBFactory();await openDB();
 try{
  await saveLearningTopic('math.m01.t01',true);
  await saveLearningTopic('math.m03.t01',false);
  const card=await saveCardReview('math.m01.t01','good');
  const before=await snapshot();
  assert.equal(before.learningEntries.length,2);
  assert.equal(before.cards[0].id,card.id);
  const backup=validateBackup(makeBackup(before,71),71);
  assert.deepEqual(backup.learningEntries.map(entry=>entry.id).sort(),['math.m01.t01','math.m03.t01']);
  closeDB();globalThis.indexedDB=new IDBFactory();await openDB();
  await restoreBackup(backup,[],71);
  const restored=await snapshot();
  assert.equal(restored.learningEntries.find(entry=>entry.id==='math.m01.t01').studied,true);
  assert.equal(restored.learningEntries.find(entry=>entry.id==='math.m03.t01').studied,false);
  assert.equal(restored.cards.find(entry=>entry.id==='math.m01.t01').rating,'good');
 }finally{closeDB();}
});
