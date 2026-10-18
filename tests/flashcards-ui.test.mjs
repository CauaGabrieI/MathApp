import test from 'node:test';
import assert from 'node:assert/strict';
import {initFlashcardsUI} from '../public/flashcards-ui.js';

class FakeButton{
 constructor(kind){this.kind=kind;this.disabled=false;this.dataset={};if(kind==='reveal')this.dataset.flashcardReveal='';if(kind==='learn')this.dataset.flashcardLearn='';if(kind==='grade')this.dataset.flashcardGrade='good';}
 hasAttribute(name){return (name==='data-flashcard-reveal'&&this.kind==='reveal')||(name==='data-flashcard-learn'&&this.kind==='learn')||(name==='data-flashcard-grade'&&this.kind==='grade');}
 matches(selector){return selector==='button';}
 closest(selector){if(selector==='button')return this;return selector==='[data-flashcard-grade]'&&this.kind==='grade'?this:null;}
 focus(){}
}
class FakeRoot{
 constructor(){this.listeners={};this.html='';this.hidden=false;}
 closest(){return null;}
 contains(){return true;}
 addEventListener(type,fn){this.listeners[type]=fn;}
 removeEventListener(type){delete this.listeners[type];}
 querySelector(selector){if(selector==='[data-flashcard-grade]'&&this.html.includes('data-flashcard-grade'))return new FakeButton('grade');if(selector==='[data-flashcard-reveal]'&&this.html.includes('data-flashcard-reveal'))return new FakeButton('reveal');return null;}
 set innerHTML(value){this.html=value;}
 get innerHTML(){return this.html;}
 replaceChildren(){this.html='';}
}

test('revela, atalhos e update preservam o cartão atual',async()=>{
 const previous=globalThis.document,root=new FakeRoot(),events={};
 globalThis.document={querySelector:()=>null,addEventListener:(type,fn)=>{events[type]=fn;},removeEventListener(){}};
 const reviewed=[];
 try{
  const ui=initFlashcardsUI({root,onReview:async(id,grade)=>reviewed.push([id,grade])});
  ui.update({cards:[{id:'c1',question:'Quanto é 2 + 2?',answer:'4',moduleTitle:'Módulo 1'}],counts:{new:1},total:1});
  root.listeners.click({target:new FakeButton('reveal')});
  assert.match(root.html,/flashcard-answer/);
  ui.update({cards:[{id:'c1',question:'Quanto é 2 + 2?',answer:'quatro',moduleTitle:'Módulo 1'}],counts:{new:1},total:1});
  assert.match(root.html,/flashcard-answer/);
  const event={target:{closest:()=>null},key:'1',code:'Digit1',defaultPrevented:false,preventDefault(){this.defaultPrevented=true;}};
  events.keydown(event);
  await Promise.resolve();
  assert.deepEqual(reviewed,[['c1','again']]);
  ui.destroy();
 }finally{globalThis.document=previous;}
});

test('falha de persistência mantém resposta revelada e informa erro',async()=>{
 const previous=globalThis.document,root=new FakeRoot(),events={};
 globalThis.document={querySelector:()=>null,addEventListener:(type,fn)=>{events[type]=fn;},removeEventListener(){}};
 const errors=[];
 try{
  const ui=initFlashcardsUI({root,onReview:async()=>{throw new Error('offline');},onError:error=>errors.push(error.message)});
  ui.update({cards:[{id:'c1',question:'Pergunta',answer:'Resposta'}],total:1});
  root.listeners.click({target:new FakeButton('reveal')});
  root.listeners.click({target:new FakeButton('grade')});
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.match(root.html,/flashcard-answer/);
  assert.deepEqual(errors,['offline']);
  ui.destroy();
 }finally{globalThis.document=previous;}
});
