import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {guideForLesson} from '../content/lesson-guides.mjs';

const curriculum=JSON.parse(fs.readFileSync('public/curriculum.json','utf8'));

test('cada aula curricular recebe um guia didático válido e resumo próprio',()=>{
  const lessons=curriculum.modules.flatMap(module=>module.topics.map(topic=>({module,topic,guide:guideForLesson(topic,module)})));
  assert.equal(lessons.length,199);
  assert.equal(new Set(lessons.map(({guide})=>guide.summary)).size,199);
  for(const {topic,guide} of lessons){
    assert.ok(guide.summary.length>=70,topic.title);
    assert.ok(guide.steps.length>=2&&guide.steps.length<=4,topic.title);
    assert.ok(guide.steps.every(step=>typeof step==='string'&&step.length>=5),topic.title);
    assert.ok(guide.pitfall.length>=20,topic.title);
    assert.match(guide.pitfall,/\p{L}/u,topic.title);
    assert.doesNotMatch(JSON.stringify(guide),/placeholder|TODO|lorem ipsum|coming soon|a definir|em breve/,
      topic.title);
    assert.equal(typeof guide.example?.question,'string',topic.title);
    assert.ok(guide.example.question.length>=1,topic.title);
    assert.ok(Array.isArray(guide.example.steps)&&guide.example.steps.length>=1,topic.title);
    assert.ok(guide.example.steps.every(step=>typeof step==='string'&&step.length>=1),topic.title);
    assert.equal(typeof guide.example.answer,'string',topic.title);
    assert.ok(guide.example.answer.length>=1,topic.title);
  }
});
