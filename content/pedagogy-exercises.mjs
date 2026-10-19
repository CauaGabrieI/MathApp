import {approvedTheory} from './pedagogy-policy.mjs';
import {validateLessonCandidate} from './lesson-schema.mjs';

// Adapt reviewed original items to the existing exercise/correction engine.
// Draft answers are never added to the bank, including in editorial previews.
export function approvedExercises(candidates, curriculum) {
  const known = new Set(curriculum.modules.flatMap(m => m.topics.map(t => t.id)));
  const questions = [];
  for (const lesson of Object.values(candidates)) {
    validateLessonCandidate(lesson, known);
    if (!approvedTheory(lesson)) continue;
    const topic = curriculum.modules.flatMap(m => m.topics).find(t => t.id === lesson.id);
    for (const item of lesson.exercises.filter(approvedTheory)) {
      const alternatives = item.choices.map((text, index) => ({letter:String.fromCharCode(65 + index),text,file:null}));
      const answer = alternatives.find(a => a.text === item.correctAnswer).letter;
      questions.push({
        id:item.id, source:'equacao', nativeId:item.id,
        level:item.level, levelOrigin:'editorial', year:null,
        title:topic.title, topic:topic.title, statement:item.statement, question:item.statement,
        format:'text', introduction:'', files:[], alternatives, answer,
        explanation:[...item.solutionSteps.map((step,i)=>`${i+1}. ${step}`),
          ...Object.entries(item.distractorFeedback).map(([choice,feedback])=>`Sobre “${choice}”: ${feedback}`)].join('\n'),
        learning:{moduleId:lesson.id.split('.t')[0],lessonId:lesson.id},
        dedupeKey:`equacao-original:${item.id}`, contentSource:'equacao-original-reviewed',
      });
    }
  }
  return questions;
}
