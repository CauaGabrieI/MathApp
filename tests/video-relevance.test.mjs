import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonVideoQueries, matchesLessonVideo, questionVideoContext, scoreLessonVideo} from '../public/lesson-topics.js';

const lesson=(title,videoTerms=title)=>({id:'math.m99.t01',title,videoTerms});

test('a pontuação aceita o conceito específico e rejeita conceitos vizinhos',()=>{
 const quadratic=lesson('Função quadrática');
 assert.ok(scoreLessonVideo('Função do segundo grau: parábola e raízes',quadratic)>0);
 assert.equal(matchesLessonVideo('Função afim e função do primeiro grau',quadratic),false);
 const affine=lesson('Função afim');
 assert.ok(matchesLessonVideo('Função do primeiro grau | função afim',affine));
 assert.equal(matchesLessonVideo('Função quadrática: revisão',affine),false);
 assert.equal(matchesLessonVideo('Função exponencial: crescimento e decaimento',lesson('Função logarítmica')),false);
 assert.equal(matchesLessonVideo('Juros e taxas equivalentes',lesson('Juros compostos')),false);
 assert.equal(matchesLessonVideo('Soma das raízes de uma equação',lesson('Soma e produto das raízes')),false);
});

test('temas que compartilham palavras não são confundidos',()=>{
 assert.equal(matchesLessonVideo('Média aritmética com exemplos',lesson('Mediana')),false);
 assert.equal(matchesLessonVideo('Mediana e quartis na estatística',lesson('Média')),false);
 assert.equal(matchesLessonVideo('Juros simples: taxa e montante',lesson('Juros compostos')),false);
 assert.equal(matchesLessonVideo('Geometria espacial: sólidos',lesson('Geometria analítica')),false);
 assert.equal(matchesLessonVideo('Aritmética modular e congruências',lesson('Valor absoluto e módulo')),false);
 assert.ok(matchesLessonVideo('Módulo e valor absoluto na reta',lesson('Valor absoluto e módulo')));
});

test('mantém aliases editoriais, rejeita marketing e não aceita aula sem lição',()=>{
 assert.ok(matchesLessonVideo('Porcentagem: cálculo percentual passo a passo',lesson('Cálculo percentual')));
 assert.equal(matchesLessonVideo('Como estudar matemática: maratona para o ENEM',lesson('Cálculo percentual')),false);
 assert.equal(scoreLessonVideo('Função quadrática',null),0);
});

test('as consultas de uma aula são curtas, relevantes e limitadas a duas',()=>{
 const queries=lessonVideoQueries({title:'Razão e proporção (aprofundamento)',videoTerms:'Razão e proporção (quando pertinente)'});
 assert.equal(queries.length,1);
 assert.ok(queries.every(query=>!query.includes('aprofundamento')&&!query.includes('quando pertinente')));
 assert.ok(queries[0].includes('razao e proporcao'));
 const single=lessonVideoQueries({title:'Função exponencial',videoTerms:'Função exponencial'});
 assert.deepEqual(single,['funcao exponencial']);
 const editorial=lessonVideoQueries({title:'Função quadrática',videoTerms:'Função quadrática'});
 assert.deepEqual(editorial,['funcao quadratica','funcao do segundo grau']);
});

test('fallback de questão estatística respeita o enunciado',()=>{
 const curriculum={modules:[{id:'math.m18',sourceNumber:18,title:'Estatística',topics:[]}]};
 assert.match(questionVideoContext({id:'q-mediana',question:'Encontre a mediana dos dados.'},{curriculum}).candidates[0].title,/Mediana/);
 assert.match(questionVideoContext({id:'q-variancia',question:'Calcule a variância e o desvio padrão.'},{curriculum}).candidates[0].title,/Variância/);
 assert.match(questionVideoContext({id:'q-quartil',question:'Interprete o quartil superior no boxplot.'},{curriculum}).candidates[0].title,/Quartis/);
 const unknown=questionVideoContext({id:'q-unknown',question:'Enunciado contextual sem habilidade matemática explícita.'},{curriculum});
 assert.equal(unknown.topic,null);
 assert.deepEqual(unknown.candidates,[]);
});
