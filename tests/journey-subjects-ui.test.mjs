import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

class FakeElement{
 constructor(id=''){this.id=id;this.innerHTML='';this.listeners={};this.open=false;this.hidden=false;this.isConnected=true;this.classList={add(){},remove(){}};this.focused=false;}
 addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
 dispatch(type,event={target:this}){for(const fn of this.listeners[type]??[])fn({...event,type,target:this});}
 focus(){this.focused=true;globalThis.document.activeElement=this;}
 contains(node){return Boolean(node&&node===this);}
 querySelector(selector){if(selector==='.journey-heading h1'){this.heading??=new FakeElement('journey-heading');return this.heading;}if(selector==='#journey-search'){this.search??=new FakeElement('journey-search');return this.search;}if(selector==='#journey-path'){this.path??=new FakeElement('journey-path');return this.path;}return null;}
 querySelectorAll(){return[];}
 setSelectionRange(){}
}

test('home e tela de matéria renderizam separadamente e salvam busca por matéria',async()=>{
 const previousDocument=globalThis.document,previousWindow=globalThis.window;
 const root=new FakeElement('learning-root'),dialog=new FakeElement('learning-dialog'),content=new FakeElement('learning-dialog-content');
 const elements={'learning-root':root,'learning-dialog':dialog,'learning-dialog-content':content};
 let saved;
 globalThis.document={activeElement:null,querySelector(selector){return elements[selector.slice(1)]??root.querySelector(selector);},getElementById(){return null;}};
 globalThis.window={scrollY:0,scrollTo(){}};
 try{
  const base=JSON.parse(fs.readFileSync('public/learning-path.json','utf8'));
  const roadmap={...base,stages:[{id:'stage.one',title:'Base',description:'Primeira matéria',order:1,moduleIds:base.modules.slice(0,13).map(m=>m.id)},{id:'stage.two',title:'Aplicações',description:'Segunda matéria',order:2,moduleIds:base.modules.slice(13).map(m=>m.id)}]};
  const {initJourney,loadJourney}=await import('../public/journey-ui.js?subjects-ui-test');
  initJourney({loadRoadmap:async()=>roadmap,state:()=>({learningEntries:[],exams:[],learningFilters:{},bank:[]}),saveView:async value=>{saved=value;},navigate(){},toast(){}});
  await loadJourney(null);
  assert.match(root.innerHTML,/data-journey-subject="stage\.one"/);
  assert.match(root.innerHTML,/data-journey-subject="stage\.two"/);
  await loadJourney('stage.two');
  assert.match(root.innerHTML,/Aplicações/);
  assert.doesNotMatch(root.innerHTML,/data-path-stage/);
  assert.match(root.querySelector('#journey-path').innerHTML,/math\.m14/);
  const search=root.querySelector('#journey-search');search.value='Módulo 14';search.dispatch('input');
  assert.equal(saved.pathView.queries['stage.two'],'Módulo 14');
  assert.equal(root.heading.focused,true);
 }finally{globalThis.document=previousDocument;globalThis.window=previousWindow;}
});
