import test from 'node:test';
import assert from 'node:assert/strict';
import {IDBFactory} from 'fake-indexeddb';
import {openDB,closeDB} from '../public/db.js?v=math27';

class Events {
 constructor(){this.listeners=new Map();}
 addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,[]);this.listeners.get(type).push(fn);}
 async emit(type,event={}){await Promise.all((this.listeners.get(type)??[]).map(fn=>fn(event)));}
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
let sequence=0;
async function harness(handler){
 const old={window:globalThis.window,document:globalThis.document,indexedDB:globalThis.indexedDB,setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout,setInterval:globalThis.setInterval,now:Date.now};
 let now=1700000000000,panel=false,timerId=0;const timers=new Map(),calls=[],root={innerHTML:''},win=new Events(),doc=new Events();
 doc.hidden=false;doc.querySelector=selector=>selector==='#github-panel'&&panel?root:null;
 win.EquacaoAndroid={githubRequest:async(action,input)=>{calls.push(action);return handler(action,input,now);}};
 globalThis.window=win;globalThis.document=doc;closeDB();globalThis.indexedDB=new IDBFactory();
 globalThis.setTimeout=(fn,delay,...args)=>{const id=++timerId;timers.set(id,{at:now+Number(delay||0),fn:()=>fn(...args)});return id;};
 globalThis.clearTimeout=id=>timers.delete(id);globalThis.setInterval=()=>0;Date.now=()=>now;
 await openDB();const ui=await import(`../public/github-ui.js?auth-recovery-${++sequence}`);
 const callbacks={showDialog:()=>{panel=true;root.innerHTML='';},toast:()=>{},refresh:async()=>{},broadcast:()=>{}};
 const h={calls,root,win,doc,ui,now:()=>now,setNow:value=>{now=value;},
  init:()=>ui.initGitHub(callbacks),open:()=>ui.openGitHub(),
  click:action=>doc.emit('click',{target:{closest:selector=>selector==='[data-github]'?{dataset:{github:action}}:null}}),
  async advance(ms){now+=ms;for(let guard=0;guard<30;guard++){const due=[...timers].filter(([,v])=>v.at<=now).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)return;timers.delete(due[0]);await due[1].fn();}throw new Error('Unexpected timer loop');},
  cleanup(){closeDB();Object.assign(globalThis,{window:old.window,document:old.document,indexedDB:old.indexedDB,setTimeout:old.setTimeout,clearTimeout:old.clearTimeout,setInterval:old.setInterval});Date.now=old.now;}
 };return h;
}
const flow=now=>({userCode:'TEST-CODE',verificationUri:'https://github.com/login/device',expiresAt:now+600000,interval:5,nextPollAt:now+5000,phase:'authorizing'});
const anonymous={configured:true,user:null};
const account={id:42,login:'student-fixture'};
const assertNoBackup=calls=>assert.equal(calls.some(action=>['read','write'].includes(action)),false);

test('returning from GitHub resumes once, connects, and never starts a backup',async()=>{
 let pending;const h=await harness((action,input,now)=>action==='status'?{...anonymous,flow:pending??=flow(now)}:action==='poll'?{user:account}:assert.fail('Unexpected action '+action));
 try{
  await h.init();assert.match(h.root.innerHTML,/TEST-CODE/);h.setNow(h.now()+5000);const statusBefore=h.calls.filter(x=>x==='status').length;
  await Promise.all([h.win.emit('android-app-resume'),h.win.emit('focus'),h.win.emit('online'),h.doc.emit('visibilitychange')]);
  assert.equal(h.calls.filter(x=>x==='status').length,statusBefore+1);assert.equal(h.calls.filter(x=>x==='poll').length,1);
  assert.match(h.root.innerHTML,/@student-fixture/);assert.doesNotMatch(h.root.innerHTML,/github-code/);assert.equal(h.calls.includes('start'),false);assertNoBackup(h.calls);
 }finally{h.cleanup();}
});

test('temporary polling failure keeps the original code and retries after the interval',async()=>{
 let polls=0;const h=await harness((action,input,now)=>{
  if(action==='status')return anonymous;if(action==='start')return flow(now);
  if(action==='poll'){if(++polls===1)throw Object.assign(new Error('Tempo esgotado'),{status:502});return {user:account};}
  assert.fail('Unexpected action '+action);
 });
 try{
  await h.init();await h.open();await h.click('login');await h.advance(5000);
  assert.match(h.root.innerHTML,/TEST-CODE/);assert.match(h.root.innerHTML,/código foi mantido/);assert.equal(polls,1);
  await h.advance(9999);assert.equal(polls,1);await h.advance(1);assert.equal(polls,2);
  assert.match(h.root.innerHTML,/@student-fixture/);assert.equal(h.calls.filter(x=>x==='start').length,1);assertNoBackup(h.calls);
 }finally{h.cleanup();}
});

test('a recovered finishing flow connects without requiring another authorization code',async()=>{
 const h=await harness((action,input,now)=>action==='status'?{...anonymous,flow:{...flow(now),userCode:'',phase:'finishing'}}:action==='poll'?{user:account}:assert.fail('Unexpected action '+action));
 try{await h.init();assert.match(h.root.innerHTML,/Autorização confirmada/);assert.doesNotMatch(h.root.innerHTML,/github-code/);await h.advance(5000);assert.match(h.root.innerHTML,/@student-fixture/);assertNoBackup(h.calls);assert.equal(h.calls.includes('start'),false);}finally{h.cleanup();}
});

test('cancelling ignores a late successful polling response',async()=>{
 let pending,resolvePoll;const h=await harness((action,input,now)=>{
  if(action==='status')return {...anonymous,flow:pending??=flow(now)};
  if(action==='poll')return new Promise(resolve=>{resolvePoll=resolve;});
  if(action==='logout')return {user:null};assert.fail('Unexpected action '+action);
 });
 try{
  await h.init();h.setNow(h.now()+5000);const returning=h.win.emit('android-app-resume');
  for(let i=0;i<10&&!resolvePoll;i++)await tick();assert.ok(resolvePoll);
  const cancelled=h.click('cancel');await tick();resolvePoll({user:account});await Promise.all([returning,cancelled]);
  assert.match(h.root.innerHTML,/Conectar com GitHub/);assert.doesNotMatch(h.root.innerHTML,/@student-fixture/);assert.equal(h.calls.filter(x=>x==='logout').length,1);assertNoBackup(h.calls);
 }finally{h.cleanup();}
});

test('expired codes and denied authorization stop polling without restarting login',async()=>{
 for(const mode of ['expired','denied']){
  let pending;const h=await harness((action,input,now)=>{
   if(action==='status')return anonymous;if(action==='start')return pending={...flow(now),expiresAt:now+(mode==='expired'?4000:600000)};
   if(action==='poll')throw Object.assign(new Error('Autorização cancelada'),{status:400});assert.fail('Unexpected action '+action);
  });
  try{await h.init();await h.open();await h.click('login');await h.advance(5000);assert.match(h.root.innerHTML,/Conectar com GitHub/);const polls=h.calls.filter(x=>x==='poll').length;await h.advance(30000);assert.equal(h.calls.filter(x=>x==='poll').length,polls);assert.equal(h.calls.filter(x=>x==='start').length,1);assertNoBackup(h.calls);}finally{h.cleanup();}
 }
});
