// Pure renderer for the structured theory draft. It deliberately does not
// render exercises: the exercise tab owns attempts and answer submission.

const asArray = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' ? value : value == null ? '' : String(value);

function escapeHTML(value) {
  return text(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character]));
}

function safeURL(value) {
  const url = text(value).trim();
  return /^https?:\/\//iu.test(url) ? url : null;
}

function findLesson(lessonById, id) {
  if (!lessonById) return null;
  if (typeof lessonById === 'function') return lessonById(id) ?? null;
  if (lessonById instanceof Map) return lessonById.get(id) ?? null;
  if (Array.isArray(lessonById)) return lessonById.find(lesson => lesson?.id === id) ?? null;
  return Object.prototype.hasOwnProperty.call(lessonById, id) ? lessonById[id] ?? null : null;
}

function lessonLink(id, label, lessonById, reason = '') {
  const known = findLesson(lessonById, id);
  const title = label || known?.title || id;
  return `<li><button type="button" class="text-button" data-journey-lesson="${escapeHTML(id)}">${escapeHTML(title)}${reason ? `<span>${escapeHTML(reason)}</span>` : ''}</button></li>`;
}

function renderDiagnostic(diagnostic) {
  if (!diagnostic || !text(diagnostic.question).trim()) return '';
  return `<details class="lesson-example lesson-diagnostic"><summary>Diagnóstico rápido: ${escapeHTML(diagnostic.question)}</summary><div class="lesson-answer"><p><strong>Resposta:</strong> ${escapeHTML(diagnostic.answer || 'Resposta ainda não cadastrada.')}</p>${diagnostic.explanation ? `<p>${escapeHTML(diagnostic.explanation)}</p>` : ''}</div></details>`;
}

function renderConcepts(concepts) {
  const rows = asArray(concepts).filter(concept => concept && (text(concept.title).trim() || text(concept.text).trim()));
  if (!rows.length) return '';
  return `<section aria-labelledby="lesson-concepts-title"><h3 id="lesson-concepts-title">Conceitos essenciais</h3><dl>${rows.map(concept => `<div><dt>${escapeHTML(concept.title)}</dt><dd>${escapeHTML(concept.text)}</dd></div>`).join('')}</dl></section>`;
}

function renderProcedure(steps) {
  const rows = asArray(steps).filter(step => step && (text(step.step).trim() || text(step.why).trim()));
  if (!rows.length) return '';
  return `<section aria-labelledby="lesson-procedure-title"><h3 id="lesson-procedure-title">Como resolver</h3><ol>${rows.map(step => `<li><strong>${escapeHTML(step.step)}</strong>${step.why ? `<p><span class="eyebrow">POR QUE FUNCIONA</span> ${escapeHTML(step.why)}</p>` : ''}</li>`).join('')}</ol></section>`;
}

function renderExamples(examples) {
  const rows = asArray(examples).filter(example => example && (text(example.title).trim() || text(example.statement).trim()));
  if (!rows.length) return '';
  return `<section aria-labelledby="lesson-examples-title"><h3 id="lesson-examples-title">Exemplos resolvidos</h3>${rows.map((example, index) => {
    const title = text(example.title).trim() || `Exemplo ${index + 1}`;
    const steps = asArray(example.solutionSteps).filter(step => text(step).trim());
    return `<details class="lesson-example"><summary>${escapeHTML(title)}</summary><div class="lesson-answer">${example.statement ? `<p>${escapeHTML(example.statement)}</p>` : ''}${steps.length ? `<ol>${steps.map(step => `<li>${escapeHTML(step)}</li>`).join('')}</ol>` : ''}<p><strong>Resposta:</strong> ${escapeHTML(example.answer || 'Resposta ainda não cadastrada.')}</p></div></details>`;
  }).join('')}</section>`;
}

function renderMistakes(mistakes) {
  const rows = asArray(mistakes).filter(mistake => mistake && (text(mistake.misconception).trim() || text(mistake.correction).trim()));
  if (!rows.length) return '';
  return `<section aria-labelledby="lesson-mistakes-title"><h3 id="lesson-mistakes-title">Erros comuns</h3>${rows.map(mistake => `<div class="lesson-rule"><span>${escapeHTML(mistake.misconception || 'ATENÇÃO')}</span><p>${escapeHTML(mistake.correction || 'Revise este ponto antes de continuar.')}</p></div>`).join('')}</section>`;
}

function renderChecks(checks) {
  const rows = asArray(checks).filter(check => check && text(check.question).trim());
  if (!rows.length) return '';
  return `<section aria-labelledby="lesson-checks-title"><h3 id="lesson-checks-title">Mini checagem</h3>${rows.map((check, index) => `<details class="lesson-example lesson-check"><summary>${index + 1}. ${escapeHTML(check.question)}</summary><div class="lesson-answer"><p><strong>Resposta:</strong> ${escapeHTML(check.answer || 'Resposta ainda não cadastrada.')}</p>${check.explanation ? `<p>${escapeHTML(check.explanation)}</p>` : ''}</div></details>`).join('')}</section>`;
}

function renderConnections(connections, lessonById) {
  const rows = asArray(connections).filter(connection => connection && text(connection.lessonId).trim());
  if (!rows.length) return '';
  return `<section aria-labelledby="lesson-connections-title"><h3 id="lesson-connections-title">Conexões</h3><ul>${rows.map(connection => lessonLink(connection.lessonId, connection.title, lessonById, connection.reason)).join('')}</ul></section>`;
}

function renderReferences(references) {
  const rows = asArray(references).filter(reference => reference && (text(reference.title).trim() || text(reference.url).trim()));
  if (!rows.length) return '';
  return `<section aria-labelledby="lesson-references-title"><h3 id="lesson-references-title">Referências</h3><ul>${rows.map(reference => {
    const title = escapeHTML(reference.title || reference.url);
    const url = safeURL(reference.url);
    return `<li>${url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${title}</a>` : title}${reference.note ? ` <span>${escapeHTML(reference.note)}</span>` : ''}</li>`;
  }).join('')}</ul></section>`;
}

function reviewNotice(status) {
  if (status === 'approved') return '';
  return `<aside class="lesson-rule lesson-review-status" role="note"><span>REVISÃO EDITORIAL PENDENTE</span><p>Este conteúdo ainda aguarda revisão humana antes de ser considerado pronto para produção.</p></aside>`;
}

export function renderLessonTheory(lesson, {lessonById} = {}) {
  if (!lesson || typeof lesson !== 'object') return '<div class="lesson-empty"><strong>Teoria indisponível.</strong></div>';
  const objective = text(lesson.objective).trim();
  const introduction = text(lesson.introduction).trim();
  const summary = asArray(lesson.summary).filter(item => text(item).trim());
  const prerequisiteIds = asArray(lesson.prerequisiteIds).filter(id => text(id).trim());
  const prerequisites = prerequisiteIds.length ? `<aside class="journey-prerequisites" aria-labelledby="lesson-prerequisites-title"><strong id="lesson-prerequisites-title">Uma base que pode ajudar</strong><p>Você pode continuar livremente; estas aulas são recomendações pontuais.</p><ul>${prerequisiteIds.map(id => lessonLink(id, '', lessonById)).join('')}</ul></aside>` : '';
  const summaryHTML = summary.length ? `<section aria-labelledby="lesson-summary-title"><h3 id="lesson-summary-title">Resumo de aprendizagem</h3><ul>${summary.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul></section>` : '';
  const sections = [
    objective ? `<p class="lesson-objective"><strong>Objetivo:</strong> ${escapeHTML(objective)}</p>` : '',
    prerequisites,
    renderDiagnostic(lesson.diagnostic),
    introduction ? `<section aria-labelledby="lesson-introduction-title"><h3 id="lesson-introduction-title">Intuição inicial</h3><p>${escapeHTML(introduction)}</p></section>` : '',
    renderConcepts(lesson.concepts),
    renderProcedure(lesson.procedureSteps),
    renderExamples(lesson.examples),
    renderMistakes(lesson.mistakes),
    summaryHTML,
    renderChecks(lesson.checks),
    renderConnections(lesson.connections, lessonById),
    asArray(lesson.enemAlignment).length ? `<section aria-label="Relação editorial com o ENEM"><h3>Relação com o ENEM</h3><p>Correspondência pedagógica proposta pelo app; não é uma classificação oficial do Inep.</p><ul>${lesson.enemAlignment.map(a=>`<li><strong>${escapeHTML(a.skill)}:</strong> ${escapeHTML(a.reason)}</li>`).join('')}</ul></section>` : '',
    renderReferences(lesson.references),
  ];
  const content = sections.filter(Boolean).join('');
  const fallback = content || '<p class="lesson-note">Conteúdo de teoria ainda não cadastrado para esta aula.</p>';
  return `<section class="lesson-guide" aria-labelledby="lesson-theory-title"><h3 id="lesson-theory-title">Entenda a ideia</h3>${fallback}${reviewNotice(lesson.reviewStatus)}</section>`;
}

export {escapeHTML};
