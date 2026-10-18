import test from 'node:test';
import assert from 'node:assert/strict';
import {isVideoLesson,matchesVideoTopic} from '../public/video-topics.js';
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

test('não trata dicas genéricas de matemática como aula de vídeo',()=>{
 assert.equal(isVideoLesson('Como melhorar em matemática'),false);
 assert.equal(isVideoLesson('Revisar matemática para a prova'),false);
 assert.equal(isVideoLesson('Dicas para estudar matemática básica'),false);
 assert.equal(isVideoLesson('Revisão de operações básicas com inteiros'),true);
 assert.equal(matchesVideoTopic('Como melhorar matemática básica','basics'),false);
});

test('operações fundamentais não aceitam conteúdo avançado ou de frações',()=>{
 const operations={id:'math.m01.t05',title:'Adição, subtração, multiplicação e divisão',videoTerms:'Adição, subtração, multiplicação e divisão'};
 assert.ok(scoreLessonVideo('Operações básicas com inteiros e decimais: adição, subtração, multiplicação e divisão',operations)>0);
 assert.equal(scoreLessonVideo('Operações com frações e radicais',operations),0);
 assert.equal(scoreLessonVideo('Monômios: adição e multiplicação algébrica',operations),0);
 const naturals={id:'math.m01.t01',title:'Naturais e sistema decimal',videoTerms:'Naturais e sistema decimal'};
 assert.ok(scoreLessonVideo('Números naturais e sistema decimal: aula completa',naturals)>0);
 assert.ok(scoreLessonVideo('Conjuntos numéricos: números naturais e inteiros',naturals)>0);
 assert.ok(scoreLessonVideo('Decomposição de números naturais: classes e ordens',naturals)>0);
 assert.equal(scoreLessonVideo('Multiplicação de números naturais',naturals),0);
 assert.equal(scoreLessonVideo('Radicais e raízes quadradas',naturals),0);
});

test('MMC e MDC fica restrito ao conceito de múltiplo/divisor comum',()=>{
 const lesson={id:'math.m01.t10',title:'MMC e MDC',videoTerms:'MMC e MDC'};
 assert.ok(scoreLessonVideo('Mínimo múltiplo comum e máximo divisor comum passo a passo',lesson)>0);
 assert.equal(scoreLessonVideo('Frações algébricas com radicais',lesson),0);
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
 const maxMin=lessonVideoQueries({id:'math.m10.t03',title:'Máximos e mínimos',videoTerms:'Máximos e mínimos',moduleTitle:'Função quadrática'});
 assert.ok(maxMin.some(query=>query.includes('maximos e minimos')&&query.includes('funcao quadratica')));
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

test('categorias de operações e máximos preservam o contexto do módulo',()=>{
 const operations={id:'math.m01.t05',title:'Adição, subtração, multiplicação e divisão'};
 assert.ok(scoreLessonVideo('Cálculo mental: adição e subtração com números inteiros',operations)>0);
 const maximum={id:'math.m10.t03',title:'Máximos e mínimos',moduleTitle:'Função quadrática'};
 assert.ok(matchesLessonVideo('Máximo e mínimo da função do segundo grau',maximum));
 assert.equal(matchesLessonVideo('Máximos e mínimos com derivadas - Cálculo 1',maximum),false);
 assert.equal(isVideoLesson('COMO REVISAR MATEMÁTICA BÁSICA | Exatas Exatas'),false);
 assert.equal(isVideoLesson('Como melhorar sua matemática básica em 5 passos'),false);
 assert.equal(isVideoLesson('Revisão de potências e radicais - Aula 1'),true);
});
