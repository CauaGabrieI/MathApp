import test from 'node:test';
import assert from 'node:assert/strict';
import {VIDEO_MODULE_GROUPS,defaultVideoSelection,isValidVideoSelection,videoCategories,videoLessons,videoModules,videoSelection} from '../public/video-categories.js';

const curriculum={modules:Array.from({length:25},(_,index)=>{const n=String(index+1).padStart(2,'0');return{id:`math.m${n}`,order:index+1,title:`Módulo ${n}`,lessons:[{id:`math.m${n}.t01`,order:1,title:'Introdução'},{id:`math.m${n}.t02`,order:2,title:'Aplicações'}]};})};

test('categorias agrupam os 25 módulos em áreas e preservam a ordem curricular',()=>{
 const categories=videoCategories(curriculum);
 assert.equal(categories.length,VIDEO_MODULE_GROUPS.length);
 assert.deepEqual(categories.flatMap(group=>group.modules).map(module=>module.id).sort(),curriculum.modules.map(module=>module.id).sort());
 assert.deepEqual(videoModules(curriculum).map(module=>module.id).sort(),curriculum.modules.map(module=>module.id).sort());
});

test('seleção de módulo e aula valida IDs e usa a primeira aula como padrão',()=>{
 assert.deepEqual(defaultVideoSelection(curriculum),{moduleId:'math.m01',lessonId:'math.m01.t01'});
 assert.equal(isValidVideoSelection(curriculum,'math.m03','math.m03.t02'),true);
 assert.equal(isValidVideoSelection(curriculum,'math.m03','math.m04.t01'),false);
 assert.deepEqual(videoSelection(curriculum,'math.m03','math.m03.t02'),{moduleId:'math.m03',lessonId:'math.m03.t02'});
 assert.deepEqual(videoSelection(curriculum,'math.m99',''),{moduleId:'math.m01',lessonId:'math.m01.t01'});
 assert.deepEqual(videoLessons(curriculum,'math.m02').map(lesson=>lesson.id),['math.m02.t01','math.m02.t02']);
});

test("novos módulos do currículo continuam acessíveis sem uma categoria editorial",()=>{
 const added={id:"math.m26",title:"Novo módulo",lessons:[{id:"math.m26.t01",title:"Nova aula"}]};
 const categories=videoCategories({modules:[...curriculum.modules,added]});
 assert.equal(categories.at(-1).label,"Outros assuntos");
 assert.deepEqual(categories.at(-1).modules,[added]);
});
