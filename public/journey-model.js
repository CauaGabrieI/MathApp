export function validateRoadmap(roadmap) {
  if (![1,2].includes(roadmap?.schemaVersion)||!Array.isArray(roadmap.modules)||!roadmap.modules.length) throw new Error('Roadmap inválido');
  const canonical=roadmap.schemaVersion===2,ids=new Set(),moduleIds=new Set(roadmap.modules.map(m=>m.id));
  for(const m of roadmap.modules){
    if(!(canonical?/^math\.m\d{2}$/:/^roadmap\.m\d{2}$/).test(m.id)||ids.has(m.id)||!m.lessons?.length||!m.description)throw new Error('Módulo inválido');
    ids.add(m.id);
    if(canonical&&(!Array.isArray(m.prerequisiteIds)||m.prerequisiteIds.some(id=>!moduleIds.has(id))))throw new Error('Pré-requisito inválido');
    for(const l of m.lessons){
      if(!(canonical?/^math\.m\d{2}\.t\d{2}$/:/^roadmap\.m\d{2}\.l\d{2}$/).test(l.id)||!l.id.startsWith(m.id+'.')||ids.has(l.id)||!l.title||!Array.isArray(l.questionIds))throw new Error('Aula inválida');
      if(canonical){if(!Array.isArray(l.resources)||!Array.isArray(l.legacyIds)||l.resources.some(r=>!r.id||!r.explanation||!r.rule||!Array.isArray(r.questionIds)))throw new Error('Recurso inválido');}
      else if(!l.explanation||!l.rule||!l.card?.question||!l.card?.answer||l.questionIds.length<2)throw new Error('Aula inválida');
      ids.add(l.id);
    }
  }
  if(canonical){
    if(!Array.isArray(roadmap.stages)||!roadmap.stages.length)throw new Error('Etapas inválidas');
    const covered=new Set();
    for(const stage of roadmap.stages){
      if(!stage.id||ids.has(stage.id)||!stage.title||!Array.isArray(stage.moduleIds)||!stage.moduleIds.length)throw new Error('Etapa inválida');
      ids.add(stage.id);
      for(const id of stage.moduleIds){if(!moduleIds.has(id)||covered.has(id))throw new Error('Módulo duplicado ou ausente na etapa');if(stage.level&&roadmap.modules.find(m=>m.id===id).level!==stage.level)throw new Error('Nível incompatível com a etapa');covered.add(id);}
    }
    if(covered.size!==moduleIds.size)throw new Error('Módulo sem etapa');
    const byId=new Map(roadmap.modules.map(m=>[m.id,m])),active=new Set(),visited=new Set();
    const visit=id=>{if(active.has(id))throw new Error('Ciclo de pré-requisitos');if(visited.has(id))return;active.add(id);for(const prerequisite of byId.get(id).prerequisiteIds)visit(prerequisite);active.delete(id);visited.add(id);};
    for(const id of moduleIds)visit(id);
    if(roadmap.archiveModules){const archivedIds=new Set(roadmap.archiveModules.flatMap(m=>m.lessons.map(l=>l.id)));for(const m of roadmap.modules)for(const l of m.lessons)if(l.resources.some(r=>!archivedIds.has(r.id))||l.legacyIds.some(id=>!archivedIds.has(id)))throw new Error('Recurso ou equivalência inexistente');}
  }
  return true;
}

export function lessonState(entry){return entry?.studied===true?'completed':Number.isFinite(entry?.startedAt)&&entry.startedAt>0?'in_progress':'not_started';}
const progressState=(completed,total,started)=>completed===total?'completed':started?'in_progress':'not_started';
export function journeyProgress(roadmap,entries=[],exams=[]){
  const byId=new Map(entries.map(e=>[e.id,e]));
  const modules=roadmap.modules.map(m=>{
    const lessonStates=Object.fromEntries(m.lessons.map(l=>[l.id,lessonState(byId.get(l.id))]));
    const completed=Object.values(lessonStates).filter(state=>state==='completed').length;
    const started=Object.values(lessonStates).filter(state=>state!=='not_started').length,total=m.lessons.length;
    return {...m,lessonStates,completed,total,started,learned:completed===total,percent:total?completed/total*100:0,state:progressState(completed,total,started),
      latestExam:exams.filter(e=>e.moduleId===m.id&&e.completedAt).sort((a,b)=>b.completedAt-a.completedAt)[0]??null};
  });
  const stages=(roadmap.stages??[]).map(stage=>{
    const included=modules.filter(m=>stage.moduleIds.includes(m.id));
    const completed=included.reduce((s,m)=>s+m.completed,0),total=included.reduce((s,m)=>s+m.total,0),started=included.reduce((s,m)=>s+m.started,0);
    return {...stage,completed,total,started,learned:completed===total,percent:total?completed/total*100:0,state:progressState(completed,total,started),completedModules:included.filter(m=>m.learned).length,totalModules:included.length};
  });
  const completed=modules.reduce((s,m)=>s+m.completed,0),total=modules.reduce((s,m)=>s+m.total,0),started=modules.reduce((s,m)=>s+m.started,0);
  return {modules,stages,learnedIds:modules.filter(m=>m.learned).map(m=>m.id),completed,total,started,percent:total?completed/total*100:0,state:progressState(completed,total,started)};
}

export function learnedQuestions(roadmap,entries,bank,index){
  const progress=journeyProgress(roadmap,entries),learned=new Set(progress.learnedIds);
  if(roadmap.schemaVersion!==2)return bank.filter(q=>{const required=q.source==='equacao'?[q.learning?.moduleId]:index.requiredModules[q.id];return required?.length&&required.every(id=>learned.has(id));});
  const contexts=new Map();
  for(const module of progress.modules.filter(m=>m.learned))for(const lesson of module.lessons)for(const id of lesson.questionIds){
    if(!contexts.has(id))contexts.set(id,[]);
    contexts.get(id).push({moduleId:module.id,lessonId:lesson.id});
  }
  return bank.filter(q=>{
    if(q.source==='equacao')return contexts.has(q.id);
    const required=index.requiredModules[q.id];
    return required?.length&&required.every(id=>learned.has(id));
  }).map((q,i)=>{
    const candidates=contexts.get(q.id)??(index.requiredModules[q.id]??[]).filter(id=>learned.has(id)).map(id=>({moduleId:id,lessonId:null}));
    // Shared support questions retain their source ID but receive the context of
    // one actually learned canonical module, so mixed practice can alternate.
    const context=candidates[i%candidates.length];
    return {...q,learning:{...q.learning,...context}};
  });
}
export function learnedCards(roadmap,entries){return journeyProgress(roadmap,entries).modules.filter(m=>m.learned).flatMap(m=>m.lessons.filter(l=>l.card?.question&&l.card?.answer).map(l=>({...l.card,id:l.id,moduleId:m.id,moduleTitle:m.title,lessonTitle:l.title})));}
export function nextLesson(roadmap,entries,lastId){const byId=new Map(entries.map(e=>[e.id,e]));const all=roadmap.modules.flatMap(m=>m.lessons.map(l=>({...l,moduleId:m.id,moduleTitle:m.title})));return all.find(l=>l.id===lastId&&!byId.get(l.id)?.studied)||all.find(l=>!byId.get(l.id)?.studied)||all[0];}
export function examSelection(module,bank,records=[],random=Math.random){
  const allowed=new Set(module.lessons.flatMap(l=>l.questionIds)),seen=new Set(records.map(r=>r.id)),pool=bank.filter(q=>allowed.has(q.id));
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const count=Math.min(10,Math.max(5,module.lessons.length),pool.length),ordered=shuffle(module.lessons),chosen=[];
  for(const lesson of ordered){
    const lessonIds=new Set(lesson.questionIds),options=shuffle(pool.filter(q=>lessonIds.has(q.id)&&!chosen.some(p=>p.id===q.id))).sort((a,b)=>Number(seen.has(a.id))-Number(seen.has(b.id)));
    if(options[0])chosen.push(options[0]);if(chosen.length===count)break;
  }
  if(chosen.length<count)chosen.push(...shuffle(pool.filter(q=>!chosen.some(p=>p.id===q.id))).sort((a,b)=>Number(seen.has(a.id))-Number(seen.has(b.id))).slice(0,count-chosen.length));
  return chosen.map(q=>q.id);
}
export function examResult(exam,bank){const byId=new Map(bank.map(q=>[q.id,q]));let correct=0,answered=0;for(const id of exam.questionIds){if(exam.answers[id]){answered++;if(exam.answers[id]===byId.get(id)?.answer)correct++;}}return{correct,answered,total:exam.questionIds.length,percent:exam.questionIds.length?Math.round(correct/exam.questionIds.length*100):0};}
export function roadmapIndex(roadmap,legacyIndex){const map={1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:3,9:3,10:3,11:3,12:7,13:4,14:4,15:5,16:6,17:10,18:9,19:8,20:8,21:1,22:3,23:9,25:11};const requiredModules={};for(const [id,tags]of Object.entries(legacyIndex.questionTags)){const required=[...new Set(tags.moduleIds.map(x=>map[Number(x.split('m').pop())]).filter(Boolean))].map(n=>'roadmap.m'+String(n).padStart(2,'0'));if(required.length)requiredModules[id]=required;}return{schemaVersion:1,method:'conservative_legacy_module_mapping',requiredModules,description:'Questões ENEM entram apenas quando todos os módulos associados foram concluídos. A associação temática é automática e pode exigir revisão pedagógica.'};}
