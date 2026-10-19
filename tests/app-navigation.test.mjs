import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseAppRoute,subjectForModule,subjectRoute} from '../public/journey-navigation.js';

const source=fs.readFileSync('public/app.js','utf8');
const start=source.indexOf("let renderedRoute='';");
const end=source.indexOf('function renderStats',start);
assert.ok(start>=0&&end>start,'app navigation fragment exists');
const navigationSource=source.slice(start,end);

function harness(){
 const calls={load:[],push:[],replace:[],toast:[],events:{},scroll:0};
 const roadmap={stages:[
  {id:'stage.a',title:'Matemática',moduleIds:['math.m01']},
  {id:'stage.b',title:'Linguagens',moduleIds:['math.m02']},
 ],modules:[{id:'math.m01',lessons:[]},{id:'math.m02',lessons:[]}]};
 const modal={open:false,closed:0,close(){this.open=false;this.closed+=1;}};
 const pages=[{id:'page-mapa',hidden:false},{id:'page-praticar',hidden:true}];
 const navButtons=[{dataset:{page:'mapa'},classList:{active:false,toggle(name,value){if(name==='active')this.active=value;}}},{dataset:{page:'praticar'},classList:{active:false,toggle(name,value){if(name==='active')this.active=value;}}}];
 const elements={
  '#learning-dialog':modal,
  '#breadcrumb':{textContent:''},
  '#toast':{hidden:true,textContent:''},
 };
 const document={querySelector(selector){return elements[selector]??null;},querySelectorAll(selector){if(selector==='.page')return pages;if(selector==='[data-page]')return navButtons;return[];}};
 const location={hash:'#mapa'};
 const history={pushState(_state,_title,url){calls.push.push(url);location.hash=url.startsWith('#')?url:'#'+url;},replaceState(_state,_title,url){calls.replace.push(url);location.hash=url.startsWith('#')?url:'#'+url;}};
 const window={addEventListener(name,fn){calls.events[name]=fn;},scrollTo({top}){calls.scroll=top;}};
 const renderJourney=async subjectId=>{calls.load.push(subjectId);};
 const app=new Function('roadmap','document','location','history','window','renderJourney','parseAppRoute',`
  let data={roadmap},toastTimer;
  const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
  const loadVideoLibrary=()=>{},renderPractice=()=>{},renderCards=()=>{},renderExam=()=>{};
  function toast(message){callsToast(message);}
  const callsToast=message=>toastSink(message);
  const toastSink=message=>{};
  ${navigationSource}
  return {navigate,loadJourney,handleRouteChange,state:()=>({page,renderedRoute,handledHash})};
 `)(roadmap,document,location,history,window,renderJourney,parseAppRoute);
 // The fragment's toast sink is intentionally side-effect free; routing state
 // and history are the observable contract under test.
 return {app,calls,roadmap,location,modal,pages,navButtons};
}

test('push, back and duplicate hash/popstate events preserve the selected subject',async()=>{
 const {app,calls,location}=harness();
 app.navigate('mapa',false,true);
 await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(calls.load,[null]);
 app.navigate('mapa/materia/stage.a');
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(calls.push.at(-1),'#mapa/materia/stage.a');
 assert.deepEqual(calls.load,[null,'stage.a']);
 app.navigate('mapa/materia/stage.b');
 await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(calls.load,[null,'stage.a','stage.b']);
 location.hash='#mapa/materia/stage.a';
 calls.events.popstate();
 calls.events.hashchange();
 await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(calls.load,[null,'stage.a','stage.b','stage.a']);
 assert.equal(app.state().renderedRoute,'mapa/materia/stage.a');
});

test('loadJourney encaminha IDs exatos, volta à home com null e preserva undefined',async()=>{
 const {app,calls}=harness();
 await app.loadJourney('stage.b');
 await app.loadJourney();
 await app.loadJourney(null);
 assert.deepEqual(calls.load,['stage.b',undefined,null]);
});

test('rota inválida corrige o hash por replace e rota válida mantém Aprender ativa',async()=>{
 const {app,calls,location,navButtons}=harness();
 app.navigate('mapa/materia/stage.a');
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(navButtons[0].classList.active,true);
 app.navigate('mapa/materia/does-not-exist');
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(calls.replace.at(-1),'#mapa');
 assert.equal(location.hash,'#mapa');
 assert.equal(app.state().renderedRoute,'mapa');
 assert.equal(calls.load.at(-1),null);
});

test('o modal só fecha quando a rota realmente muda',()=>{
 const {app,modal}=harness();
 app.navigate('mapa',false,true);
 modal.open=true;
 app.navigate('mapa',false);
 assert.equal(modal.closed,0);
 app.navigate('praticar',false);
 assert.equal(modal.closed,1);
});

test('abrir módulo aguarda o close do diálogo e evita re-render na mesma matéria',async()=>{
 const uiSource=fs.readFileSync('public/journey-ui.js','utf8');
 const helperStart=uiSource.indexOf('function waitDialogClose');
 const helperEnd=uiSource.indexOf('export async function openJourneyModule',helperStart);
 assert.ok(helperStart>=0&&helperEnd>helperStart,'journey close helper exists');
 const roadmap={stages:[{id:'stage.a',moduleIds:['math.m01']},{id:'stage.b',moduleIds:['math.m02']}],modules:[{id:'math.m01'},{id:'math.m02'}]};
 const dialog={open:true,listeners:new Map(),closed:0,addEventListener(name,fn){this.listeners.set(name,fn);},close(){this.closed+=1;queueMicrotask(()=>this.listeners.get('close')?.());}};
 const navigated=[],loaded=[];
 let helper;
 helper=new Function('roadmap','subjectForModule','subjectRoute','dialog','config','loaded',`
  let subjectId='stage.a';
  const $=selector=>dialog;
  const location={hash:'#mapa/materia/stage.a'};
  const loadJourney=async id=>{loaded.push(id);subjectId=id;};
  ${uiSource.slice(helperStart,helperEnd)}
  return {ensureModuleSubject,state:()=>subjectId};
 `)(roadmap,subjectForModule,subjectRoute,dialog,{navigate:route=>{navigated.push(route);}},loaded);
 await helper.ensureModuleSubject('math.m01');
 assert.equal(dialog.closed,1);
 assert.deepEqual(navigated,[]);
 assert.deepEqual(loaded,[]);
 dialog.open=true;
 await helper.ensureModuleSubject('math.m02');
 assert.equal(dialog.closed,2);
 assert.deepEqual(navigated,['mapa/materia/stage.b']);
 assert.deepEqual(loaded,['stage.b']);
 assert.equal(helper.state(),'stage.b');
});

test('aula e módulo carregam IDs de foco estáveis após renderização',()=>{
 const uiSource=fs.readFileSync('public/journey-ui.js','utf8');
 assert.match(uiSource,/id="journey-subject-\$\{esc\(stage\.id\)\}"/);
 assert.match(uiSource,/id="journey-lesson-\$\{l\.id\}"/);
 assert.match(uiSource,/returnFocusSubjectId/);
});
