// Integrity validation only. Mathematical and human editorial review are separate.
// Limited exact check for literal numbers/fractions in the original-item drafts.
// It does not interpret expressions, graphs, equivalent physical units or intent.
export function numericChoiceKey(choice) {
  if (typeof choice !== 'string') return null;
  const value=choice.replaceAll('−','-').replaceAll('R$','BRL').trim();
  const match=value.match(/^([+-]?)(BRL\s*)?(\d[\d ]*(?:,\d+)?)(?:\/(\d+))?\s*([A-Za-z°]+)?$/);
  if (!match) return null;
  const [whole,decimal='']=match[3].replaceAll(' ','').split(',');
  let numerator=BigInt(whole+decimal)*(match[1]==='-'?-1n:1n);
  let denominator=10n**BigInt(decimal.length)*(match[4]?BigInt(match[4]):1n);
  if (!denominator) return null;
  let a=numerator<0n?-numerator:numerator,b=denominator;
  while(b)[a,b]=[b,a%b];
  return `${numerator/a}/${denominator/a}:${match[2]?'BRL':match[5]??''}`;
}
export function validateLessonCandidate(lesson, knownIds) {
  const fail = message => { throw new Error(`${lesson?.id ?? 'aula'}: ${message}`); };
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const list = value => Array.isArray(value) && value.length > 0;
  if (!knownIds.has(lesson?.id) || !Number.isInteger(lesson.contentVersion) || lesson.contentVersion < 1) fail('identidade/versão inválida');
  if (!text(lesson.objective) || !text(lesson.introduction) || !text(lesson.reviewStatus)) fail('objetivo, introdução ou estado ausente');
  for (const id of lesson.prerequisiteIds ?? []) if (!knownIds.has(id) || id === lesson.id) fail('pré-requisito inválido');
  if (!list(lesson.concepts) || lesson.concepts.some(c => !text(c.title) || !text(c.text))) fail('conceitos ausentes');
  if (!list(lesson.procedureSteps) || lesson.procedureSteps.some(s => !text(s.step) || !text(s.why))) fail('procedimento sem justificativa');
  if (!list(lesson.examples) || lesson.examples.length < 2 || new Set(lesson.examples.map(e => e.kind)).size < 2 || lesson.examples.some(e => !text(e.id) || !text(e.statement) || !text(e.answer) || !list(e.solutionSteps))) fail('exemplos insuficientes');
  if (!list(lesson.mistakes) || lesson.mistakes.some(m => !text(m.misconception) || !text(m.correction))) fail('erros sem explicação');
  if (!Array.isArray(lesson.summary) || lesson.summary.length < 3 || lesson.summary.length > 5 || lesson.summary.some(s => !text(s))) fail('resumo inválido');
  if (!list(lesson.references) || lesson.references.some(r => !text(r.title) || !/^https:\/\//.test(r.url))) fail('referências inválidas');
  for (const connection of lesson.connections ?? []) if (!knownIds.has(connection.lessonId) || !text(connection.reason)) fail('conexão inválida');
  const ids = new Set();
  if (!list(lesson.exercises) || new Set(lesson.exercises.map(e => e.kind)).size < 3) fail('variedade de exercícios insuficiente');
  for (const exercise of lesson.exercises) {
    if (ids.has(exercise.id) || !exercise.id.startsWith(`equacao:${lesson.id}:v${lesson.contentVersion}:`)) fail('ID de exercício inválido');
    ids.add(exercise.id);
    if (!text(exercise.statement) || !text(exercise.reviewStatus) || !list(exercise.skillIds) || !list(exercise.solutionSteps)) fail('exercício incompleto');
    if (!Array.isArray(exercise.choices) || exercise.choices.length < 2 || exercise.choices.length > 5 || new Set(exercise.choices).size !== exercise.choices.length || exercise.choices.filter(c => c === exercise.correctAnswer).length !== 1) fail('alternativas inconsistentes');
    const numericKeys=exercise.choices.map(numericChoiceKey).filter(key=>key!==null);
    if(new Set(numericKeys).size!==numericKeys.length)fail('alternativas numericamente equivalentes');
    if (exercise.choices.filter(c => c !== exercise.correctAnswer).some(c => !text(exercise.distractorFeedback?.[c]))) fail('distrator sem explicação');
    if ((exercise.prerequisiteIds ?? []).some(id => !knownIds.has(id))) fail('pré-requisito do exercício inexistente');
  }
  return true;
}
