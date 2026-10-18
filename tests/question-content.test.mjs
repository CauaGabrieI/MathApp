import test from 'node:test';
import assert from 'node:assert/strict';
import {refreshQuestionContent} from '../public/question-content.js';
const saved={id:'enemdev:2013:139',answer:'C',statement:'',introduction:'Qual o total?',format:'markdown',alternatives:['A','B','C','D','E'].map((letter,i)=>({letter,text:String(i)}))};
test('old attempts receive full context and media without changing answer identities or history',()=>{
 const current={...saved,statement:'Uma torneira pinga uma gota a cada três segundos durante seis horas. Qual o total?',introduction:'',format:'html',files:['https://enem.dev/figure.png'],contentSource:'enemhub-recovered',alternatives:[...saved.alternatives].reverse().map(a=>({...a,file:a.letter==='C'?'https://enem.dev/answer.png':null}))};
 const attempt={id:saved.id,question:saved,seenAt:10,completedAt:20,selectedAnswer:'C'};
 const updated={...attempt,question:refreshQuestionContent(attempt.question,current)};
 assert.equal(updated.question.statement,current.statement);assert.equal(updated.question.format,'html');
 assert.equal(updated.selectedAnswer,'C');assert.equal(updated.completedAt,20);
 assert.deepEqual(updated.question.alternatives.map(a=>a.letter),['A','B','C','D','E']);
 assert.equal(updated.question.alternatives.find(a=>a.letter==='C').file,'https://enem.dev/answer.png');
 assert.equal(saved.statement,'');
});
test('different gabarito or reordered text identities never changes a saved attempt',()=>{
 assert.equal(refreshQuestionContent(saved,{...saved,answer:'B'}),saved);
 assert.equal(refreshQuestionContent(saved,{...saved,alternatives:saved.alternatives.map((a,i)=>({...a,text:String(4-i)}))}),saved);
 assert.equal(refreshQuestionContent(saved,{...saved,id:'other'}),saved);
});
test('a shorter online source cannot truncate richer local context',()=>{
 const full={...saved,statement:'Contexto completo e detalhado com todos os dados necessários.'};
 assert.equal(refreshQuestionContent(full,saved).statement,full.statement);
});

test("mathematical signs and fractions cannot change in saved alternatives",()=>{
 const negative={...saved,alternatives:saved.alternatives.map(a=>({...a,text:a.letter==='A'?'-1':a.text}))};
 const positive={...negative,alternatives:negative.alternatives.map(a=>({...a,text:a.letter==='A'?'1':a.text}))};
 assert.equal(refreshQuestionContent(negative,positive),negative);
});
