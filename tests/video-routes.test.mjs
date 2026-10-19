import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../dist/server/index.js';
import {learningLesson,lessonVideoQueries,MODULE_VIDEO_TOPICS} from '../public/lesson-topics.js';

const curriculum=JSON.parse(fs.readFileSync('public/learning-path.json','utf8'));
const moduleIds=curriculum.modules.map(module=>module.id);
const lessonIds=curriculum.modules.flatMap(module=>module.lessons.map(lesson=>lesson.id));
const call=path=>worker.fetch(new Request('https://test.local'+path),{},{});

test('todos os módulos e aulas math possuem resolução e termos de vídeo',()=>{
  assert.equal(moduleIds.length,25);
  assert.equal(lessonIds.length,199);
  for(const id of [...moduleIds,...lessonIds]){
    const lesson=learningLesson(curriculum,id);
    assert.equal(lesson?.id,id);
    assert.ok(lesson.title);
    assert.ok(lessonVideoQueries(lesson).length,`sem consulta para ${id}`);
  }
});

test('rotas de conteúdo válidas funcionam offline e aceitam Ferretto',async()=>{
  const original=globalThis.fetch,calls=[];
  globalThis.fetch=async url=>{calls.push(String(url));return new Response('var ytInitialData = {};',{status:200});};
  try{
    for(const id of moduleIds){
      const response=await call('/api/videos?content='+encodeURIComponent(id)+'&channel=professorferretto');
      assert.equal(response.status,200,id);
      const data=await response.json();
      assert.equal(data.contentId,id);
      assert.equal(data.videos.length,0);
      assert.ok(data.topic);
      const module=curriculum.modules.find(item=>item.id===id);
      assert.equal(data.topic,MODULE_VIDEO_TOPICS[module.sourceNumber],`tema incorreto para ${id}`);
    }
    for(const id of [lessonIds[0],lessonIds.at(-1)]){
      const response=await call('/api/videos?content='+encodeURIComponent(id)+'&channel=professorferretto');
      assert.equal(response.status,200,id);
      const data=await response.json();
      assert.equal(data.contentId,id);
      assert.equal(data.videos.length,0);
      assert.ok(data.topic);
    }
    assert.ok(calls.length>0);
    const ferrettoIds=new Set(['video-catalog.json','video-catalog-roadmap.json'].flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8'))).filter(v=>v.channelHandle==='professorferretto').map(v=>v.id));
    for(const url of calls){const u=new URL(url);assert.equal(u.origin,'https://www.youtube.com');
      if(u.pathname==='/oembed')assert.ok(ferrettoIds.has(new URL(u.searchParams.get('url')).searchParams.get('v')),'só verifica candidatos do canal filtrado');
      else assert.equal(u.pathname,'/@professorferretto/search');
    }
  }finally{globalThis.fetch=original;}
});

test('rotas rejeitam conteúdo, canal e método inválidos sem consultar o YouTube',async()=>{
  const original=globalThis.fetch;let calls=0;
  globalThis.fetch=async()=>{calls++;return new Response('unexpected',{status:200});};
  try{
    assert.equal((await call('/api/videos?content=math.m26')).status,400);
    assert.equal((await call('/api/videos?content=math.m01.t01&channel=canal-inexistente')).status,400);
    assert.equal((await worker.fetch(new Request('https://test.local/api/videos',{method:'POST'}),{},{})).status,405);
    assert.equal(calls,0);
  }finally{globalThis.fetch=original;}
});
