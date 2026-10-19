import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MODULE01_LESSONS} from '../content/review/module01.mjs';
import {validateLessonCandidate} from '../content/lesson-schema.mjs';
import {approvedExercises} from '../content/pedagogy-exercises.mjs';
import {createLearningPath} from '../content/learning-path.mjs';
import {createRoadmap} from '../content/roadmap.mjs';
import {orderedLessons,validateRoadmap,nextLesson,journeyProgress,examResult,examQuestion} from '../public/journey-model.js';
import {parseMathMarkdown,buildCurriculum} from '../scripts/import-curriculum.mjs';
const read = file => JSON.parse(fs.readFileSync(file,'utf8'));
const curriculum=read('public/curriculum.json'),legacy=createRoadmap().roadmap,index=read('public/curriculum-index.json');
const generate=options=>createLearningPath(curriculum,legacy,index,{theoryCandidates:MODULE01_LESSONS,...options}).path;

test('o novo conteúdo é completo estruturalmente, variado e permanece fora da produção sem revisão humana',()=>{
 const ids=new Set(curriculum.modules.flatMap(m=>m.topics.map(t=>t.id))),all=Object.values(MODULE01_LESSONS);
 assert.equal(all.length,10);assert.equal(all.flatMap(l=>l.exercises).length,40);
 for(const l of all)assert.equal(validateLessonCandidate(l,ids),true);
 const prod=generate(),preview=generate({preview:true});
 assert.equal(prod.modules.flatMap(m=>m.lessons).filter(l=>l.theory).length,0);
 assert.equal(preview.modules.flatMap(m=>m.lessons).filter(l=>l.theory).length,10);
 assert.ok(preview.modules[0].lessons.every(l=>!l.theory.exercises));
 assert.ok(all.every(l=>l.reviewStatus==='editorial_review_pending_human'&&l.exercises.every(e=>e.reviewStatus==='pending_human')));
 const published=read('public/study-bank.json');
 assert.ok(all.flatMap(l=>l.exercises).every(q=>!published.some(p=>p.id===q.id)));
 const invalid=structuredClone(all[0]);invalid.exercises[0].choices[1]=invalid.exercises[0].choices[0];
 assert.throws(()=>validateLessonCandidate(invalid,ids),/alternativas/);
 const equivalent=structuredClone(MODULE01_LESSONS['math.m01.t03']);
 equivalent.exercises[2].choices[3]='30/45';
 assert.throws(()=>validateLessonCandidate(equivalent,ids),/equivalentes/,'2/3 e 30/45 não podem ser opções distintas neste item');
 const decimal=structuredClone(MODULE01_LESSONS['math.m01.t04']);
 decimal.exercises[0].choices[2]='4,70';
 assert.throws(()=>validateLessonCandidate(decimal,ids),/equivalentes/,'4,7 e 4,70 não devem duplicar um distrator');
});

test('ordem editorial muda sem perder IDs, ordem do Markdown nem conclusão; frações vêm após a aritmética',()=>{
 const path=generate(),m=path.modules[0],m7=path.modules[6];
 assert.deepEqual(m.lessons.map(l=>l.id),curriculum.modules[0].topics.map(t=>t.id));
 assert.deepEqual(orderedLessons(m).map(l=>l.order),[1,5,2,6,7,8,9,10,3,4]);
 assert.deepEqual(orderedLessons(m7).map(l=>l.order),[1,4,2,3,6,5,7,8]);
 assert.equal(nextLesson(path,[{id:'math.m01.t01',studied:true}]).id,'math.m01.t05');
 assert.equal(validateRoadmap(path),true);
 const entries=m.lessons.map(l=>({id:l.id,studied:true,startedAt:1}));
 assert.equal(journeyProgress(path,entries).modules[0].learned,true);
 const again=buildCurriculum(parseMathMarkdown(fs.readFileSync('content/math-curriculum.md','utf8')),curriculum);
 assert.deepEqual(again.modules.flatMap(m=>m.topics.map(l=>l.id)),curriculum.modules.flatMap(m=>m.topics.map(l=>l.id)));
});

test('associação indevida é removida da aula e conservada somente para tentativas antigas',()=>{
 const path=generate(),m=path.modules[0];
 for(const l of m.lessons.slice(0,2)){
  assert.equal(l.resources.length,0);assert.equal(l.questionIds.length,0);
  assert.doesNotMatch(JSON.stringify(l),/irracional|dízima|√2/);
 }
 assert.equal(m.historicalQuestionIds.length,4);
 assert.ok(m.historicalQuestionIds.every(id=>!m.lessons.flatMap(l=>l.questionIds).includes(id)));
 assert.deepEqual(path.archiveModules.map(({archived,...m})=>m),legacy.modules);
});

test('dependências são conceituais e recomendações livres, com referências inexistentes/cíclicas rejeitadas',()=>{
 const path=generate();
 assert.deepEqual(path.modules[18].prerequisiteIds,['math.m01']);
 assert.deepEqual(path.modules[20].prerequisiteIds,['math.m03','math.m04','math.m11','math.m12']);
 assert.deepEqual(path.modules[22].prerequisiteIds,['math.m02','math.m18']);
 assert.equal(path.prerequisitePolicy,'recommended');
 const cyclic=structuredClone(path);cyclic.modules[0].lessons[0].prerequisiteIds=['math.m01.t05'];
 assert.throws(()=>validateRoadmap(cyclic),/Ciclo/);
 const missing=structuredClone(path);missing.modules[0].lessons[0].prerequisiteIds=['math.m99.t99'];
 assert.throws(()=>validateRoadmap(missing),/inexistente/);
});

test('resultado e revisão de prova usam snapshot mesmo após mudar o banco',()=>{
 const old={id:'enemdev:2024:1',answer:'B',statement:'Conteúdo usado'},current={...old,answer:'A',statement:'Outro conteúdo'};
 const exam={questionIds:[old.id],answers:{[old.id]:'B'},questionSnapshots:[old]};
 assert.equal(examResult(exam,[current]).percent,100);
 assert.equal(examQuestion(exam,old.id,[current]).statement,'Conteúdo usado');
 assert.equal(examResult({...exam,questionSnapshots:undefined},[old]).percent,100,'provas sem snapshot continuam legíveis');
 assert.equal(examResult({...exam,questionSnapshots:undefined},[]).percent,null,'não atribuir erro ou nota inventada a um gabarito histórico ausente');
 assert.equal(examResult({...exam,questionSnapshots:undefined},[]).unavailable,1);
});

test('somente a combinação de aula e item aprovados é adaptada ao motor atual',()=>{
 assert.equal(approvedExercises(MODULE01_LESSONS,curriculum).length,0);
 // Test-only approval fixture; it never changes the candidate content or build.
 const lesson=structuredClone(MODULE01_LESSONS['math.m01.t01']);
 lesson.reviewStatus='approved';
 assert.equal(approvedExercises({[lesson.id]:lesson},curriculum).length,0);
 const fixtureApproval={reviewStatus:'approved',reviewedBy:'fixture-only',reviewedAt:'2026-01-01T00:00:00Z'};
 Object.assign(lesson,fixtureApproval);Object.assign(lesson.exercises[0],fixtureApproval);
 const bank=approvedExercises({[lesson.id]:lesson},curriculum);
 assert.equal(bank.length,1);assert.equal(bank[0].id,lesson.exercises[0].id);
 assert.equal(bank[0].alternatives.find(a=>a.letter===bank[0].answer).text,lesson.exercises[0].correctAnswer);
 assert.equal(bank[0].learning.lessonId,lesson.id);
 assert.ok(bank[0].explanation.includes(lesson.exercises[0].solutionSteps[0]));
});
