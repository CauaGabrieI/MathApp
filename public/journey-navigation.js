const PAGES=new Set(['mapa','praticar','historico','videos','progresso','prova']);
const stagesOf=roadmap=>Array.isArray(roadmap?.stages)?roadmap.stages:[];
const modulesOf=roadmap=>[...(roadmap?.modules??[]),...(roadmap?.archiveModules??[])];
export function subjectRoute(id){return `mapa/materia/${encodeURIComponent(String(id??''))}`;}
export function subjectForModule(roadmap,moduleId){const stages=stagesOf(roadmap),direct=stages.find(stage=>stage.moduleIds?.includes(moduleId));if(direct)return direct;const module=modulesOf(roadmap).find(item=>item.id===moduleId);if(module?.stageId||module?.subjectId)return stages.find(stage=>stage.id===(module.stageId??module.subjectId))??null;const archive=roadmap?.archiveModules?.some(item=>item.id===moduleId)||module?.archived;if(!archive)return null;return stages.find(stage=>stage.id==='stage.math')??(stages.length===1?stages[0]:null);}
export function subjectForLesson(roadmap,lessonId){const module=modulesOf(roadmap).find(item=>item.lessons?.some(lesson=>lesson.id===lessonId));return module?subjectForModule(roadmap,module.id):null;}
export function parseAppRoute(target,roadmap){
 const raw=String(target??'').replace(/^#/,'').replace(/^\/+|\/+$/g,'');
 if(PAGES.has(raw))return {page:raw,subjectId:null,route:raw,invalid:false};
 const match=raw.match(/^mapa\/materia\/([^/]+)$/);if(match){let id;try{id=decodeURIComponent(match[1]);}catch{return {page:'mapa',subjectId:null,route:'mapa',invalid:true};}if(id&&stagesOf(roadmap).some(stage=>stage.id===id))return {page:'mapa',subjectId:id,route:subjectRoute(id),invalid:false};}
 return {page:'mapa',subjectId:null,route:'mapa',invalid:true};
}
