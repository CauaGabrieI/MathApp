import test from 'node:test';
import assert from 'node:assert/strict';
import {answerOrderKey,displayChoiceFor,displayChoices,fisherYates,shuffleAnswers} from '../public/answer-shuffle.js';

test('Fisher–Yates returns a permutation without mutating source choices',()=>{
  const source=['A','B','C','D','E'];
  const shuffled=fisherYates(source,()=>0);
  assert.deepEqual(source,['A','B','C','D','E']);
  assert.deepEqual([...shuffled].sort(),source);
  assert.deepEqual(shuffled,['B','C','D','E','A']);
});

test('answer order is stable for a question and attempt key',()=>{
  const choices=['A','B','C','D','E'].map(letter=>({letter,text:letter}));
  const question={id:'enemdev:2024:1'};
  const first=shuffleAnswers(choices,answerOrderKey(question,'exam:one'));
  const second=shuffleAnswers(choices,answerOrderKey(question,'exam:one'));
  assert.deepEqual(second,first);
  assert.deepEqual(choices.map(choice=>choice.letter),['A','B','C','D','E']);
  assert.equal(new Set(first.map(choice=>choice.letter)).size,5);
  assert.notDeepEqual(first,shuffleAnswers(choices,answerOrderKey(question,'exam:two')));
});

test('display labels stay sequential while source identity and gabarito mapping survive',()=>{
  const choices=['A','B','C','D','E'].map(letter=>({letter,text:`texto-${letter}`}));
  const sourceLetters=new Set(choices.map(choice=>choice.letter));
  const orders=new Set();
  for(let seed=0;seed<500;seed++){
    const displayed=displayChoices(choices,answerOrderKey({id:'question'},`attempt:${seed}`));
    orders.add(displayed.map(choice=>choice.sourceLetter).join(''));
    assert.deepEqual(displayed.map(choice=>choice.displayLetter),['A','B','C','D','E']);
    assert.deepEqual(new Set(displayed.map(choice=>choice.sourceLetter)),sourceLetters);
    for(const source of sourceLetters){
      const found=displayChoiceFor(choices,source,answerOrderKey({id:'question'},`attempt:${seed}`));
      assert.equal(found.sourceLetter,source);
      assert.equal(found.text,`texto-${source}`);
    }
  }
  assert.ok(orders.size>20,`expected varied orders, got ${orders.size}`);
});
