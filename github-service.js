// Server-only GitHub connection. Tokens never enter the browser bundle or a backup.
const GH_REPO='equacao-backup',GH_FILE='equacao-backup.json',GH_MAX=8*1024*1024;
const ghError=(message,status=400)=>Object.assign(new Error(message),{status});
async function ghRequest(path,session,{method='GET',body,fetchImpl=fetch,raw=false}={}){
  const response=await fetchImpl('https://api.github.com'+path,{method,redirect:'error',headers:{Accept:raw?'application/vnd.github.raw+json':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Equacao-Backup',Authorization:'Bearer '+session.token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(12000)});
  if(response.status===401)throw ghError('Sua autorização expirou ou foi revogada. Conecte o GitHub novamente.',401);
  if(response.status===403||response.status===429)throw ghError('O GitHub limitou o acesso ou a conta não concedeu a permissão necessária. Tente mais tarde.',response.status);
  const text=await ghRead(response,12*1024*1024);let data;try{data=JSON.parse(text);}catch{data=null;}return {status:response.status,data};
}
async function ghRead(response,limit){if(Number(response.headers.get('content-length'))>limit)throw ghError('Resposta muito grande.',413);const reader=response.body?.getReader();if(!reader)return '';let size=0;const parts=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw ghError('Resposta muito grande.',413);}parts.push(value);}const all=new Uint8Array(size);let pos=0;for(const p of parts){all.set(p,pos);pos+=p.length;}return new TextDecoder().decode(all);}
function ghProfile(data){if(!Number.isSafeInteger(data?.id)||data.id<=0||!/^[-\w]{1,39}$/.test(data.login??''))throw ghError('Não foi possível identificar a conta GitHub.',502);return {id:data.id,login:data.login};}
function ghValidatePayload(value,owner){if(value?.app!=='br.com.equacao.app'||![1,2].includes(value.schemaVersion)||value.ownerId!==owner||!Array.isArray(value.records)||!Array.isArray(value.learningEntries)||new TextEncoder().encode(JSON.stringify(value)).length>GH_MAX)throw ghError('Backup inválido ou pertencente a outra conta.');return value;}
const ghPath=session=>'/repos/'+encodeURIComponent(session.user.login)+'/'+GH_REPO;
async function ghCheckRepo(session,fetchImpl){const r=await ghRequest(ghPath(session),session,{fetchImpl});if(r.status===404)return false;if(r.status!==200)throw ghError('Não foi possível consultar o repositório de backup.',502);if(r.data?.private!==true||r.data.owner?.id!==session.user.id||r.data.archived||r.data.fork)throw ghError('O repositório equacao-backup precisa ser privado, da sua conta e estar disponível. Nenhum arquivo foi alterado.');return true;}
export async function githubAction(session,action,input={},options={}){
  const fetchImpl=options.fetchImpl??fetch,now=options.now??Date.now(),clientId=options.clientId;
  if(action==='status')return {configured:Boolean(clientId),user:session.user??null};
  if(action==='logout'){for(const key of Object.keys(session))delete session[key];return {user:null};}
  if(action==='start'){
    if(!clientId)throw ghError('O login GitHub ainda não foi configurado.',503);
    const r=await fetchImpl('https://github.com/login/device/code',{method:'POST',redirect:'error',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:clientId,scope:'repo'}),signal:AbortSignal.timeout(12000)}),d=JSON.parse(await ghRead(r,16384));
    if(!r.ok||!d.device_code||!d.user_code||d.verification_uri!=='https://github.com/login/device')throw ghError('Não foi possível iniciar o login. Verifique se Device Flow está habilitado no OAuth App.',502);
    session.device={code:d.device_code,interval:Math.max(5,Number(d.interval)||5),expires:now+Math.min(900,Number(d.expires_in)||900)*1000,next:now+Math.max(5,Number(d.interval)||5)*1000};
    return {userCode:d.user_code,verificationUri:d.verification_uri,interval:session.device.interval,expiresAt:session.device.expires};
  }
  if(action==='poll'){
    const d=session.device;if(!d||d.expires<=now){delete session.device;throw ghError('O código expirou. Inicie a conexão novamente.');}if(now<d.next)return {pending:true,interval:Math.max(1,Math.ceil((d.next-now)/1000))};
    const r=await fetchImpl('https://github.com/login/oauth/access_token',{method:'POST',redirect:'error',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:clientId,device_code:d.code,grant_type:'urn:ietf:params:oauth:grant-type:device_code'}),signal:AbortSignal.timeout(12000)}),data=JSON.parse(await ghRead(r,16384));
    if(data.error==='authorization_pending'||data.error==='slow_down'){if(data.error==='slow_down')d.interval+=5;d.next=now+d.interval*1000;return {pending:true,interval:d.interval};}
    if(!r.ok||!data.access_token){delete session.device;throw ghError(data.error==='access_denied'?'Você cancelou a autorização no GitHub.':'Código expirado ou inválido. Inicie a conexão novamente.');}
    if(!String(data.scope??'').split(/[ ,]+/).includes('repo'))throw ghError('A permissão para o backup privado não foi concedida.');
    const candidate={token:data.access_token},profile=await ghRequest('/user',candidate,{fetchImpl});if(profile.status!==200)throw ghError('Não foi possível identificar a conta GitHub.',502);
    session.token=data.access_token;session.user=ghProfile(profile.data);session.expires=now+Math.min(2592000,Number(data.expires_in)||2592000)*1000;delete session.device;return {user:session.user};
  }
  if(!session.token||!session.user||session.expires<=now)throw ghError('Conecte sua conta GitHub novamente.',401);
  if(!['read','write'].includes(action))throw ghError('Operação inválida.');
  const exists=await ghCheckRepo(session,fetchImpl);
  if(action==='read'){
    if(!exists)return {backup:null,sha:null};
    const meta=await ghRequest(ghPath(session)+'/contents/'+GH_FILE,session,{fetchImpl});
    if(meta.status===404&&session.createdRepoId){const info=await ghRequest(ghPath(session),session,{fetchImpl});if(info.data?.id===session.createdRepoId)return {backup:null,sha:null};}
    if(meta.status===404)throw ghError('Já existe um repositório equacao-backup sem um backup reconhecido. Renomeie esse repositório para evitar sobrescrever seus arquivos.');
    if(meta.status!==200||typeof meta.data?.sha!=='string'||meta.data.size>GH_MAX)throw ghError('Não foi possível ler o backup.',502);
    const raw=await ghRequest(ghPath(session)+'/contents/'+GH_FILE,session,{fetchImpl,raw:true});
    if(raw.status!==200)throw ghError('Não foi possível ler o backup.',502);
    return {backup:ghValidatePayload(raw.data,session.user.id),sha:meta.data.sha};
  }
  const backup=ghValidatePayload(input.backup,session.user.id);if(input.sha!==null&&!/^[a-f0-9]{40,64}$/.test(input.sha??''))throw ghError('Versão de backup inválida.');
  if(!exists){if(input.sha!==null)throw ghError('O backup remoto mudou. Tente novamente.',409);const made=await ghRequest('/user/repos',session,{method:'POST',fetchImpl,body:{name:GH_REPO,private:true,description:'Backup privado do aplicativo Equação'}});if(made.status===422)throw ghError('O repositório mudou. Tente novamente.',409);if(made.status!==201||made.data?.private!==true||made.data.owner?.id!==session.user.id)throw ghError('Não foi possível criar o repositório privado.',502);session.createdRepoId=made.data.id;}
  else {const current=await ghRequest(ghPath(session)+'/contents/'+GH_FILE,session,{fetchImpl,raw:true});if(current.status===404){const info=await ghRequest(ghPath(session),session,{fetchImpl});if(info.data?.id!==session.createdRepoId)throw ghError('Repositório existente sem backup reconhecido. Nenhum arquivo foi alterado.');}else if(current.status===200)ghValidatePayload(current.data,session.user.id);else throw ghError('Não foi possível conferir o backup remoto.',502);}
  const encoded=ghBase64(new TextEncoder().encode(JSON.stringify(backup)));
  const result=await ghRequest(ghPath(session)+'/contents/'+GH_FILE,session,{method:'PUT',fetchImpl,body:{message:'Atualizar progresso do Equação',content:encoded,...(input.sha?{sha:input.sha}:{})}});
  if(result.status===409||result.status===422)throw ghError('O backup mudou em outro aparelho. Tente novamente.',409);
  if(![200,201].includes(result.status))throw ghError('Não foi possível salvar o backup.',502);return {sha:result.data?.content?.sha,savedAt:now};
}
function ghBase64(bytes){let text='';for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(text);}
async function ghKey(secret){if(!/^[a-f0-9]{64}$/i.test(secret??''))throw ghError('O servidor de conexão ainda não foi configurado.',503);return crypto.subtle.importKey('raw',Uint8Array.from(secret.match(/../g),v=>parseInt(v,16)),{name:'AES-GCM'},false,['encrypt','decrypt']);}
async function ghSeal(value,key){const iv=crypto.getRandomValues(new Uint8Array(12)),cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:new TextEncoder().encode('equacao-github-v1')},key,new TextEncoder().encode(JSON.stringify(value))));return ghBase64(iv)+'.'+ghBase64(cipher);}
async function ghUnseal(cookie,key){try{if(!cookie||cookie.length>16000)return {};const [iv,body]=cookie.split('.'),decode=x=>Uint8Array.from(atob(x),c=>c.charCodeAt(0));return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(iv),additionalData:new TextEncoder().encode('equacao-github-v1')},key,decode(body))));}catch{return {};}}
export async function githubRoute(request,env,clientId){
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, private','Vary':'Cookie','X-Content-Type-Options':'nosniff'};let session={},key;
  try{
    const url=new URL(request.url);if(request.method!=='POST')throw ghError('Método não permitido.',405);
    if(request.headers.get('Origin')!==url.origin||!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')??'')||['cross-site','same-site'].includes(request.headers.get('Sec-Fetch-Site')))throw ghError('Origem da solicitação inválida.',403);
    if(!clientId||!env.GITHUB_SESSION_KEY){if(url.pathname==='/api/github/status')return new Response(JSON.stringify({configured:false,user:null}),{headers});throw ghError('A conexão GitHub ainda não foi configurada.',503);}
    key=await ghKey(env.GITHUB_SESSION_KEY);const cookie=request.headers.get('Cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith('__Host-equacao-github='))?.slice('__Host-equacao-github='.length);session=await ghUnseal(cookie,key);
    const input=JSON.parse(await ghRead(request,GH_MAX+100000));const action=url.pathname.slice('/api/github/'.length);if(session.expires<=Date.now()){delete session.token;delete session.user;}
    const result=await githubAction(session,action,input,{clientId});headers['Set-Cookie']=action==='logout'?'__Host-equacao-github=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0':'__Host-equacao-github='+await ghSeal(session,key)+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000';
    return new Response(JSON.stringify(result),{headers});
  }catch(error){if(error.status===401)headers['Set-Cookie']='__Host-equacao-github=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';else if(key)headers['Set-Cookie']='__Host-equacao-github='+await ghSeal(session,key)+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000';return new Response(JSON.stringify({error:error.status?error.message:'Não foi possível conectar ao GitHub. Verifique sua conexão e tente novamente.'}),{status:error.status??502,headers});}
}
