import test from 'node:test';
import assert from 'node:assert/strict';
import {renderLessonTheory} from '../public/lesson-theory.js';

const lesson = {
  id: 'math.m01.t01',
  reviewStatus: 'editorial_review_pending_human',
  objective: 'Ler números naturais e reconhecer o valor posicional.',
  prerequisiteIds: ['math.m01.t00'],
  diagnostic: {question: 'Quanto vale o 4 em 4 205?', answer: '4 000.', explanation: 'Ele está na ordem dos milhares.'},
  introduction: 'A base dez agrupa dez unidades em uma dezena.',
  concepts: [{title: 'Valor posicional', text: 'A casa define o valor do algarismo.'}],
  procedureSteps: [{step: 'Separe as ordens.', why: 'Cada casa vale dez vezes a anterior.'}],
  examples: [{title: 'Exemplo direto', statement: 'Qual o valor do 6 em 6 030?', solutionSteps: ['O 6 está nos milhares.', '6 × 1 000 = 6 000.'], answer: '6 000'}],
  mistakes: [{misconception: 'Confundir algarismo e valor.', correction: 'O algarismo 6 pode valer 6 000.'}],
  summary: ['A posição determina o valor.'],
  checks: [{question: 'Como decompor 205?', answer: '200 + 5.'}],
  connections: [{lessonId: 'math.m01.t04', reason: 'A lógica continua nos decimais.'}],
  references: [
    {title: 'Referência segura', url: 'https://example.com/math'},
    {title: '<script>alert(1)</script>', url: 'javascript:alert(1)'},
  ],
};

test('renderiza o schema estruturado com HTML semântico e resposta recolhida', () => {
  const html = renderLessonTheory(lesson, {lessonById: {'math.m01.t04': {id: 'math.m01.t04', title: 'Decimais'}}});
  assert.match(html, /class="lesson-guide"/);
  assert.match(html, /<h3 id="lesson-theory-title">Entenda a ideia<\/h3>/);
  assert.match(html, /Objetivo:/);
  assert.match(html, /<dl>/);
  assert.match(html, /data-journey-lesson="math\.m01\.t04"/);
  assert.match(html, /A lógica continua nos decimais/);
  assert.match(html, /<details class="lesson-example lesson-diagnostic">/);
  assert.match(html, /<details class="lesson-example">/);
  assert.match(html, /<details class="lesson-example lesson-check">/);
  assert.match(html, /Resposta:<\/strong> 6 000/);
  assert.match(html, /REVISÃO EDITORIAL PENDENTE/);
  assert.doesNotMatch(html, /data-lesson-answer|data-lesson-submit|<input|<form/);
});

test('escapa texto e só cria links externos http(s)', () => {
  const html = renderLessonTheory(lesson);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /Referência segura/);
  assert.doesNotMatch(html, /href="javascript:/i);
});

test('aceita mapa, função e lista para resolver títulos de links internos', () => {
  const mapHTML = renderLessonTheory(lesson, {lessonById: new Map([['math.m01.t00', {title: 'Base'}]])});
  assert.match(mapHTML, />Base<\/button>/);
  const fnHTML = renderLessonTheory(lesson, {lessonById: id => ({id, title: 'Aula encontrada'})});
  assert.match(fnHTML, />Aula encontrada<\/button>/);
  const listHTML = renderLessonTheory(lesson, {lessonById: [{id: 'math.m01.t00', title: 'Aula da lista'}]});
  assert.match(listHTML, />Aula da lista<\/button>/);
});

test('degrada de forma segura quando a aula é nula ou não tem teoria', () => {
  assert.match(renderLessonTheory(null), /Teoria indisponível/);
  assert.match(renderLessonTheory({id: 'math.m01.t99', reviewStatus: 'draft'}), /Conteúdo de teoria ainda não cadastrado/);
  assert.match(renderLessonTheory({id: 'math.m01.t99', reviewStatus: 'draft'}), /REVISÃO EDITORIAL PENDENTE/);
});
