const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

const GRADES=[
 {id:'again',label:'De novo',key:'1'},
 {id:'hard',label:'Difícil',key:'2'},
 {id:'good',label:'Bom',key:'3'},
 {id:'easy',label:'Fácil',key:'4'}
];

/**
 * Render the review surface. Scheduling and persistence stay outside this
 * component: onReview resolves only after the host has saved the grade.
 */
export function initFlashcardsUI({root,onReview,onError,onLearn}={}){
 if(!root)throw new TypeError('Flashcards UI precisa de um elemento raiz.');
 let state={cards:[],counts:{new:0,today:0,scheduled:0},total:0,previews:{}};
 let currentId=null,revealed=false,pending=false;

 const active=()=>{
  const page=root.closest('.page');
  if(page?.hidden)return false;
  if(root.closest('dialog[open]'))return false;
  if(document.querySelector('dialog[open]'))return false;
  return true;
 };
 const current=()=>state.cards.find(card=>card.id===currentId)??state.cards[0]??null;
 const preview=(id)=>state.previews?.[id]??{};
 const countsHTML=()=>`<div class="flashcards-counts" aria-label="Resumo da revisão">
  <span><strong>${state.counts.new??0}</strong> novos</span>
  <span><strong>${state.counts.today??0}</strong> hoje</span>
  <span><strong>${state.counts.scheduled??0}</strong> agendados</span>
 </div>`;
 const emptyHTML=()=>{
  if(state.total===0)return `<div class="flashcard-empty"><span class="flashcards-empty-mark" aria-hidden="true">✦</span><h2>Seus cards aparecem aqui.</h2><p>Conclua todas as aulas de um módulo para criar perguntas rápidas e começar a revisar.</p>${onLearn?'<button class="button primary" type="button" data-flashcard-learn>Ir para Aprender →</button>':''}</div>`;
  return `<div class="flashcard-empty"><span class="flashcards-empty-mark" aria-hidden="true">✓</span><h2>Tudo em dia.</h2><p>Você revisou os cards disponíveis. Volte depois para a próxima rodada.</p></div>`;
 };
 const render=()=>{
  const card=current();
  root.innerHTML=`<section class="flashcards-review" aria-label="Revisão de cards">
   ${countsHTML()}
   ${card?`<article class="flashcard" data-flashcard-id="${esc(card.id)}" aria-live="polite">
    <div class="flashcard-meta"><span>${esc(card.moduleTitle??'Módulo aprendido')}</span><span>${esc(card.lessonTitle??'')}</span></div>
    <div class="flashcard-face flashcard-question"><span class="flashcard-face-label">Pergunta</span><h2>${esc(card.question)}</h2></div>
    ${revealed?`<div class="flashcard-face flashcard-answer"><span class="flashcard-face-label">Resposta</span><p>${esc(card.answer)}</p></div>`:''}
    <div class="flashcard-controls">
     ${revealed?`<div class="flashcard-grades" role="group" aria-label="Como foi sua revisão">${GRADES.map(grade=>{const value=preview(card.id)[grade.id];return `<button type="button" class="button ${grade.id==='good'?'primary':'secondary'} flashcard-grade" data-flashcard-grade="${grade.id}" ${pending?'disabled':''}><span>${grade.label}</span><kbd>${grade.key}</kbd>${value?`<small>${esc(value)}</small>`:''}</button>`;}).join('')}</div>`:`<button type="button" class="button primary flashcard-reveal" data-flashcard-reveal ${pending?'disabled':''}>Revelar resposta <kbd>Espaço</kbd></button>`}
    </div>
   </article>`:emptyHTML()}
  </section>`;
 };
 const reveal=()=>{if(current()&&!pending&&!revealed){revealed=true;render();root.querySelector('[data-flashcard-grade]')?.focus();}};
 const review=async grade=>{
  const card=current();
  if(!card||!revealed||pending)return;
  const reviewedId=card.id;
  pending=true;render();
  try{
   await onReview?.(reviewedId,grade);
   // The host normally updates the queue atomically while onReview resolves.
   // If it did, retain that selection; otherwise advance locally.
   if(currentId===reviewedId){
    const index=state.cards.findIndex(item=>item.id===reviewedId);
    const next=state.cards[index+1]??state.cards[index-1]??null;
    currentId=next?.id??null;
   }
   revealed=false;
  }catch(error){pending=false;render();onError?.(error);return;}
  pending=false;render();
 };
 const click=event=>{
  const button=event.target.closest('button');
  if(!button||!root.contains(button))return;
  if(button.hasAttribute('data-flashcard-learn')){onLearn?.();return;}
  if(button.hasAttribute('data-flashcard-reveal')){reveal();return;}
  if(button.dataset.flashcardGrade)review(button.dataset.flashcardGrade);
 };
 const keydown=event=>{
  if(!active()||event.defaultPrevented)return;
  const element=event.target;
  const isButton=element&&typeof element.matches==='function'&&element.matches('button');
  const isGradeButton=Boolean(element?.closest?.('[data-flashcard-grade]'));
  if(element&&typeof element.matches==='function'&&(element.matches('input,textarea,select,[contenteditable="true"]')||element.closest('dialog[open]')))return;
  if(event.code==='Space'){
   // Let a focused reveal button perform its native click exactly once.
   if(isButton)return;
   event.preventDefault();reveal();return;
  }
  if(isButton&&!isGradeButton)return;
  if(revealed&&/^[1-4]$/.test(event.key)){event.preventDefault();review(GRADES[Number(event.key)-1].id);}
 };
 root.addEventListener('click',click);
 document.addEventListener('keydown',keydown);
 const update=next=>{
  const incoming=next??{};
  const previousId=currentId;
  state={cards:Array.isArray(incoming.cards)?incoming.cards:[],counts:incoming.counts??{},total:Number(incoming.total??incoming.cards?.length??0),previews:incoming.previews??{}};
  if(!state.cards.some(card=>card.id===currentId))currentId=state.cards[0]?.id??null;
  if(currentId!==previousId)revealed=false;
  render();
 };
 const destroy=()=>{root.removeEventListener('click',click);document.removeEventListener('keydown',keydown);root.replaceChildren();};
 return {update,destroy};
}

export const createFlashcardsUI=initFlashcardsUI;
