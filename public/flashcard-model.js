// Scheduling for lesson cards. This is deliberately SM2-inspired, not an
// exact Anki/FSRS implementation: again resets, hard grows slowly and lowers
// ease, good grows by ease, and easy grows faster while raising ease. Intervals
// are whole days; timestamps remain absolute milliseconds so daylight-saving
// changes cannot alter a review date.
export const CARD_SCHEMA_VERSION=2;
export const CARD_RATINGS=['again','hard','good','easy'];
const DAY=24*60*60*1000;
const MINUTE=60*1000;
const finiteTime=value=>Number.isSafeInteger(value)&&value>0?value:null;
const integer=(value,fallback)=>Number.isSafeInteger(value)&&value>=0?value:fallback;
const ratingOf=value=>CARD_RATINGS.includes(value)?value:null;

export function normalizeCard(card,now=Date.now()){
  if(!card||typeof card.id!=='string')throw new Error('Card inválido.');
  // `updatedAt` is a storage mutation timestamp, not proof that the card was
  // reviewed. Older records without a review timestamp therefore start with
  // zero repetitions even when another field was edited.
  const reviewedAt=finiteTime(card.reviewedAt);
  const remembered=typeof card.remembered==='boolean'?card.remembered:true;
  const interval=integer(card.interval,0);
  const repetitions=integer(card.repetitions,reviewedAt!==null&&remembered?1:0);
  const lapses=integer(card.lapses,0);
  const ease=Number.isFinite(card.ease)?Math.min(3.5,Math.max(1.3,card.ease)):2.5;
  // Legacy records must normalize identically on every backup pass. A missing
  // timestamp is represented by zero until the first explicit review.
  const dueAt=finiteTime(card.dueAt)??reviewedAt??0;
  return {
    ...card,id:card.id,remembered,reviewedAt:reviewedAt??0,rating:ratingOf(card.rating)??(remembered?'good':'again'),
    dueAt,interval,ease,repetitions,lapses,updatedAt:finiteTime(card.updatedAt)??reviewedAt??0,
    cardSchemaVersion:CARD_SCHEMA_VERSION
  };
}

export function nextReview(card,rating,now=Date.now()){
  if(!CARD_RATINGS.includes(rating))throw new Error('Avaliação de card inválida.');
  if(!Number.isSafeInteger(now)||now<=0)throw new Error('Data de revisão inválida.');
  const current=normalizeCard(card,now);
  let interval=current.interval,repetitions=current.repetitions,ease=current.ease,lapses=current.lapses,remembered=true,delay;
  if(rating==='again'){
    interval=0;repetitions=0;lapses+=1;ease=Math.max(1.3,ease-0.2);remembered=false;delay=1*MINUTE;
  } else if(rating==='hard'){
    if(interval>0)interval+=1;else delay=6*MINUTE;repetitions+=1;ease=Math.max(1.3,ease-0.15);
  } else if(rating==='good'){
    interval=interval?Math.max(1,Math.round(interval*ease)):1;repetitions+=1;delay=interval*DAY;
  } else {
    interval=interval?Math.max(2,Math.round(interval*ease*1.3)):4;repetitions+=1;ease=Math.min(3.5,ease+0.15);delay=interval*DAY;
  }
  if(delay===undefined)delay=interval*DAY;
  return {...current,remembered,rating,dueAt:now+delay,interval,ease,repetitions,lapses,reviewedAt:now,updatedAt:now,cardSchemaVersion:CARD_SCHEMA_VERSION};
}

export function reviewQueue(cards,now=Date.now()){
  return cards.map(card=>normalizeCard(card,now)).filter(card=>card.dueAt<=now).sort((a,b)=>a.dueAt-b.dueAt||a.updatedAt-b.updatedAt||a.id.localeCompare(b.id));
}

export function previewIntervals(card,now=Date.now()){
  return Object.fromEntries(CARD_RATINGS.map(rating=>[rating,nextReview(card,rating,now)]));
}
