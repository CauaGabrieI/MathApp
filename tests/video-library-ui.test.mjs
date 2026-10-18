import test from 'node:test';
import assert from 'node:assert/strict';

const curriculum={modules:Array.from({length:25},(_,index)=>{const n=String(index+1).padStart(2,'0');return{id:`math.m${n}`,order:index+1,title:`Módulo ${n}`,lessons:[{id:`math.m${n}.t01`,order:1,title:'Introdução'},{id:`math.m${n}.t02`,order:2,title:'Aplicações'}]};})};

class FakeElement{
 constructor(id){this.id=id;this.innerHTML='';this.value='';this.disabled=false;this.hidden=false;this.listeners={};this.isConnected=true;}
 addEventListener(type,listener){(this.listeners[type]??=[]).push(listener);}
 dispatch(type){for(const listener of this.listeners[type]??[])listener({type,target:this});}
 querySelector(selector){if(selector==='[data-video-retry]'&&this.innerHTML.includes('data-video-retry')){this.retry??=new FakeElement('retry');return this.retry;}return null;}
 closest(){return null;}
}

test('biblioteca de vídeos mantém seleção, rotas, corrida e retry do catálogo',async()=>{
 const previousDocument=globalThis.document,previousWindow=globalThis.window,previousFetch=globalThis.fetch;
 const elements=new Map(['video-topic-filter','video-lesson-filter','video-channel-filter','video-channel-list','video-results','video-personalization','video-filter-description','page-videos','question-videos'].map(id=>[id,new FakeElement(id)]));
 globalThis.document={querySelector(selector){return elements.get(selector.slice(1))??null;}};
 globalThis.window={addEventListener(){}};
 let catalogAttempts=0;const delayed=new Map();const requests=[];
 const response=body=>new Response(JSON.stringify(body),{status:200,headers:{'Content-Type':'application/json'}});
 globalThis.fetch=async url=>{
  requests.push(String(url));
  if(String(url).startsWith('/learning-path.json')){catalogAttempts++;if(catalogAttempts===1)throw new Error('offline');return response(curriculum);}
  const parsed=new URL(String(url),'https://app.test');
  const content=parsed.searchParams.get('content');
  if(content==='math.m04'||content==='math.m05'){return new Promise(resolve=>delayed.set(content,resolve));}
  if(parsed.searchParams.get('question'))return response({videos:[],topic:'statistics'});
  return response({videos:[{id:'abcdefghijk',title:`Aula ${content}`,channel:'Canal',url:'https://youtube.com/watch?v=abcdefghijk',thumbnail:'https://img.test/x.jpg'}]});
 };
 try{
  const {initVideoUI,loadVideoLibrary}=await import('../public/videos.js?ui-test');
  let contextual=false;
  initVideoUI(()=>({records:[],roadmap:contextual?curriculum:undefined,question:contextual?{id:'q1',question:'Calcule a mediana'}:null,content:null}));
  await loadVideoLibrary();
  assert.match(elements.get('video-results').innerHTML,/Tentar novamente/);
  elements.get('video-results').querySelector('[data-video-retry]').dispatch('click');
  await new Promise(resolve=>setTimeout(resolve,0));
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(elements.get('video-topic-filter').value,'math.m01');
  assert.equal(elements.get('video-lesson-filter').value,'math.m01.t01');
  assert.equal(elements.get('video-lesson-filter').disabled,false);
  assert.ok(requests.some(url=>url.includes('content=math.m01.t01')));

  elements.get('video-topic-filter').value='math.m03';elements.get('video-topic-filter').dispatch('change');await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(elements.get('video-lesson-filter').value,'');
  assert.ok(requests.some(url=>url.includes('content=math.m03')));
  elements.get('video-lesson-filter').value='math.m03.t02';elements.get('video-lesson-filter').dispatch('change');await new Promise(resolve=>setTimeout(resolve,0));
  assert.ok(requests.some(url=>url.includes('content=math.m03.t02')));
  elements.get('video-channel-filter').value='Giscomgiz';elements.get('video-channel-filter').dispatch('change');await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(elements.get('video-lesson-filter').value,'math.m03.t02');
  assert.ok(requests.some(url=>url.includes('content=math.m03.t02')&&url.includes('channel=Giscomgiz')));

  elements.get('video-topic-filter').value='math.m04';elements.get('video-topic-filter').dispatch('change');elements.get('video-topic-filter').value='math.m05';elements.get('video-topic-filter').dispatch('change');
  await new Promise(resolve=>setTimeout(resolve,0));
  delayed.get('math.m05')?.(response({videos:[{id:'mnopqrstuvw',title:'M05',channel:'Canal',url:'https://youtube.com/watch?v=mnopqrstuvw',thumbnail:'x'}]}));
  delayed.get('math.m04')?.(response({videos:[{id:'qrstuvwxyz0',title:'M04',channel:'Canal',url:'https://youtube.com/watch?v=qrstuvwxyz0',thumbnail:'x'}]}));
  await new Promise(resolve=>setTimeout(resolve,0));assert.match(elements.get('video-results').innerHTML,/M05/);assert.doesNotMatch(elements.get('video-results').innerHTML,/M04/);

  contextual=true;elements.get('video-topic-filter').value='context';elements.get('video-topic-filter').dispatch('change');await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(elements.get('video-lesson-filter').disabled,true);assert.match(elements.get('video-topic-filter').innerHTML,/Relacionado à minha atividade/);
 }finally{globalThis.document=previousDocument;globalThis.window=previousWindow;globalThis.fetch=previousFetch;}
});
