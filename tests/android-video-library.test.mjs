import test from 'node:test';
import assert from 'node:assert/strict';

const channel = 'professorferretto';
const channelId = 'UCW9_n8p_Byz-4k8wV1tnUBg';
const videos = [
  {id:'FraVideo01A', title:'FRAÇÕES: aula completa e exemplos', channelHandle:channel, topic:'basics', lessonIds:['math.m01.t03'], curated:true},
  {id:'AddVideo02B', title:'ADIÇÃO E SUBTRAÇÃO: aula completa', channelHandle:channel, topic:'basics', lessonIds:['math.m01.t05'], curated:true},
  {id:'FraVideo01A', title:'FRAÇÕES: aula completa e exemplos', channelHandle:channel, topic:'basics', lessonIds:['math.m01.t03','math.m01.t05'], curated:true}
];
const curriculum={modules:[{id:'math.m01',title:'Números e operações',order:1,topics:Array.from({length:10},(_,i)=>({id:`math.m01.t${String(i+1).padStart(2,'0')}`,title:i===2?'Frações':i===4?'Adição e subtração':`Aula de apoio ${i+1}`}))}]};

test('Android /api/videos agrega as aulas de um módulo e preserva filtros', async()=>{
  const previous={window:globalThis.window,network:globalThis.AndroidNetwork,observer:globalThis.MutationObserver,document:globalThis.document,location:globalThis.location};
  const responses={};
  const jsonResponse=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
  const browserFetch=async input=>{
    responses.browser=(responses.browser??0)+1;
    const path=new URL(typeof input==='string'?input:input.url,'https://app.local').pathname;
    if(path==='/learning-path.json'||path==='/curriculum.json')return jsonResponse(curriculum);
    if(path==='/roadmap.json')return jsonResponse({modules:[]});
    if(path==='/video-catalog.json')return jsonResponse(videos);
    if(path==='/bank.json')return jsonResponse([]);
    if(path==='/study-bank.json')return jsonResponse([]);
    if(path==='/curriculum-index.json')return jsonResponse({});
    throw new Error(`unexpected browser fetch: ${path}`);
  };
  const network={postMessage(message){const request=JSON.parse(message);queueMicrotask(async()=>{
    if(request.kind==='config'){return network.onmessage?.({data:JSON.stringify({id:request.id,versionName:'test',systemDark:false,autoUpdateEnabled:false})});}
    if(request.kind!=='fetch')return;
    const url=new URL(request.url);
    responses.network=(responses.network??0)+1;
    if(url.pathname.includes('/oembed')){
      const id=new URLSearchParams(url.search).get('url')?.split('v=')[1];
      const item=videos.find(v=>v.id===id);
      const body=JSON.stringify({title:item?.title??'',author_url:`https://www.youtube.com/channel/${channelId}`});
      return network.onmessage?.({data:JSON.stringify({id:request.id,status:200,type:'application/json',body})});
    }
    responses.search=(responses.search??0)+1;
    const body='var ytInitialData = {};';
    network.onmessage?.({data:JSON.stringify({id:request.id,status:200,type:'text/html',body})});
  });}};
  const fakeWindow={fetch:browserFetch};
  globalThis.window=fakeWindow;globalThis.AndroidNetwork=network;
  globalThis.location={origin:'https://app.local'};
  globalThis.document={documentElement:{dataset:{}},addEventListener(){},querySelectorAll(){return [];}};
  globalThis.MutationObserver=class{observe(){}};
  try {
    await import('../android/app/src/main/assets/android-runtime.js?android-video-library-test');
    const allResponse=await window.fetch('/api/videos?content=math.m01&channel=all');
    assert.equal(allResponse.status,200);
    const all=await allResponse.json();
    assert.deepEqual(all.videos.map(video=>video.id).sort(),['AddVideo02B','FraVideo01A'].sort());
    assert.equal(new Set(all.videos.map(video=>video.id)).size,2);
    assert.ok((responses.network??0)<=48,`module request exceeded shared budget: ${responses.network}`);
    const response=await window.fetch('/api/videos?content=math.m01&channel='+channel);
    assert.equal(response.status,200);
    const data=await response.json();
    assert.deepEqual(data.videos.map(video=>video.id).sort(),['AddVideo02B','FraVideo01A'].sort());
    assert.equal(new Set(data.videos.map(video=>video.id)).size,2);
    assert.ok(data.videos.every(video=>video.channelHandle===channel));
    const lesson=await window.fetch('/api/videos?content=math.m01.t03&channel='+channel);
    assert.deepEqual((await lesson.json()).videos.map(video=>video.id),['FraVideo01A']);
    assert.equal((await window.fetch('/api/videos?content=math.m01&channel=invalid')).status,400);
    assert.equal((await window.fetch('/api/videos?content=math.m99&channel='+channel)).status,400);
    const beforeSearch=responses.search??0;
    const topic=await window.fetch('/api/videos?topic=basics&channel='+channel);
    assert.equal(topic.status,200);
    assert.deepEqual((await topic.json()).videos,[]);
    assert.ok((responses.search??0)>beforeSearch,'topic-only route must still search the authorized channel');
  } finally { globalThis.window=previous.window;globalThis.AndroidNetwork=previous.network;globalThis.MutationObserver=previous.observer;globalThis.document=previous.document;globalThis.location=previous.location; }
});
