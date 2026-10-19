import {snapshot,backupSettings,restoreBackup} from './db.js?v=math27';
import {makeBackup,validateBackup,mergeBackups,hydrateRecords} from './backup-model.js?v=math27';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let user=null,configured=false,settings={},flow=null,pollTimer,saveTimer,busy=false,queue=Promise.resolve(),epoch=0,notice='',options,bankPromise,backupGeneration=0,pollInFlight=false,resumeInFlight=false;
const bank=()=>bankPromise??=(Promise.all(['/bank.json','/study-bank.json'].map(path=>fetch(path).then(r=>{if(!r.ok)throw new Error('Banco de questões indisponível.');return r.json();}))).then(rows=>rows.flat()).catch(e=>{bankPromise=null;throw e;}));
let catalogPromise;
const examCatalog=()=>catalogPromise??=fetch('/learning-path.json?v=math27').then(r=>{if(!r.ok)throw new Error('Catálogo de avaliações indisponível.');return r.json();}).then(path=>Object.fromEntries(path.modules.map(m=>[m.id,[...new Set([...m.lessons.flatMap(l=>l.questionIds),...(m.historicalQuestionIds??[])])]]))).catch(error=>{catalogPromise=null;throw error;});
function request(action,input={}){const next=queue.catch(()=>{}).then(async()=>{if(window.EquacaoAndroid?.githubRequest)return window.EquacaoAndroid.githubRequest(action,input);const r=await fetch('/api/github/'+action,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal:AbortSignal.timeout(90000)});const data=await r.json();if(!r.ok)throw Object.assign(new Error(data.error??'Não foi possível conectar ao GitHub.'),{status:r.status});return data;});queue=next;return next;}
const fingerprint=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(value))))).map(b=>b.toString(16).padStart(2,'0')).join('');
const labelDate=value=>value?new Date(value).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'}):'Nenhum backup neste aparelho';
function content(){
  if(flow&&flow.phase!=='finishing')return `<p class="dialog-copy">Abra o GitHub, entre na sua conta e digite este código. Confira se a autorização é para o <strong>Equação</strong>.</p><div class="github-code" aria-label="Código de autorização">${escape(flow.userCode)}</div><a class="button primary github-authorize" href="https://github.com/login/device" target="_blank" rel="noopener noreferrer">Autorizar no GitHub ↗</a><p class="dialog-copy" role="status">Aguardando sua autorização… O código expira às ${escape(new Date(flow.expiresAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}))}.</p><p class="dialog-copy">Depois de autorizar, volte ao app para concluir a conexão.</p><button class="button primary" data-github="resume">Já autorizei — verificar conexão</button><button class="button secondary" data-github="cancel" ${busy?'disabled':''}>Cancelar conexão</button>`;
  if(flow&&flow.phase==='finishing')return `<p class="dialog-copy" role="status">Autorização confirmada. Estamos concluindo sua conexão com o GitHub…</p><button class="button primary" data-github="resume">Já autorizei — verificar conexão</button><button class="button secondary" data-github="cancel" ${busy?'disabled':''}>Cancelar conexão</button>`;
  if(!user)return `<div class="github-intro"><span class="pill">BACKUP OPCIONAL</span><h3>Seu aprendizado acompanha você.</h3><p class="dialog-copy">Conecte sua própria conta para guardar questões vistas, respostas e tópicos estudados em um repositório <strong>privado</strong> chamado <strong>equacao-backup</strong>. Você escolhe quando enviar ou restaurar.</p></div><p class="github-permission">Para criar e atualizar um repositório privado, o GitHub solicita a permissão <strong>repo</strong>, que também permite acesso a outros repositórios da sua conta. O código do Equação usa essa conexão apenas para o repositório de backup. Autorize somente se concordar.</p><button class="button primary" data-github="login" ${!configured||busy?'disabled':''}>${busy?'Conectando…':'Conectar com GitHub'}</button>${!configured?'<p class="dialog-copy">A conexão GitHub ainda não está disponível nesta versão.</p>':''}<p class="dialog-copy">Você pode continuar estudando sem conta. Seu histórico permanece neste aparelho.</p>`;
  const auto=settings.ownerId===user.id&&settings.auto===true;
  return `<div class="github-account"><span class="github-avatar" aria-hidden="true">${escape(user.login[0].toUpperCase())}</span><div><strong>@${escape(user.login)}</strong><small>Conta GitHub conectada</small></div><span class="pill">PRIVADO</span></div><p class="dialog-copy">Guarde suas respostas, aulas concluídas, provas e revisões dos cards. Você pode reunir o progresso de vários aparelhos.</p><div class="github-status"><span>Último backup neste aparelho</span><strong>${escape(settings.ownerId===user.id?labelDate(settings.lastSync):labelDate(null))}</strong><span>Backup automático</span><strong>${auto?'Ativado enquanto o app estiver aberto':'Desativado'}</strong></div><p class="dialog-copy">Salvar ou ativar o automático envia o progresso deste aparelho para <strong>@${escape(user.login)}</strong>. Confira a conta antes de continuar.</p><div class="dialog-actions"><button class="button primary" data-github="save" ${busy?'disabled':''}>${busy?'Aguarde…':'Salvar agora'}</button><button class="button secondary" data-github="restore" ${busy?'disabled':''}>Restaurar da minha conta</button><button class="button secondary" data-github="auto" ${busy?'disabled':''}>${auto?'Desativar automático':'Ativar backup automático'}</button></div><p class="dialog-copy">Restaurar reúne os dados sem apagar respostas locais. Para uma questão respondida duas vezes, vale a primeira resposta. Limpar o histórico local não apaga o backup.</p><a class="text-button" href="https://github.com/${escape(user.login)}/equacao-backup" target="_blank" rel="noopener noreferrer">Abrir repositório de backup ↗</a><div class="dialog-actions"><button class="button secondary" data-github="logout" ${busy?'disabled':''}>Desconectar neste aparelho</button></div><p class="dialog-copy">Desconectar remove a autorização guardada neste aparelho e desativa o automático. Para revogar o acesso no GitHub, use <a href="https://github.com/settings/applications" target="_blank" rel="noopener noreferrer">Aplicativos autorizados</a>.</p>`;
}
function paint(){const root=document.querySelector('#github-panel');if(root){root.innerHTML=content()+`<p class="github-notice" role="status" aria-live="polite">${escape(notice)}</p>`;}}
function transient(error){const status=Number(error?.status??0);return !status||[403,408,429].includes(status)||status>=500;}
function clearFlow(message){++epoch;clearTimeout(pollTimer);pollTimer=null;flow=null;if(message)notice=message;}
function adoptStatus(result){
 configured=result.configured;const prior=user;user=result.user??null;
 if(user){clearFlow();if(!prior&&settings.auto)settings={...settings,auto:false};return false;}
 const candidate=result.flow;
 if(candidate&&Number.isFinite(candidate.expiresAt)&&candidate.expiresAt>Date.now()&&(candidate.userCode||candidate.phase==='finishing')){
  if(!flow)++epoch;flow={...candidate,phase:candidate.phase==='finishing'?'finishing':'authorizing'};return true;
 }
 if(candidate)clearFlow();return false;
}
function schedulePoll(delay=0){clearTimeout(pollTimer);if(!flow||document.hidden)return;const token=epoch;const wait=Math.max(5000,Number(delay)||0,Number(flow.nextPollAt)?flow.nextPollAt-Date.now():0);pollTimer=setTimeout(()=>poll(token),wait);}
async function resumeFlow(){
 if(resumeInFlight||pollInFlight||busy||document.hidden)return;const token=epoch;resumeInFlight=true;
 try{const result=await request('status');if(token!==epoch)return;adoptStatus(result);if(flow&&!user)await poll(epoch);paint();}
 catch(error){if(token!==epoch)return;notice=flow?'Não foi possível verificar agora. Seu código continua válido; tente novamente.':'Conecte-se à internet para acessar sua conta GitHub.';if(flow&&transient(error))schedulePoll(10000);paint();}
 finally{resumeInFlight=false;if(user&&!flow)schedule();}
}
export async function openGitHub(){options.showDialog('Conta e backup','<div id="github-panel"></div>');paint();const token=epoch;if(!busy)try{const result=await request('status');if(token!==epoch)return;if(adoptStatus(result))schedulePoll();paint();}catch{notice='Sem conexão. Seus dados continuam salvos neste aparelho.';paint();}}
function schedule(){clearTimeout(saveTimer);if(user&&settings.ownerId===user.id&&settings.auto)saveTimer=setTimeout(()=>syncBackup(true).catch(()=>{}),12000);}
async function failed(error){notice=error.message??'Backup indisponível. Seus dados locais continuam salvos.';if(error.status===401){user=null;settings={...settings,auto:false};await backupSettings(settings);}paint();}
async function syncBackup(automatic=false){
  if(busy||flow||!user)return;if(automatic&&(!settings.auto||settings.ownerId!==user.id))return;
  busy=true;notice=automatic?'Salvando alterações…':'Conferindo seu backup…';paint();const identity=user.id,generation=backupGeneration;
  try{
    const questions=await bank(),catalog=await examCatalog(),initial=makeBackup(await snapshot(),identity),initialHash=await fingerprint(initial);
    if(automatic&&initialHash===settings.fingerprint)return;
    let saved,merged;
    for(let attempt=0;attempt<3;attempt++){
      const remote=await request('read');const local=makeBackup(await snapshot(),identity);merged=remote.backup?mergeBackups(local,validateBackup(remote.backup,identity)):local;hydrateRecords(merged,questions,catalog);
      try{saved=await request('write',{backup:merged,sha:remote.sha??null});break;}catch(error){if(error.status!==409||attempt===2)throw error;}
    }
    if(generation!==backupGeneration)return;await restoreBackup(merged,questions,identity,catalog);settings={...settings,ownerId:identity,lastSync:saved.savedAt,fingerprint:await fingerprint(merged)};await backupSettings(settings);notice='Backup salvo no seu GitHub. Dados dos aparelhos reunidos.';await options.refresh();options.broadcast?.();if(!automatic)options.toast(notice);
    if(await fingerprint(makeBackup(await snapshot(),identity))!==settings.fingerprint)schedule();
  }catch(error){await failed(error);if(!automatic)options.toast(notice);}
  finally{busy=false;paint();}
}
async function poll(token){
 if(token!==epoch||!flow||pollInFlight||document.hidden)return;
 if(Date.now()>=flow.expiresAt){clearFlow('O código expirou. Inicie a conexão novamente.');paint();return;}
 if(Number(flow.nextPollAt)>Date.now()){schedulePoll();return;}
 pollInFlight=true;flow={...flow,nextPollAt:Date.now()+Math.max(5,Number(flow.interval)||5)*1000};
 try{
  const result=await request('poll');if(token!==epoch)return;
  if(result.user){clearFlow();user=result.user;settings={...settings,auto:false};const appliedEpoch=epoch;await backupSettings(settings);if(appliedEpoch!==epoch)return;notice='Conta conectada. Escolha salvar ou restaurar seu progresso.';options.toast(notice);paint();return;}
  if(result.pending){flow={...flow,interval:Math.max(5,Number(result.interval)||flow.interval||5),nextPollAt:Date.now()+Math.max(5,Number(result.interval)||flow.interval||5)*1000};schedulePoll();return;}
  if(result.phase==='finishing'){flow={...flow,phase:'finishing'};schedulePoll();paint();return;}
  throw new Error('Não foi possível confirmar a conexão.');
 }catch(error){
  if(token!==epoch)return;
  if(transient(error)&&Date.now()<flow.expiresAt){flow={...flow,nextPollAt:Date.now()+Math.max(10000,(Number(flow.interval)||5)*1000)};notice='A conexão foi interrompida. Seu código foi mantido; vamos verificar novamente.';paint();schedulePoll();return;}
  clearFlow(error.status===401?'A autorização foi negada. Inicie a conexão novamente.':'A conexão expirou. Inicie novamente.');await failed(error);
 }finally{pollInFlight=false;}
}
export async function initGitHub(callbacks){options=callbacks;settings=await backupSettings();
  document.addEventListener('click',async event=>{const button=event.target.closest('[data-github]');if(!button||busy)return;const action=button.dataset.github;
    if(action==='open'){await openGitHub();return;}
    if(action==='resume'){await resumeFlow();return;}
    if(action==='save'){await syncBackup();return;}
    if(action==='auto'){if(settings.ownerId===user?.id&&settings.auto){settings={...settings,auto:false};await backupSettings(settings);clearTimeout(saveTimer);notice='Backup automático desativado.';paint();}else{settings={ownerId:user.id,auto:true,lastSync:settings.ownerId===user.id?settings.lastSync:null};await backupSettings(settings);await syncBackup();}return;}
    busy=true;notice='';paint();
    try{
      if(action==='login'){++epoch;const result=await request('start');flow={...result,phase:'authorizing'};schedulePoll(Math.max(5,result.interval)*1000);}
      if(action==='cancel'||action==='logout'){++epoch;clearTimeout(pollTimer);clearTimeout(saveTimer);await request('logout');user=null;flow=null;settings={...settings,auto:false};await backupSettings(settings);notice='Conta desconectada neste aparelho. Seu histórico local foi mantido.';}
      if(action==='restore'){
        const result=await request('read');if(!result.backup){notice='Sua conta ainda não tem um backup do Equação.';}else{const remote=validateBackup(result.backup,user.id);await restoreBackup(remote,await bank(),user.id,await examCatalog());await options.refresh();options.broadcast?.();notice='Progresso restaurado e reunido com os dados deste aparelho.';schedule();}options.toast(notice);
      }
    }catch(error){await failed(error);}finally{busy=false;paint();}
  });
  window.addEventListener('equacao-data-changed',schedule);window.addEventListener('online',resumeFlow);window.addEventListener('focus',resumeFlow);document.addEventListener('visibilitychange',()=>{if(!document.hidden)resumeFlow();else clearTimeout(pollTimer);});window.addEventListener('android-app-resume',resumeFlow);
  try{const result=await request('status');const recovered=adoptStatus(result);if(settings.ownerId!==user?.id)settings={...settings,auto:false};if(recovered){options.showDialog('Conta e backup','<div id="github-panel"></div>');paint();schedulePoll();}schedule();}catch{notice='Conecte-se à internet para acessar sua conta GitHub.';}
  setInterval(()=>{if(!document.hidden)schedule();},120000);
}

export async function disableAutoBackup(){++backupGeneration;clearTimeout(saveTimer);settings={...settings,auto:false};await backupSettings(settings);}
