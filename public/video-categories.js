export const VIDEO_MODULE_GROUPS=[
 {id:'numeric-base',label:'Base numérica',moduleIds:['math.m01','math.m04','math.m05']},
 {id:'proportional-finance',label:'Proporcionalidade e finanças',moduleIds:['math.m02','math.m03','math.m21']},
 {id:'algebra-functions',label:'Álgebra e funções',moduleIds:['math.m06','math.m07','math.m08','math.m09','math.m10','math.m11','math.m12','math.m22']},
 {id:'geometry-trigonometry',label:'Geometria e trigonometria',moduleIds:['math.m13','math.m14','math.m15','math.m16','math.m17']},
 {id:'statistics-probability',label:'Estatística e probabilidade',moduleIds:['math.m18','math.m19','math.m20','math.m23']},
 {id:'applications-complements',label:'Aplicações e complementos',moduleIds:['math.m24','math.m25']},
];

const modulesOf=curriculum=>Array.isArray(curriculum?.modules)?curriculum.modules:[];
export function videoCategories(curriculum){
 const byId=new Map(modulesOf(curriculum).map(module=>[module.id,module]));
 const groups=VIDEO_MODULE_GROUPS.map(group=>({...group,modules:group.moduleIds.map(id=>byId.get(id)).filter(Boolean)})).filter(group=>group.modules.length);
 const grouped=new Set(groups.flatMap(group=>group.modules.map(module=>module.id)));
 const remaining=modulesOf(curriculum).filter(module=>!grouped.has(module.id));
 return remaining.length?[...groups,{id:'other-subjects',label:'Outros assuntos',moduleIds:remaining.map(module=>module.id),modules:remaining}]:groups;
}
export function videoModules(curriculum){return videoCategories(curriculum).flatMap(group=>group.modules);}
export function videoLessons(curriculum,moduleId){return [...(videoModules(curriculum).find(module=>module.id===moduleId)?.lessons??[])].sort((a,b)=>(a.displayOrder??a.order)-(b.displayOrder??b.order));}
export function isValidVideoSelection(curriculum,moduleId,lessonId=''){
 const module=videoModules(curriculum).find(item=>item.id===moduleId);
 return Boolean(module&&(!lessonId||module.lessons?.some(lesson=>lesson.id===lessonId)));
}
export function defaultVideoSelection(curriculum){
 const module=videoModules(curriculum)[0],lesson=module?.lessons?.[0];
 return {moduleId:module?.id??'',lessonId:lesson?.id??''};
}
export function videoSelection(curriculum,moduleId,lessonId=''){
 if(isValidVideoSelection(curriculum,moduleId,lessonId))return {moduleId,lessonId};
 return defaultVideoSelection(curriculum);
}
