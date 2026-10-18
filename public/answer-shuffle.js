// Answer choices are shuffled for display only. The source letter remains the
// stable identity used by persistence and grading.
export function fisherYates(values, random = Math.random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function seedFrom(value) {
  let hash = 2166136261;
  for (const character of String(value ?? '')) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

/** Stable per-attempt ordering for UI; omitting key uses normal randomness. */
export function shuffleAnswers(alternatives, key = '') {
  if (!Array.isArray(alternatives) || alternatives.length < 2) return [...(alternatives ?? [])];
  return fisherYates(alternatives, key === '' ? Math.random : seededRandom(seedFrom(key)));
}

const DISPLAY_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Return shuffled choices with sequential visual labels and source identity. */
export function displayChoices(alternatives, key = '') {
  return shuffleAnswers(alternatives, key).map((alternative, index) => ({
    ...alternative,
    sourceLetter: alternative.letter,
    displayLetter: DISPLAY_LETTERS[index] ?? alternative.letter,
  }));
}

export function displayChoiceFor(alternatives, sourceLetter, key = '') {
  return displayChoices(alternatives, key).find(choice => choice.sourceLetter === sourceLetter) ?? null;
}

export function answerOrderKey(question, scope = '') {
  return `${scope}:${question?.id ?? question?.nativeId ?? ''}`;
}
