#!/usr/bin/env node
/*
 * Gera um pacote estático para revisão humana do candidato pedagógico.
 * O pacote é separado do build e não escreve public/.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {renderLessonTheory, escapeHTML} from '../public/lesson-theory.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_RELATIVE = 'content/review/module01.mjs';
const SOURCE_PATH = path.join(ROOT, SOURCE_RELATIVE);
const outputArgument = process.argv[2];
const OUTPUT_PATH = outputArgument
  ? path.resolve(process.cwd(), outputArgument)
  : path.join(ROOT, 'outputs', 'review-pedagogy');

const text = value => value == null ? '' : String(value);
const list = value => Array.isArray(value) ? value : [];
const statusLabel = status => status === 'approved' ? 'Aprovado' : text(status || 'pending_human');
const fragmentId = id => 'lesson-' + (text(id).replace(/[^a-z0-9_-]+/giu, '-') || 'unknown');
const exerciseFragmentId = id => 'exercise-' + (text(id).replace(/[^a-z0-9_-]+/giu, '-') || 'unknown');

function titleForLesson(lesson, index) {
  return text(lesson.title).trim() || 'Aula ' + String(index + 1).padStart(2, '0') + ' — ' + text(lesson.id);
}

function renderStatus(status) {
  return '<span class="status status-pending"><strong>Status editorial:</strong> ' + escapeHTML(statusLabel(status)) + '</span>';
}

function renderPrerequisiteIds(ids) {
  const rows = list(ids).filter(id => text(id).trim());
  if (!rows.length) return '<span class="muted">Nenhum pré-requisito declarado.</span>';
  return rows.map(id => '<code>' + escapeHTML(id) + '</code>').join(', ');
}

function renderExercise(exercise, lesson, index) {
  const id = text(exercise.id).trim() || lesson.id + ':exercise:' + (index + 1);
  const anchor = exerciseFragmentId(id);
  const choices = list(exercise.choices).filter(choice => text(choice).trim());
  const solutionSteps = list(exercise.solutionSteps).filter(step => text(step).trim());
  const feedback = exercise.distractorFeedback && typeof exercise.distractorFeedback === 'object'
    ? exercise.distractorFeedback : {};
  const distractors = choices.filter(choice => text(choice) !== text(exercise.correctAnswer));
  const metadata = [
    ['ID', '<code>' + escapeHTML(id) + '</code>'],
    ['Nível', escapeHTML(exercise.level || 'não informado')],
    ['Tipo', escapeHTML(exercise.kind || 'não informado')],
    ['Pré-requisitos', renderPrerequisiteIds(exercise.prerequisiteIds)],
  ];
  if (list(exercise.skillIds).length) {
    metadata.push(['Habilidades', list(exercise.skillIds).map(skill => '<code>' + escapeHTML(skill) + '</code>').join(', ')]);
  }
  const choiceHTML = choices.length
    ? '<ol class="choices" type="A" aria-label="Alternativas">' + choices.map(choice =>
      '<li' + (text(choice) === text(exercise.correctAnswer) ? ' class="choice-correct"' : '') + '>' + escapeHTML(choice) + '</li>').join('') + '</ol>'
    : '<p class="muted">Alternativas ainda não cadastradas.</p>';
  const solutionHTML = solutionSteps.length
    ? '<ol>' + solutionSteps.map(step => '<li>' + escapeHTML(step) + '</li>').join('') + '</ol>'
    : '<p class="muted">Passos de solução ainda não cadastrados.</p>';
  const distractorHTML = distractors.length
    ? '<ul>' + distractors.map(choice => '<li><strong>' + escapeHTML(choice) + '</strong><span> — ' + escapeHTML(feedback[choice] || 'Feedback do distrator ainda não cadastrado.') + '</span></li>').join('') + '</ul>'
    : '<p class="muted">Não há distratores cadastrados.</p>';
  return '<article class="exercise-card" id="' + escapeHTML(anchor) + '" aria-labelledby="' + escapeHTML(anchor) + '-title">' +
    '<header class="exercise-header"><p class="eyebrow">Questão ' + (index + 1) + '</p><h4 id="' + escapeHTML(anchor) + '-title">' + escapeHTML(id) + '</h4>' +
    renderStatus(exercise.reviewStatus || lesson.reviewStatus) + '</header>' +
    '<dl class="metadata">' + metadata.map(row => '<div><dt>' + escapeHTML(row[0]) + '</dt><dd>' + row[1] + '</dd></div>').join('') + '</dl>' +
    '<section class="exercise-statement" aria-labelledby="' + escapeHTML(anchor) + '-statement"><h5 id="' + escapeHTML(anchor) + '-statement">Enunciado</h5>' +
    '<p>' + escapeHTML(exercise.statement || 'Enunciado ainda não cadastrado.') + '</p>' + choiceHTML + '</section>' +
    '<section class="solution" aria-labelledby="' + escapeHTML(anchor) + '-solution"><h5 id="' + escapeHTML(anchor) + '-solution">Solução registrada e gabarito</h5>' +
    solutionHTML + '<p><strong>Gabarito:</strong> ' + escapeHTML(exercise.correctAnswer || 'Ainda não cadastrado.') + '</p></section>' +
    '<section class="distractors" aria-labelledby="' + escapeHTML(anchor) + '-distractors"><h5 id="' + escapeHTML(anchor) + '-distractors">Distratores e feedback</h5>' +
    distractorHTML + '</section></article>';
}

function convertInternalButtons(html, lessonMap) {
  const escapedIdToFragment = new Map(
    Array.from(lessonMap.values()).map(lesson => [escapeHTML(lesson.id), fragmentId(lesson.id)]),
  );
  return html.replace(/<button type="button" class="text-button" data-journey-lesson="([^"]+)">([\s\S]*?)<\/button>/gu, (match, escapedId, inner) => {
    const target = escapedIdToFragment.get(escapedId);
    return target ? '<a class="text-button" href="#' + escapeHTML(target) + '">' + inner + '</a>' : match;
  });
}

function renderLesson(lesson, index, lessonMap) {
  const id = text(lesson.id).trim() || 'lesson-' + (index + 1);
  const anchor = fragmentId(id);
  const theory = convertInternalButtons(renderLessonTheory(lesson, {lessonById: lessonMap}), lessonMap)
    .replace(/\b(id|aria-labelledby)="(lesson-[^"]+)"/gu, (_, attribute, value) => `${attribute}="${escapeHTML(anchor)}-${value}"`);
  const exercises = list(lesson.exercises);
  return '<article class="lesson-card" id="' + escapeHTML(anchor) + '" aria-labelledby="' + escapeHTML(anchor) + '-title">' +
    '<header class="lesson-header"><p class="eyebrow">Aula ' + String(index + 1).padStart(2, '0') + '</p>' +
    '<h2 id="' + escapeHTML(anchor) + '-title">' + escapeHTML(titleForLesson(lesson, index)) + '</h2>' +
    '<p class="lesson-id"><code>' + escapeHTML(id) + '</code></p>' + renderStatus(lesson.reviewStatus) +
    '<dl class="lesson-meta"><div><dt>Objetivo</dt><dd>' + escapeHTML(lesson.objective || 'Ainda não cadastrado.') + '</dd></div>' +
    '<div><dt>Pré-requisitos</dt><dd>' + renderPrerequisiteIds(lesson.prerequisiteIds) + '</dd></div>' +
    '<div><dt>Versão de conteúdo</dt><dd>' + escapeHTML(lesson.contentVersion || 'não informada') + '</dd></div></dl></header>' +
    '<section class="theory-content" aria-label="Teoria da aula">' + theory + '</section>' +
    '<section class="exercises" aria-labelledby="' + escapeHTML(anchor) + '-exercises-title">' +
    '<div class="section-heading"><p class="eyebrow">Candidato para revisão</p><h3 id="' + escapeHTML(anchor) + '-exercises-title">Questões e correções registradas</h3></div>' +
    (exercises.length ? exercises.map((exercise, exerciseIndex) => renderExercise(exercise, lesson, exerciseIndex)).join('') : '<p class="muted">Nenhuma questão cadastrada.</p>') +
    '</section></article>';
}

const CSS = [
  ':root { color-scheme: dark; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif; background: #101114; color: #f4f4f5; line-height: 1.55; }',
  '* { box-sizing: border-box; } body { margin: 0; background: #101114; } a { color: #72a7ff; }',
  'code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }',
  '.page { width: min(1180px, calc(100% - 2rem)); margin: 0 auto; padding: 2rem 0 4rem; }',
  '.hero, .lesson-card, .index-card { background: #191a1f; border: 1px solid #30323a; border-radius: 18px; box-shadow: 0 12px 36px #0004; }',
  '.hero { padding: clamp(1.25rem, 4vw, 3rem); margin-bottom: 1rem; }',
  'h1, h2, h3, h4, h5 { line-height: 1.2; letter-spacing: -.02em; } h1 { font-size: clamp(1.8rem, 4vw, 3rem); margin: .25rem 0 1rem; }',
  'h2 { font-size: clamp(1.4rem, 3vw, 2rem); margin: .25rem 0; } h3 { margin-top: 2rem; } h4 { margin: .25rem 0; overflow-wrap: anywhere; } h5 { margin: 1rem 0 .5rem; }',
  '.eyebrow { color: #9ba4b5; font-size: .75rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 .35rem; }',
  '.status { display: inline-block; border-radius: 999px; padding: .35rem .65rem; font-size: .82rem; background: #3a2c17; color: #ffd79b; }',
  '.index-card { padding: 1rem 1.25rem; margin: 1rem 0 1.25rem; } .index-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: .6rem; padding: 0; list-style: none; }',
  '.index-list a { display: block; padding: .75rem; background: #22242b; border-radius: 10px; text-decoration: none; } .index-list a:hover, .text-button:hover { background: #2b3040; }',
  '.lesson-card { padding: clamp(1rem, 3vw, 2rem); margin: 1rem 0; scroll-margin-top: 1rem; } .lesson-header { border-bottom: 1px solid #30323a; padding-bottom: 1rem; }',
  '.lesson-id { color: #aeb5c1; margin: .25rem 0 1rem; } .lesson-meta, .metadata { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: .7rem; margin: 1rem 0 0; }',
  '.lesson-meta div, .metadata div { padding: .65rem .75rem; border-radius: 10px; background: #22242b; } dt { color: #aeb5c1; font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; } dd { margin: .2rem 0 0; }',
  '.theory-content { padding-top: 1rem; } .theory-content .lesson-guide { padding: 0; background: transparent; border: 0; } .theory-content .lesson-guide > h3 { display: none; }',
  '.theory-content .lesson-guide section, .theory-content .lesson-guide aside { margin: 1rem 0; } .lesson-example, .lesson-rule, .journey-prerequisites { border-radius: 10px; background: #22242b; padding: .8rem 1rem; }',
  '.lesson-example { margin: .5rem 0; } .lesson-example summary { cursor: pointer; font-weight: 650; } .lesson-rule span { font-weight: 700; color: #ffd79b; }',
  '.text-button { display: inline-block; color: #72a7ff; background: transparent; border: 0; border-radius: 6px; padding: .15rem .3rem; text-align: left; cursor: pointer; text-decoration: none; } .text-button span { display: block; color: #9ba4b5; font-size: .9rem; }',
  '.exercises { margin-top: 2.5rem; } .section-heading { border-left: 3px solid #72a7ff; padding-left: .8rem; } .exercise-card { border-top: 1px solid #30323a; padding: 1.25rem 0; scroll-margin-top: 1rem; }',
  '.exercise-header { display: flex; flex-wrap: wrap; align-items: baseline; gap: .65rem; } .exercise-header .eyebrow { flex-basis: 100%; } .exercise-header .status { margin-left: auto; }',
  '.exercise-statement, .solution, .distractors { margin-top: 1rem; } .choices { padding-left: 1.8rem; } .choices li { padding: .2rem .3rem; } .choice-correct { color: #b9f4cb; font-weight: 650; }',
  '.distractors ul { padding-left: 1.3rem; } .muted { color: #aeb5c1; } footer { color: #aeb5c1; font-size: .9rem; margin-top: 2rem; }',
  '@media (max-width: 640px) { .page { width: min(100% - 1rem, 1180px); padding-top: 1rem; } .hero, .lesson-card { border-radius: 14px; } .lesson-meta, .metadata { grid-template-columns: 1fr; } .exercise-header .status { margin-left: 0; } }',
].join('\n');

function renderDocument(lessons) {
  const lessonMap = new Map(lessons.map(lesson => [text(lesson.id), lesson]));
  const indexLinks = lessons.map((lesson, index) => {
    const id = text(lesson.id);
    return '<li><a href="#' + escapeHTML(fragmentId(id)) + '"><strong>' +
      escapeHTML(titleForLesson(lesson, index)) + '</strong><br><code>' + escapeHTML(id) + '</code><br>' +
      renderStatus(lesson.reviewStatus) + '</a></li>';
  }).join('');
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Revisão humana — MathApp módulo 01</title><style>' + CSS + '</style></head><body><main class="page">' +
    '<header class="hero"><p class="eyebrow">MathApp / Equação</p><h1>Pacote de revisão humana — módulo 01</h1>' +
    '<p>Teoria, exemplos, soluções e questões candidatas para leitura editorial. Este pacote é um artefato de revisão e não publica conteúdo.</p>' +
    '<p class="status"><strong>Revisão humana:</strong> pendente</p></header>' +
    '<nav class="index-card" aria-labelledby="index-title"><h2 id="index-title">Índice das aulas</h2><ol class="index-list">' +
    indexLinks + '</ol></nav>' + lessons.map((lesson, index) => renderLesson(lesson, index, lessonMap)).join('') +
    '<footer>Fonte candidata: ' + escapeHTML(SOURCE_RELATIVE) + '. Status e respostas são os valores registrados no candidato.</footer>' +
    '</main></body></html>';
}

const candidateModule = await import(pathToFileURL(SOURCE_PATH).href);
const candidate = candidateModule.MODULE01_LESSONS ?? candidateModule.default;
const lessons = candidate && typeof candidate === 'object'
  ? Object.values(candidate).filter(lesson => lesson && typeof lesson === 'object').sort((a,b)=>(a.displayOrder??a.order)-(b.displayOrder??b.order))
  : [];
if (!lessons.length) throw new Error('Nenhuma aula encontrada em ' + SOURCE_RELATIVE);

await fs.mkdir(OUTPUT_PATH, {recursive: true});
await fs.writeFile(path.join(OUTPUT_PATH, 'index.html'), renderDocument(lessons), 'utf8');
await fs.writeFile(
  path.join(OUTPUT_PATH, 'review-candidates.json'),
  JSON.stringify({source: SOURCE_RELATIVE, lessons}, null, 2) + '\n',
  'utf8',
);
console.log('Pacote de revisão gerado em ' + OUTPUT_PATH);
