import {alternativeContentKey,plainText} from './core.js?v=math26';

// Refresh presentation only when the saved answer identities still match.
// Completed attempts retain their timestamps, source letters and grading.
export function refreshQuestionContent(saved,current){
 if(!saved||!current||saved.id!==current.id||saved.answer!==current.answer)return saved;
 const old=saved.alternatives??[],next=current.alternatives??[];
 if(old.length!==next.length||!old.length)return saved;
 const matches=old.every(a=>{
  const b=next.find(b=>b.letter===a.letter);
  return b&&alternativeContentKey(a.text??'')===alternativeContentKey(b.text??'')&&(alternativeContentKey(a.text??'')||a.file===b.file);
 });
 if(!matches)return saved;
 const length=q=>plainText((q.statement??'')+' '+(q.introduction??'')).length;
 const preferred=length(current)>=length(saved)?current:saved;
 return {...saved,statement:preferred.statement,introduction:preferred.introduction,format:preferred.format,
  question:preferred.question,dedupeKey:preferred.dedupeKey,contentSource:preferred.contentSource,
  files:[...new Set([...(preferred.files??[]),...(saved.files??[]),...(current.files??[])])],
  alternatives:old.map(a=>({...a,...(preferred===current?{text:next.find(b=>b.letter===a.letter).text}:{}),file:next.find(b=>b.letter===a.letter)?.file||a.file||null})),
 };
}
