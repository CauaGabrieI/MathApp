// Backups contain IDs and attempts. Question content is resolved from the trusted app bank.
export const BACKUP_APP='br.com.equacao.app';
export const BACKUP_LIMIT=8*1024*1024;
const topic=id=>typeof id==='string'&&/^math\.m\d{2}\.t\d{2}$/.test(id);
const stamp=n=>Number.isSafeInteger(n)&&n>0&&n<=Date.now()+86400000;
function invalid(){throw new Error('Backup inválido ou incompatível. Nenhum dado local foi alterado.');}
export function validateBackup(value,ownerId){
  if(!value||value.app!==BACKUP_APP||value.schemaVersion!==1||!Number.isSafeInteger(value.ownerId)||value.ownerId<=0||ownerId!==undefined&&value.ownerId!==ownerId)invalid();
  if(new TextEncoder().encode(JSON.stringify(value)).length>BACKUP_LIMIT||!Array.isArray(value.records)||value.records.length>10000||!Array.isArray(value.learningEntries)||value.learningEntries.length>1000)invalid();
  const ids=new Set(),entries=new Set();
  const records=value.records.map(r=>{
    if(!r||typeof r.id!=='string'||r.id.length>200||ids.has(r.id)||!stamp(r.seenAt)||r.completedAt!==null&&(!stamp(r.completedAt)||r.completedAt<r.seenAt))invalid();ids.add(r.id);
    let legacyQuestion;
    if(r.legacyQuestion){const q=r.legacyQuestion;if(!r.id.startsWith('math-question:')||typeof q.question!=='string'||q.question.length>500||!Number.isFinite(q.answer)||!['EASY','MEDIUM','HARD'].includes(q.level)||!Array.isArray(r.choices)||r.choices.length>10||!r.choices.every(Number.isFinite)||!r.choices.includes(q.answer))invalid();legacyQuestion={id:r.id,question:q.question,answer:q.answer,level:q.level,wrong_answers:r.choices.filter(n=>n!==q.answer)};}
    else if(!/^enemdev:\d{4}:\d{1,3}$/.test(r.id)&&!/^enemhub:[a-zA-Z0-9-]{1,100}$/.test(r.id))invalid();
    const choices=legacyQuestion?r.choices:['A','B','C','D','E'];if(r.completedAt?!choices.includes(r.selectedAnswer):r.selectedAnswer!==null)invalid();
    let learningContext=null;if(r.learningContext){const c=r.learningContext;if(!/^math\.m\d{2}$/.test(c.moduleId)||c.topicId!==null&&!topic(c.topicId))invalid();learningContext={moduleId:c.moduleId,topicId:c.topicId};}
    return {id:r.id,seenAt:r.seenAt,completedAt:r.completedAt,selectedAnswer:r.selectedAnswer,learningContext,...(legacyQuestion?{legacyQuestion,choices:[...choices]}:{})};
  });
  const learningEntries=value.learningEntries.map(e=>{if(!e||!topic(e.id)||entries.has(e.id)||typeof e.studied!=='boolean'||!stamp(e.startedAt)||!stamp(e.updatedAt)||e.studiedAt!==null&&!stamp(e.studiedAt))invalid();entries.add(e.id);return{id:e.id,studied:e.studied,startedAt:e.startedAt,studiedAt:e.studiedAt,updatedAt:e.updatedAt};});
  if(value.lastTopicId!==null&&!topic(value.lastTopicId))invalid();
  return {app:BACKUP_APP,schemaVersion:1,ownerId:value.ownerId,records:records.sort((a,b)=>a.id.localeCompare(b.id)),learningEntries:learningEntries.sort((a,b)=>a.id.localeCompare(b.id)),lastTopicId:value.lastTopicId};
}
export function makeBackup(state,ownerId){return validateBackup({app:BACKUP_APP,schemaVersion:1,ownerId,records:state.records.map(r=>({id:r.id,seenAt:r.seenAt,completedAt:r.completedAt??null,selectedAnswer:r.selectedAnswer??null,learningContext:r.learningContext??null,...(!r.question.source?{legacyQuestion:r.question,choices:r.choices}:{})})),learningEntries:state.learningEntries,lastTopicId:state.learningLastTopicId??null},ownerId);}
export function mergeBackups(left,right){
  const a=validateBackup(left),b=validateBackup(right,a.ownerId),records=new Map(a.records.map(r=>[r.id,r]));
  for(const r of b.records){const old=records.get(r.id);if(!old){records.set(r.id,r);continue;}const order=x=>x.completedAt??Number.MAX_SAFE_INTEGER;const best=order(old)<order(r)?old:order(r)<order(old)?r:JSON.stringify(old)<JSON.stringify(r)?old:r;records.set(r.id,{...best,seenAt:Math.min(old.seenAt,r.seenAt)});}
  const entries=new Map(a.learningEntries.map(e=>[e.id,e]));for(const e of b.learningEntries){const old=entries.get(e.id);if(!old||e.updatedAt>old.updatedAt||e.updatedAt===old.updatedAt&&JSON.stringify(e)>JSON.stringify(old))entries.set(e.id,e);}
  const last= [...entries.values()].sort((x,y)=>y.updatedAt-x.updatedAt||x.id.localeCompare(y.id))[0]?.id??a.lastTopicId??b.lastTopicId;
  return validateBackup({...a,records:[...records.values()],learningEntries:[...entries.values()],lastTopicId:last});
}
export function hydrateRecords(backup,bank){const byId=new Map(bank.map(q=>[q.id,q]));return backup.records.map(r=>{const q=byId.get(r.id)??r.legacyQuestion;if(!q)throw new Error('O backup contém questões de outra versão. Atualize o app antes de restaurar.');return{id:r.id,question:q,seenAt:r.seenAt,completedAt:r.completedAt,selectedAnswer:r.selectedAnswer,choices:q.alternatives?q.alternatives.map(a=>a.letter):r.choices,selectionMode:'content',learningContext:r.learningContext};});}
