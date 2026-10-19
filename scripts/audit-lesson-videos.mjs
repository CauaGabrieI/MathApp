// Live, resumable audit of the current curriculum, never the archived roadmap.
// Output is review material; this command never overwrites the production catalog.
import fs from 'node:fs/promises';
import path from 'node:path';
import {VIDEO_CHANNELS,isVideoLesson} from '../public/video-topics.js';
import {learningLesson,lessonVideoQueries,matchesLessonVideo} from '../public/lesson-topics.js';
import {extractChannelVideos} from '../video-service.js';
const args=process.argv.slice(2),arg=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const out=path.resolve(arg('--output-dir','/tmp/equacao-lesson-video-audit'));
const min=Math.max(1,Number(arg('--min-videos','2'))),search=args.includes('--search-missing'),globalSearch=args.includes('--global-search');
await fs.mkdir(out,{recursive:true});
const read=async(file,fallback)=>{try{return JSON.parse(await fs.readFile(file,'utf8'));}catch(error){if(error.code==='ENOENT')return fallback;throw error;}};
const curriculum=await read('public/learning-path.json'),canonical=await read('public/curriculum.json'),original=await read('video-catalog-roadmap.json',[]),base=await read('video-catalog.json',[]);
// Match the hosted /api/videos context; the current path supplies the exact IDs
// and count, while archived support resources must not choose a lesson's topic.
const lessons=curriculum.modules.flatMap(m=>m.lessons.map(l=>({...learningLesson(canonical,l.id),moduleId:m.id})));
const allowed=new Map(VIDEO_CHANNELS.map(c=>[c.handle,c])),cache=await read(path.join(out,'network-cache.json'),{videos:{},searches:{}});
const pool=new Map(),issues=search?[]:(await read(path.join(out,'coverage.json'),{})).issues??[];let checks=0,requests=0;
// Reuse verified discovery candidates when resuming without repeating searches.
for(const [key,v] of Object.entries(cache.videos)){const channel=VIDEO_CHANNELS.find(c=>key.endsWith(':'+c.id));if(channel&&v.status===200&&Date.now()-Date.parse(v.checkedAt)<86400000&&owner(v.authorUrl,channel)&&isVideoLesson(v.title)){const id=key.split(':')[0];pool.set(id,{id,title:v.title,channelHandle:channel.handle,sourceUrl:'https://www.youtube.com/watch?v='+id,verifiedAt:v.checkedAt});}}
const headers={'User-Agent':'Mozilla/5.0','Accept-Language':'pt-BR,pt;q=0.9'};
let saving=Promise.resolve();
const save=()=>{const snapshot=JSON.stringify(cache);saving=saving.then(()=>fs.writeFile(path.join(out,'network-cache.json'),snapshot));return saving;};
async function parallel(items,fn){let cursor=0;await Promise.all(Array.from({length:4},async()=>{while(cursor<items.length)await fn(items[cursor++]);}));}
// Channel IDs are case-sensitive. Compare handles case-insensitively, IDs exactly.
function owner(url,channel){try{const u=new URL(url),p=decodeURIComponent(u.pathname).replace(/\/$/,'');return u.protocol==='https:'&&['www.youtube.com','youtube.com'].includes(u.hostname)&&(p==='/channel/'+channel.id||p.normalize('NFC').toLowerCase()===('/@'+channel.handle).normalize('NFC').toLowerCase());}catch{return false;}}
async function request(url){let last;for(let i=0;i<2;i++){try{requests++;const r=await fetch(url,{headers,signal:AbortSignal.timeout(8000)});if(r.status===429||r.status>=500)throw new Error('HTTP '+r.status);return r;}catch(e){last=e;}}throw last;}
const pending=new Map();
async function verify(candidate){
 const channel=allowed.get(candidate.channelHandle);if(!channel||!/^[-\w]{11}$/.test(candidate.id))return null;
 const key=candidate.id+':'+channel.id;if(pending.has(key))return pending.get(key);
 const work=(async()=>{let check=cache.videos[key];if(!check||Date.now()-Date.parse(check.checkedAt)>86400000){try{const r=await request('https://www.youtube.com/oembed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+candidate.id)+'&format=json');const data=r.ok?await r.json():null;check={checkedAt:new Date().toISOString(),status:r.status,title:data?.title??null,authorUrl:data?.author_url??null};cache.videos[key]=check;}catch(e){issues.push({kind:'verification',id:candidate.id,channel:channel.handle,error:e.message});return null;}}
 if(check.status!==200||!owner(check.authorUrl,channel)||!isVideoLesson(check.title))return null;
 const v={id:candidate.id,title:check.title,channelHandle:channel.handle,sourceUrl:'https://www.youtube.com/watch?v='+candidate.id,verifiedAt:check.checkedAt};pool.set(v.id,v);return v;})();pending.set(key,work);return work;
}
const unique=[...new Map([...base,...original].map(v=>[v.id+':'+v.channelHandle,v])).values()];
await parallel(unique,async v=>{await verify(v);checks++;const current=checks;if(current%40===0){await save();console.log('Vídeos existentes conferidos:',current+'/'+unique.length);}});await save();
const hits=lesson=>[...pool.values()].filter(v=>matchesLessonVideo(v.title,lesson));
if(search){let done=0;const gaps=lessons.filter(l=>hits(l).length<min);console.log('Aulas que precisam de busca:',gaps.length);
 await parallel(gaps,async lesson=>{for(const query of lessonVideoQueries(lesson)){for(const channel of VIDEO_CHANNELS){
  const key=(globalSearch?'results:':'')+channel.id+':'+query;let rows=cache.searches[key]?.rows;
  if(!rows){try{const searchUrl=globalSearch?'https://www.youtube.com/results?search_query='+encodeURIComponent(query+' '+channel.name):'https://www.youtube.com/@'+encodeURIComponent(channel.handle)+'/search?query='+encodeURIComponent(query);const r=await request(searchUrl);if(!r.ok)throw new Error('HTTP '+r.status);const html=await r.text();if(!/ytInitialData\s*=/.test(html))throw new Error('YouTube search markup unavailable');rows=extractChannelVideos(html,channel,lesson.topic,lesson).slice(0,5);cache.searches[key]={checkedAt:new Date().toISOString(),channelId:channel.id,query,source:globalSearch?'youtube_results':'channel_search',rows};}catch(e){issues.push({kind:'search',lessonId:lesson.id,channel:channel.handle,query,error:e.message});continue;}}
  for(const candidate of rows){if(!matchesLessonVideo(candidate.title,lesson))continue;await verify(candidate);}
 }}done++;await save();if(done%5===0)console.log('Aulas pesquisadas:',done+'/'+gaps.length,'; cobertura atual:',lessons.filter(l=>hits(l).length).length+'/'+lessons.length);});
}
const checkedAt=new Date().toISOString(),report=lessons.map(l=>({id:l.id,title:l.title,moduleId:l.moduleId,queries:lessonVideoQueries(l),status:hits(l).length?'verified':issues.some(i=>i.lessonId===l.id)?'inconclusive':'no_match_confirmed',videos:hits(l).map(v=>({...v,coverage:'related'})),searches:Object.entries(cache.searches).filter(([key])=>lessonVideoQueries(l).some(q=>key.endsWith(':'+q))).map(([key,value])=>({channelId:value.channelId??key.split(':')[0],query:value.query??key.slice(key.indexOf(':')+1),source:value.source??'channel_search',checkedAt:value.checkedAt,matches:value.rows.length}))}));
// Preserve archived resource IDs, but do not retain a current-lesson association
// after its title ceased to meet the editorial rule (or is unavailable).
const contexts=new Map(lessons.map(l=>[l.id,l]));
const rows=original.map(v=>({...v,lessonIds:(v.lessonIds??[]).filter(id=>!contexts.has(id)||(pool.has(v.id)&&matchesLessonVideo(pool.get(v.id).title,contexts.get(id))))})),byKey=new Map(rows.map(v=>[v.id+':'+v.topic,v]));
for(const lesson of lessons)for(const video of hits(lesson)){const key=video.id+':'+lesson.topic;let row=byKey.get(key);if(!row){row={...video,topic:lesson.topic,lessonIds:[],curated:true};rows.push(row);byKey.set(key,row);}if(!row.lessonIds.includes(lesson.id))row.lessonIds.push(lesson.id);row.title=video.title;row.verifiedAt=video.verifiedAt;row.lessonIds.sort();}
await fs.writeFile(path.join(out,'coverage.json'),JSON.stringify({checkedAt,source:'public/learning-path.json',modules:curriculum.modules.length,total:lessons.length,covered:report.filter(r=>r.videos.length).length,requests,issues,lessons:report},null,2)+'\n');
await fs.writeFile(path.join(out,'catalog-candidate.json'),JSON.stringify(rows,null,2)+'\n');
await fs.writeFile(path.join(out,'coverage.md'),`# Conferência de videoaulas\n\nVerificado em ${checkedAt}. ${report.filter(r=>r.videos.length).length}/${lessons.length} aulas com ao menos um vídeo relacionado nos canais autorizados. O título indica relação com parte do conteúdo; não equivale a assistir integralmente ao vídeo.\n\n`+report.map(r=>`## ${r.id} — ${r.title}\n\n`+(r.videos.length?r.videos.map(v=>`- [${v.title}](${v.sourceUrl}) · ${v.channelHandle}`).join('\n'):'Sem correspondência confirmada nesta conferência; isso não afirma que não exista vídeo.')+'\n').join('\n'));
await save();console.log(JSON.stringify({output:out,total:lessons.length,covered:report.filter(r=>r.videos.length).length,verifiedVideos:pool.size,requests,issues:issues.length}));
