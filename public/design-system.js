// Guide interactions are local examples and never touch the application's storage.
const $=selector=>document.querySelector(selector);
function swatches(){const style=getComputedStyle(document.documentElement);document.querySelectorAll('[data-swatch]').forEach(card=>{const value=style.getPropertyValue('--eq-color-'+card.dataset.swatch).trim();card.querySelector('.ds-swatch').style.background=value;card.querySelector('code').textContent=value;});}
document.querySelectorAll('[data-theme-choice]').forEach(button=>button.addEventListener('click',()=>{document.documentElement.dataset.theme=button.dataset.themeChoice;document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('meta[name="theme-color"]').content=getComputedStyle(document.documentElement).getPropertyValue('--eq-color-canvas').trim();swatches();}));
let toastTimer;
function notify(text){clearTimeout(toastTimer);$('#ds-toast').textContent=text;$('#ds-toast').hidden=false;toastTimer=setTimeout(()=>$('#ds-toast').hidden=true,4500);}
document.querySelectorAll('[data-demo-notice]').forEach(button=>button.addEventListener('click',()=>notify(button.dataset.demoNotice)));
$('[data-demo-dialog]').addEventListener('click',()=>$('#ds-dialog').showModal());
for(const id of ['ds-close','ds-confirm'])$('#'+id).addEventListener('click',()=>$('#ds-dialog').close());
let answer=null;
const options=[...document.querySelectorAll('[data-demo-answer]')];
options.forEach(button=>button.addEventListener('click',()=>{answer=button.dataset.demoAnswer;options.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('#ds-check').disabled=false;}));
$('#ds-check').addEventListener('click',()=>{if(!answer)return;options.forEach(b=>{b.disabled=true;if(b.dataset.demoAnswer==='B')b.classList.add('correct');else if(b.dataset.demoAnswer===answer)b.classList.add('incorrect');});const correct=answer==='B';$('#ds-answer-feedback').hidden=false;$('#ds-answer-feedback').className='eq-feedback '+(correct?'success':'error');$('#ds-answer-feedback').textContent=(correct?'✓ Boa! Você acertou.':'↻ Vamos revisar. A resposta é B.')+' O desconto é de R$ 30,00; o preço final é R$ 90,00.';$('#ds-check').hidden=true;$('#ds-retry').hidden=false;});
$('#ds-retry').addEventListener('click',()=>{answer=null;options.forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed','false');b.classList.remove('correct','incorrect');});$('#ds-answer-feedback').hidden=true;$('#ds-check').hidden=false;$('#ds-check').disabled=true;$('#ds-retry').hidden=true;options[0].focus();});
swatches();
