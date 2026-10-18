import {matchesLessonVideo,scoreLessonVideo,lessonVideoQueries} from './public/lesson-topics.js';
import {VIDEO_CHANNELS,VIDEO_TOPICS,matchesVideoTopic,normalizeVideoTitle,isVideoLesson} from './public/video-topics.js';
const videoResults=new Map(),videoChecks=new Map();
const YT_HEADERS={'User-Agent':'Mozilla/5.0 (compatible; Equacao/1.0)','Accept-Language':'pt-BR,pt;q=0.9'};
export function extractChannelVideos(html,channel,topic,lesson=null){const match=String(html).match(/(?:var\s+)?ytInitialData\s*=\s*(\{[\s\S]*?\});/);if(!match)return [];let data;try{data=JSON.parse(match[1]);}catch{return [];}const queue=[data],result=[],ids=new Set();let steps=0;while(queue.length&&steps++<50000){const value=queue.pop();if(!value||typeof value!=='object')continue;const renderer=value.videoRenderer;if(renderer&&!renderer.upcomingEventData){const id=renderer.videoId;const title=renderer.title?.runs?.map(r=>r.text).join('')??renderer.title?.simpleText??'';const owners=renderer.ownerText?.runs??renderer.longBylineText?.runs??[];const correctOwner=owners.some(run=>run.navigationEndpoint?.browseEndpoint?.browseId===channel.id);if(/^[\w-]{11}$/.test(id)&&correctOwner&&(lesson?matchesLessonVideo(title,lesson):matchesVideoTopic(title,topic))&&isVideoLesson(title)&&!ids.has(id)){ids.add(id);result.push({id,title,channelHandle:channel.handle,topic});}}for(const child of Object.values(value).reverse())if(child&&typeof child==='object')queue.push(...(Array.isArray(child)?[...child].reverse():[child]));}return result;}
function sameChannel(authorURL,channel){try{const u=new URL(authorURL);if(!['www.youtube.com','youtube.com'].includes(u.hostname)||u.protocol!=='https:')return false;const path=decodeURIComponent(u.pathname).replace(/\/$/,'');return path==='/channel/'+channel.id||path.normalize('NFC').toLowerCase()===('/@'+channel.handle).normalize('NFC').toLowerCase();}catch{return false;}}
export async function verifyYouTubeVideo(candidate,topic,{fetchImpl=fetch,now=Date.now(),useCache=true,lesson=null,contextKey="",timeoutMs=7000}={}){const channel=VIDEO_CHANNELS.find(c=>c.handle===candidate.channelHandle);if(!channel||!/^[\w-]{11}$/.test(candidate.id)||!VIDEO_TOPICS[topic])return null;const key=candidate.id+':'+channel.id+':'+(lesson?.id??topic);const hit=useCache&&videoChecks.get(key);if(hit&&hit.expires>now)return hit.video&&isVideoLesson(hit.video.title)&&(lesson?matchesLessonVideo(hit.video.title,lesson):(matchesVideoTopic(hit.video.title,topic)||candidate.curated&&candidate.topic===topic))?{...hit.video,topic}:null;let video=null;try{const response=await fetchImpl('https://www.youtube.com/oembed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+candidate.id)+'&format=json',{headers:YT_HEADERS,signal:AbortSignal.timeout(timeoutMs)});if(response.ok){const data=await response.json();if(sameChannel(data.author_url,channel)&&isVideoLesson(data.title)&&(lesson?matchesLessonVideo(data.title,lesson):(matchesVideoTopic(data.title,topic)||candidate.curated&&candidate.topic===topic))){video={id:candidate.id,title:data.title,channel:channel.name,channelHandle:channel.handle,url:'https://www.youtube.com/watch?v='+candidate.id,thumbnail:'https://i.ytimg.com/vi/'+candidate.id+'/hqdefault.jpg',topic,verifiedAt:new Date(now).toISOString()};}}}catch{}if(useCache)videoChecks.set(key,{video,expires:now+(video?15*60*1000:60*1000)});return video;}
const bounded=async(items,limit,worker)=>{const out=[];let cursor=0;async function run(){while(true){const i=cursor++;if(i>=items.length)return;try{out[i]=await worker(items[i],i);}catch{out[i]=null;}}}await Promise.all(Array.from({length:Math.min(limit,items.length)},run));return out;};
export async function recommendVideos(topic,channelFilter='all',{fetchImpl=fetch,seedVideos=[],now=Date.now(),useCache=true,lesson=null,contextKey=''}={}){
 if(!VIDEO_TOPICS[topic]||(channelFilter!=='all'&&!VIDEO_CHANNELS.some(c=>c.handle===channelFilter)))return [];
 const cacheKey=topic+':'+channelFilter+':'+(lesson?.id??'')+':'+contextKey,cached=useCache&&videoResults.get(cacheKey);
 if(cached&&cached.expires>now)return cached.videos;
 const deadline=Date.now()+18000, verified=new Map(), attempted=new Set();
 const channels=VIDEO_CHANNELS.filter(c=>channelFilter==='all'||c.handle===channelFilter);
 const queries=lesson?lessonVideoQueries(lesson):[VIDEO_TOPICS[topic].query];
 const jobs=channels.flatMap(channel=>queries.map(query=>({channel,query})));
 const verifyLimit=Math.min(32,Math.max(0,48-jobs.length));
 const check=async candidate=>{if(verified.has(candidate.id)||attempted.has(candidate.id)||attempted.size>=verifyLimit)return null;attempted.add(candidate.id);const remaining=deadline-Date.now();if(remaining<=0)return null;const value=await verifyYouTubeVideo(candidate,topic,{fetchImpl,now,useCache,lesson,timeoutMs:Math.min(3500,remaining)});if(value)verified.set(value.id,value);return value;};
 const targeted=lesson?seedVideos.filter(v=>v.lessonIds?.includes(lesson.id)&&(channelFilter==='all'||v.channelHandle===channelFilter)).slice(0,12):[];
 await bounded(targeted,6,check);
 const discovered=(await bounded(jobs,6,async({channel,query})=>{
   if(Date.now()>=deadline)return [];
   const url='https://www.youtube.com/@'+encodeURIComponent(channel.handle)+'/search?query='+encodeURIComponent(query);
   const response=await fetchImpl(url,{headers:YT_HEADERS,signal:AbortSignal.timeout(Math.min(3500,Math.max(200,deadline-Date.now())))});
   if(!response.ok)return [];
   const html=await response.text();
   if(html.length>4000000)return [];
   return extractChannelVideos(html,channel,topic,lesson).slice(0,6);
 })).flat().filter(Boolean);
 const seeds=seedVideos.filter(v=>v.topic===topic&&!v.lessonIds&&(channelFilter==='all'||v.channelHandle===channelFilter));
 const candidateWords=normalizeVideoTitle((lesson?.title??VIDEO_TOPICS[topic].label)).split(/\s+/).filter(word=>word.length>3);
 const candidates=[...new Map([...discovered,...seeds].map(v=>[v.id,v])).values()]
   .sort((a,b)=>{const score=v=>scoreLessonVideo(v.title,lesson)+candidateWords.filter(word=>normalizeVideoTitle(v.title).includes(word)).length*3;return score(b)-score(a);})
   .slice(0,32);
 await bounded(candidates,6,check);
 const topicWords=normalizeVideoTitle((VIDEO_TOPICS[topic].label+' '+VIDEO_TOPICS[topic].query)).split(/\s+/).filter(word=>word.length>3);
 const relevance=video=>{const text=normalizeVideoTitle(video.title);const semantic=topicWords.filter(word=>text.includes(word)).length*3;const intro=/aula|introdu|conceito|aprenda|defini|fundamento|explica|#0?1\b|curso/i.test(text)?3:0;const marketing=/exerc|desafio|shorts|questao|questoes|olimpi|dicas|vestibular|simulado|motivac|maratona|como estudar/i.test(text)?-4:0;return (lesson?scoreLessonVideo(video.title,lesson):0)+semantic+intro+marketing;};
 const ranked=[...verified.values()].sort((a,b)=>relevance(b)-relevance(a)||a.title.localeCompare(b.title));
 const diverse=ranked.slice(0,12);
 if(useCache)videoResults.set(cacheKey,{videos:diverse,expires:now+(diverse.length?600000:60000)});
 return diverse;
}
