import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../dist/server/index.js';
import {VIDEO_CHANNELS} from '../public/video-topics.js';
import {learningLesson,matchesLessonVideo} from '../public/lesson-topics.js';
const read=file=>JSON.parse(fs.readFileSync(new URL('../'+file,import.meta.url)));
const report=read('content/lesson-video-coverage.json'),path=read('public/learning-path.json'),canonical=read('public/curriculum.json');
const catalog=read('video-catalog-roadmap.json'),metadata=new Map(catalog.filter(v=>v.verifiedAt).map(v=>[v.id,v]));
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
function youtube(url){const u=new URL(url);if(u.pathname==='/oembed'){
 const id=new URL(u.searchParams.get('url')).searchParams.get('v'),v=metadata.get(id),channel=v&&VIDEO_CHANNELS.find(c=>c.handle===v.channelHandle);
 return channel?json({title:v.title,author_url:'https://www.youtube.com/channel/'+channel.id}):json({},404);
 }return new Response('var ytInitialData = {};');}
function check(row,data){assert.equal(data.contentId,row.id);assert.equal(data.videos.length>0,row.videoIds.length>0,row.id);
 for(const v of data.videos){assert.ok(matchesLessonVideo(v.title,learningLesson(canonical,row.id)),row.id+' '+v.title);assert.ok(VIDEO_CHANNELS.some(c=>c.handle===v.channelHandle));}}

test('o relatório cobre cada aula atual e todas as associações apontam para vídeos auditados',()=>{
 const lessons=path.modules.flatMap(m=>m.lessons);assert.equal(path.modules.length,25);assert.equal(lessons.length,199);
 assert.deepEqual(report.lessons.map(l=>l.id),lessons.map(l=>l.id));
 assert.equal(report.covered,report.lessons.filter(l=>l.videoIds.length).length);
 for(const l of report.lessons)for(const id of l.videoIds){const v=metadata.get(id);assert.ok(v&&catalog.some(row=>row.id===id&&row.lessonIds?.includes(l.id)),l.id+' '+id);assert.ok(matchesLessonVideo(v.title,learningLesson(canonical,l.id)));}
});

test('API do site consegue entregar o catálogo auditado para todas as 199 aulas',async()=>{
 const original=globalThis.fetch;let calls=0;globalThis.fetch=async url=>{calls++;return youtube(String(url));};
 try{for(const row of report.lessons){const before=calls;const response=await worker.fetch(new Request('https://test.local/api/videos?content='+row.id+'&channel=all'),{},{});assert.equal(response.status,200);check(row,await response.json());assert.ok(calls-before<=48,row.id);}}finally{globalThis.fetch=original;}
});

test('Android entrega as mesmas aulas auditadas pelo bridge nativo, sem depender do site',async()=>{
 const previous=Object.fromEntries(['window','AndroidNetwork','MutationObserver','document','location'].map(k=>[k,globalThis[k]]));let calls=0;
 const assets={'/learning-path.json':path,'/curriculum.json':canonical,'/roadmap.json':read('public/roadmap.json'),'/video-catalog.json':read('android/app/src/main/assets/video-catalog.json'),'/bank.json':[],'/study-bank.json':[],'/curriculum-index.json':{}};
 const native={postMessage(message){const request=JSON.parse(message);queueMicrotask(async()=>{if(request.kind==='config'){native.onmessage?.({data:JSON.stringify({id:request.id,versionName:'test',systemDark:false,autoUpdateEnabled:false})});return;}if(request.kind!=='fetch')return;calls++;const response=youtube(request.url);native.onmessage?.({data:JSON.stringify({id:request.id,status:response.status,type:response.headers.get('Content-Type'),body:await response.text()})});});}};
 globalThis.window={fetch:async input=>{const asset=new URL(typeof input==='string'?input:input.url,'https://app.local').pathname;assert.ok(Object.hasOwn(assets,asset),asset);return json(assets[asset]);}};
 globalThis.AndroidNetwork=native;globalThis.location={origin:'https://app.local'};globalThis.document={documentElement:{dataset:{}},addEventListener(){},querySelectorAll(){return [];}};globalThis.MutationObserver=class{observe(){}};
 try{await import('../android/app/src/main/assets/android-runtime.js?catalog-coverage');for(const row of report.lessons){const before=calls,response=await window.fetch('/api/videos?content='+row.id+'&channel=all');assert.equal(response.status,200);check(row,await response.json());assert.ok(calls-before<=48,row.id);}}finally{for(const [key,value]of Object.entries(previous))globalThis[key]=value;}
});
