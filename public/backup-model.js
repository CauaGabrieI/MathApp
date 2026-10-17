// Backups contain IDs, attempts and study state. Question content comes from the app bank.
export const BACKUP_APP='br.com.equacao.app';
export const BACKUP_LIMIT=8*1024*1024;
const topic=id=>typeof id==='string'&&/^(math\.m\d{2}\.t\d{2}|roadmap\.m\d{2}\.l\d{2})$/.test(id);
const moduleId=id=>typeof id==='string'&&/^(math|roadmap)\.m\d{2}$/.test(id);
const stamp=n=>Number.isSafeInteger(n)&&n>0&&n<=Date.now()+86400000;
function invalid(){throw new Error('Backup inválido ou incompatível. Nenhum dado local foi alterado.');}
function questionId(id){return typeof id==='string'&&(/^(enemdev:\d{4}:\d{1,3}|enemhub:[a-zA-Z0-9-]{1,100}|equacao:roadmap\.m\d{2}\.l\d{2}:[1-4])$/.test(id));}
export function validateBackup(value,ownerId){
 if(!value||value.app!==BACKUP_APP||![1,2].includes(value.schemaVersion)||!Number.isSafeInteger(value.ownerId)||value.ownerId<=0||ownerId!==undefined&&value.ownerId!==ownerId)invalid();
 if(new TextEncoder().encode(JSON.stringify(value)).length>BACKUP_LIMIT||!Array.isArray(value.records)||value.records.length>10000||!Array.isArray(value.learningEntries)||value.learningEntries.length>2000)invalid();
 const ids=new Set(),entries=new Set();
 const records=value.records.map(r=>{
  if(!r||typeof r.id!=='string'||r.id.length>200||ids.has(r.id)||!stamp(r.seenAt)||r.completedAt!==null&&(!stamp(r.completedAt)||r.completedAt<r.seenAt))invalid();ids.add(r.id);
  let legacyQuestion;
  if(r.legacyQuestion){const q=r.legacyQuestion;if(!r.id.startsWith('math-question:')||typeof q.question!=='string'||q.question.length>500||!Number.isFinite(q.answer)||!['EASY','MEDIUM','HARD'].includes(q.level)||!Array.isArray(r.choices)||r.choices.length>10||!r.choices.every(Number.isFinite)||!r.choices.includes(q.answer))invalid();legacyQuestion={id:r.id,question:q.question,answer:q.answer,level:q.level,wrong_answers:r.choices.filter(n=>n!==q.answer)};}
  else if(!questionId(r.id))invalid();
  const choices=legacyQuestion?r.choices:['A','B','C','D','E'];if(r.completedAt?!choices.includes(r.selectedAnswer):r.selectedAnswer!==null)invalid();
  let learningContext=null;if(r.learningContext){const c=r.learningContext;if(!moduleId(c.moduleId)||c.topicId!==null&&!topic(c.topicId))invalid();learningContext={moduleId:c.moduleId,topicId:c.topicId};}
  return {id:r.id,seenAt:r.seenAt,completedAt:r.completedAt,selectedAnswer:r.selectedAnswer,learningContext,...(legacyQuestion?{legacyQuestion,choices:[...choices]}:{})};
 });
 const learningEntries=value.learningEntries.map(e=>{if(!e||!topic(e.id)||entries.has(e.id)||typeof e.studied!=='boolean'||!stamp(e.startedAt)||!stamp(e.updatedAt)||e.studiedAt!==null&&!stamp(e.studiedAt))invalid();entries.add(e.id);return{id:e.id,studied:e.studied,startedAt:e.startedAt,studiedAt:e.studiedAt,updatedAt:e.updatedAt};});
 if(value.lastTopicId!==null&&!topic(value.lastTopicId))invalid();
 const exams=value.schemaVersion===1?[]:value.exams??[],cards=value.schemaVersion===1?[]:value.cards??[];
 if(!Array.isArray(exams)||exams.length>2000||!Array.isArray(cards)||cards.length>1000)invalid();
 const examIds=new Set(),cardIds=new Set();
 const cleanExams=exams.map(e=>{if(!e||!/^exam:[a-zA-Z0-9-]{10,80}$/.test(e.id)||examIds.has(e.id)||!/^roadmap\.m\d{2}$/.test(e.moduleId)||!stamp(e.startedAt)||!stamp(e.updatedAt)||e.updatedAt<e.startedAt||e.completedAt!==null&&(!stamp(e.completedAt)||e.completedAt<e.startedAt)||!Array.isArray(e.questionIds)||e.questionIds.length<1||e.questionIds.length>30||new Set(e.questionIds).size!==e.questionIds.length||!e.questionIds.every(id=>questionId(id)&&id.startsWith('equacao:'+e.moduleId+'.l'))||!e.answers||typeof e.answers!=='object'||Array.isArray(e.answers)||!Object.entries(e.answers).every(([id,a])=>e.questionIds.includes(id)&&/^[A-E]$/.test(a))||e.completedAt&&e.questionIds.some(id=>!e.answers[id]))invalid();examIds.add(e.id);return{id:e.id,moduleId:e.moduleId,questionIds:[...e.questionIds],answers:Object.fromEntries(Object.entries(e.answers).sort()),startedAt:e.startedAt,updatedAt:e.updatedAt,completedAt:e.completedAt};});
 const cleanCards=cards.map(c=>{if(!c||!/^roadmap\.m\d{2}\.l\d{2}$/.test(c.id)||cardIds.has(c.id)||!stamp(c.reviewedAt)||typeof c.remembered!=='boolean')invalid();cardIds.add(c.id);return{id:c.id,reviewedAt:c.reviewedAt,remembered:c.remembered};});
 return {app:BACKUP_APP,schemaVersion:2,ownerId:value.ownerId,records:records.sort((a,b)=>a.id.localeCompare(b.id)),learningEntries:learningEntries.sort((a,b)=>a.id.localeCompare(b.id)),lastTopicId:value.lastTopicId,exams:cleanExams.sort((a,b)=>a.id.localeCompare(b.id)),cards:cleanCards.sort((a,b)=>a.id.localeCompare(b.id))};
}
export function makeBackup(state,ownerId){return validateBackup({app:BACKUP_APP,schemaVersion:2,ownerId,records:state.records.map(r=>({id:r.id,seenAt:r.seenAt,completedAt:r.completedAt??null,selectedAnswer:r.selectedAnswer??null,learningContext:r.learningContext??null,...(!r.question.source?{legacyQuestion:r.question,choices:r.choices}:{})})),learningEntries:state.learningEntries,lastTopicId:state.learningLastTopicId??null,exams:state.exams??[],cards:state.cards??[]},ownerId);}
function newestById(a,b,time,completedFirst=false){const result=new Map(a.map(x=>[x.id,x]));for(const x of b){const old=result.get(x.id);if(!old||completedFirst&&x.completedAt&&!old.completedAt||!(completedFirst&&old.completedAt&&!x.completedAt)&&(x[time]>old[time]||x[time]===old[time]&&JSON.stringify(x)>JSON.stringify(old)))result.set(x.id,x);}return [...result.values()];}
function mergeExams(left,right){const result=new Map(left.map(e=>[e.id,e]));for(const e of right){const old=result.get(e.id);if(!old){result.set(e.id,e);continue;}if(old.moduleId!==e.moduleId||old.startedAt!==e.startedAt||JSON.stringify(old.questionIds)!==JSON.stringify(e.questionIds))invalid();if(old.completedAt||e.completedAt){const candidates=[old,e].filter(x=>x.completedAt).sort((a,b)=>a.completedAt-b.completedAt||JSON.stringify(a).localeCompare(JSON.stringify(b)));result.set(e.id,candidates[0]);}else{const latest=old.updatedAt>e.updatedAt?old:old.updatedAt<e.updatedAt?e:JSON.stringify(old)>JSON.stringify(e)?old:e;const earlier=latest===old?e:old;result.set(e.id,{...latest,answers:{...earlier.answers,...latest.answers},updatedAt:Math.max(old.updatedAt,e.updatedAt)});}}return [...result.values()];}
export function mergeBackups(left,right){
 const a=validateBackup(left),b=validateBackup(right,a.ownerId),records=new Map(a.records.map(r=>[r.id,r]));
 for(const r of b.records){const old=records.get(r.id);if(!old){records.set(r.id,r);continue;}const order=x=>x.completedAt??Number.MAX_SAFE_INTEGER;const best=order(old)<order(r)?old:order(r)<order(old)?r:JSON.stringify(old)<JSON.stringify(r)?old:r;records.set(r.id,{...best,seenAt:Math.min(old.seenAt,r.seenAt)});}
 const learningEntries=newestById(a.learningEntries,b.learningEntries,'updatedAt');
 const last=[...learningEntries].sort((x,y)=>y.updatedAt-x.updatedAt||x.id.localeCompare(y.id))[0]?.id??a.lastTopicId??b.lastTopicId;
 return validateBackup({...a,records:[...records.values()],learningEntries,lastTopicId:last,exams:mergeExams(a.exams,b.exams),cards:newestById(a.cards,b.cards,'reviewedAt')});
}
export function hydrateRecords(backup,bank){const byId=new Map(bank.map(q=>[q.id,q]));for(const e of backup.exams??[])if(e.questionIds.some(id=>!byId.has(id)))throw new Error('Atualize o app para restaurar as provas deste backup.');return backup.records.map(r=>{const q=byId.get(r.id)??r.legacyQuestion;if(!q)throw new Error('O backup contém questões de outra versão. Atualize o app antes de restaurar.');return{id:r.id,question:q,seenAt:r.seenAt,completedAt:r.completedAt,selectedAnswer:r.selectedAnswer,choices:q.alternatives?q.alternatives.map(a=>a.letter):r.choices,selectionMode:'content',learningContext:r.learningContext};});}
