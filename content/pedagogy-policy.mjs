// Editorial presentation is independent from Markdown identity and source order.
export const PEDAGOGY_VERSION = 2;
export const LESSON_SEQUENCE = {
  'math.m01': [1, 5, 2, 6, 7, 8, 9, 10, 3, 4],
  'math.m07': [1, 4, 2, 3, 6, 5, 7, 8],
};
export const MODULE_PREREQUISITES = {
  1: [], 2: [1], 3: [2], 4: [1], 5: [1, 4], 6: [1, 4], 7: [6], 8: [6, 2],
  9: [8], 10: [8, 7], 11: [8, 4], 12: [6, 4], 13: [2, 4, 5], 14: [13],
  15: [14, 8], 16: [5, 14], 17: [4, 9, 14], 18: [1, 2], 19: [1], 20: [19, 2],
  21: [3, 4, 11, 12], 22: [9, 10, 11], 23: [2, 18],
  24: [15, 16, 20, 21, 22, 23], 25: [6, 7, 15, 17, 22],
};
const id = (module, topic) => `math.m${String(module).padStart(2, '0')}.t${String(topic).padStart(2, '0')}`;
const BASES = {
  1: [], 5: [1], 6: [5, 2], 2: [1, 5], 7: [1, 5], 8: [7, 6],
  9: [7, 8, 6], 10: [7, 9], 3: [1, 5, 10], 4: [1, 3, 5],
};
export function lessonPrerequisites(module, topic) {
  if (module.order === 1) return (BASES[topic.order] ?? []).map(n => id(1, n));
  if (module.order === 7) {
    const bases = {1: [], 4: [1], 2: [1, 4], 3: [2], 6: [], 5: [2], 7: [2, 6], 8: [2, 4]};
    return (bases[topic.order] ?? []).map(n => id(7, n));
  }
  return [];
}
export function lessonDisplayOrder(module, topic) {
  const sequence = LESSON_SEQUENCE[module.id];
  return sequence ? sequence.indexOf(topic.order) + 1 : topic.order;
}
export function approvedTheory(candidate) {
  // A schema check or an AI review is not a human approval.
  return candidate?.reviewStatus === 'approved' &&
    typeof candidate.reviewedBy === 'string' && candidate.reviewedBy.trim() &&
    Number.isFinite(Date.parse(candidate.reviewedAt));
}
