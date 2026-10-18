import {FOUNDATION_GUIDES} from './guides-foundations.mjs';
import {ADVANCED_GUIDES} from './guides-advanced.mjs';

// Editorial notes supplement existing resources. Stable curriculum IDs, exercise
// associations and progress are independent from these teaching materials.
const GUIDES = {...FOUNDATION_GUIDES, ...ADVANCED_GUIDES};
export function guideForLesson(topic) {
  const guide = GUIDES[topic.id];
  if (!guide) throw new Error(`Guia didático ausente: ${topic.id}`);
  return structuredClone(guide);
}
