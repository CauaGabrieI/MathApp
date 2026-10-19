package br.com.equacao.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import org.json.JSONObject;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.util.function.LongSupplier;

/** Fixed GitHub actions; credentials are encrypted with a non-exportable Android Keystore key. */
final class GitHubBackup {
    private static final String KEY="equacao.github.v1",REPO="equacao-backup",FILE="equacao-backup.json";
    private static final int LIMIT=8*1024*1024;
    private final SharedPreferences prefs;
    private final String clientId;
    private JSONObject session;
    interface SessionStore { JSONObject load() throws Exception; void save(JSONObject value) throws Exception; void clear() throws Exception; }
    interface Transport { Result send(String path,String method,JSONObject body,boolean oauth,boolean raw,String token) throws Exception; }
    private final SessionStore store;
    private final Transport transport;
    private final LongSupplier clock;
    GitHubBackup(Context context) throws Exception {
        prefs=context.getSharedPreferences("github-connection",Context.MODE_PRIVATE);
        store=null;transport=null;clock=System::currentTimeMillis;
        try(InputStream in=context.getAssets().open("github-config.json")){clientId=new JSONObject(new String(read(in,4096),StandardCharsets.UTF_8)).optString("clientId");}
        session=load();
    }
    // Package-private injection is for deterministic JVM tests. The app always
    // uses the Context constructor and the encrypted Android Keystore store.
    GitHubBackup(String clientId,SessionStore store,Transport transport,LongSupplier clock) throws Exception {
        this.prefs=null;this.clientId=clientId;this.store=store;this.transport=transport;this.clock=clock;
        JSONObject loaded=store.load();session=loaded==null?new JSONObject():new JSONObject(loaded.toString());
    }
    private SecretKey key() throws Exception {
        KeyStore ks=KeyStore.getInstance("AndroidKeyStore");ks.load(null);
        if(!ks.containsAlias(KEY)){KeyGenerator gen=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");gen.init(new KeyGenParameterSpec.Builder(KEY,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT).setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).setRandomizedEncryptionRequired(true).build());return gen.generateKey();}
        return (SecretKey)ks.getKey(KEY,null);
    }
    private JSONObject load(){try{String value=prefs.getString("session",null);if(value==null)return new JSONObject();String[] parts=value.split("\\.");Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.DECRYPT_MODE,key(),new GCMParameterSpec(128,Base64.decode(parts[0],Base64.NO_WRAP)));cipher.updateAAD(KEY.getBytes(StandardCharsets.UTF_8));return new JSONObject(new String(cipher.doFinal(Base64.decode(parts[1],Base64.NO_WRAP)),StandardCharsets.UTF_8));}catch(Exception ignored){prefs.edit().clear().apply();return new JSONObject();}}
    private void save() throws Exception { save(session); }
    private void save(JSONObject value) throws Exception {
        if(store!=null)store.save(new JSONObject(value.toString()));
        else {
            Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.ENCRYPT_MODE,key());cipher.updateAAD(KEY.getBytes(StandardCharsets.UTF_8));
            String encrypted=Base64.encodeToString(cipher.getIV(),Base64.NO_WRAP)+"."+Base64.encodeToString(cipher.doFinal(value.toString().getBytes(StandardCharsets.UTF_8)),Base64.NO_WRAP);
            if(!prefs.edit().putString("session",encrypted).commit())throw new IOException("Não foi possível proteger a conexão neste aparelho.");
        }
        session=value;
    }
    private static byte[] read(InputStream in,int limit) throws IOException {if(in==null)return new byte[0];try(InputStream stream=in;ByteArrayOutputStream out=new ByteArrayOutputStream()){byte[] bytes=new byte[16384];int n;while((n=stream.read(bytes))!=-1){if(out.size()+n>limit)throw new IOException("Resposta muito grande");out.write(bytes,0,n);}return out.toByteArray();}}
    static final class Result {final int status;final JSONObject data;Result(int status,JSONObject data){this.status=status;this.data=data;}}
    private Result request(String path,String method,JSONObject body,boolean oauth,boolean raw) throws Exception {
        if(transport!=null){Result result=transport.send(path,method,body,oauth,raw,session.optString("token"));checkStatus(result.status,oauth);return result;}
        // Callers only use constant paths and a username verified by /user; never a bridge URL.
        String address=(oauth?"https://github.com":"https://api.github.com")+path;
        HttpURLConnection connection=(HttpURLConnection)new URL(address).openConnection();
        connection.setInstanceFollowRedirects(false);connection.setConnectTimeout(10000);connection.setReadTimeout(12000);connection.setRequestMethod(method);
        connection.setRequestProperty("Accept",raw?"application/vnd.github.raw+json":"application/json");connection.setRequestProperty("User-Agent","Equacao-Backup");
        if(!oauth){connection.setRequestProperty("Authorization","Bearer "+session.getString("token"));connection.setRequestProperty("X-GitHub-Api-Version","2022-11-28");}
        try{
            if(body!=null){connection.setDoOutput(true);connection.setRequestProperty("Content-Type","application/json");try(OutputStream out=connection.getOutputStream()){out.write(body.toString().getBytes(StandardCharsets.UTF_8));}}
            int code=connection.getResponseCode();if(code>=300&&code<400)throw new IOException("Redirecionamento recusado");
            checkStatus(code,oauth);
            byte[] bytes=read(code>=400?connection.getErrorStream():connection.getInputStream(),oauth?16384:12*1024*1024);
            JSONObject data;try{data=new JSONObject(new String(bytes,StandardCharsets.UTF_8));}catch(Exception ignored){data=new JSONObject();}return new Result(code,data);
        }finally{connection.disconnect();}
    }
    private void checkStatus(int status,boolean oauth) throws Exception {
        if(status==401&&!oauth){logout();throw new BackupError("Sua autorização expirou ou foi revogada. Conecte o GitHub novamente.",401);}
        if(status==403||status==429)throw new BackupError("GitHub indisponível por limite de acesso ou permissão. Tente novamente mais tarde.",status);
    }
    private JSONObject api(String path) throws Exception {Result r=request(path,"GET",null,false,false);if(r.status!=200)throw new BackupError("Não foi possível identificar sua conta GitHub.",502);return r.data;}
    private static JSONObject profile(JSONObject data) throws Exception {long id=data.optLong("id");String login=data.optString("login");if(id<=0||!login.matches("[-a-zA-Z0-9_]{1,39}"))throw new BackupError("Conta GitHub inválida.",502);return new JSONObject().put("id",id).put("login",login);}
    private String path() throws Exception {return "/repos/"+session.getJSONObject("user").getString("login")+"/"+REPO;}
    private void validate(JSONObject data) throws Exception {if(!"br.com.equacao.app".equals(data.optString("app"))||(data.optInt("schemaVersion")!=1&&data.optInt("schemaVersion")!=2)||data.optLong("ownerId")!=session.getJSONObject("user").getLong("id")||data.optJSONArray("records")==null||data.optJSONArray("learningEntries")==null||data.toString().getBytes(StandardCharsets.UTF_8).length>LIMIT)throw new BackupError("Backup inválido ou pertencente a outra conta. Nenhum dado foi alterado.",400);}
    private boolean repository() throws Exception {Result r=request(path(),"GET",null,false,false);if(r.status==404)return false;if(r.status!=200)throw new BackupError("Não foi possível consultar o repositório de backup.",502);if(!r.data.optBoolean("private")||r.data.optJSONObject("owner")==null||r.data.getJSONObject("owner").optLong("id")!=session.getJSONObject("user").getLong("id")||r.data.optBoolean("fork")||r.data.optBoolean("archived"))throw new BackupError("equacao-backup precisa ser um repositório privado, da sua conta e disponível. Nenhum arquivo foi alterado.",400);return true;}
    private void logout() throws Exception {
        if(store!=null)store.clear();
        else if(!prefs.edit().clear().commit())throw new IOException("Não foi possível remover a conexão neste aparelho.");
        session=new JSONObject();
    }
    private boolean hasToken(long now){return !session.optString("token").isEmpty()&&session.optLong("expires")>now;}
    private JSONObject copy() throws Exception {return new JSONObject(session.toString());}
    private void cleanExpired(long now) throws Exception {
        JSONObject next=copy();boolean changed=false;
        if(next.has("token")&&next.optLong("expires")<=now){for(String name:new String[]{"token","user","expires","createdRepoId"})next.remove(name);changed=true;}
        JSONObject device=next.optJSONObject("device");
        if(device!=null&&device.optLong("expires")<=now&&next.optString("token").isEmpty()){next.remove("device");changed=true;}
        if(changed)save(next);
    }
    private JSONObject publicFlow(long now) throws Exception {
        JSONObject device=session.optJSONObject("device");boolean finishing=hasToken(now)&&!session.has("user");
        if(device==null&&!finishing)return null;
        return new JSONObject().put("userCode",device==null?"":device.optString("userCode"))
            .put("verificationUri","https://github.com/login/device")
            .put("expiresAt",finishing?session.optLong("expires"):device.optLong("expires"))
            .put("interval",device==null?5:Math.max(5,device.optInt("interval",5)))
            .put("nextPollAt",device==null?0:device.optLong("next"))
            .put("phase",finishing?"finishing":"authorizing");
    }
    private JSONObject finishProfile() throws Exception {
        JSONObject user=profile(api("/user")),next=copy();next.put("user",user);next.remove("device");save(next);
        return new JSONObject().put("user",user);
    }
    synchronized JSONObject action(String action,JSONObject input) throws Exception {
        long now=clock.getAsLong();
        if("logout".equals(action)){logout();return new JSONObject().put("user",JSONObject.NULL);}
        if("status".equals(action)){
            cleanExpired(now);JSONObject result=new JSONObject().put("configured",clientId.matches("[a-zA-Z0-9]{10,100}")).put("user",session.opt("user")==null?JSONObject.NULL:session.opt("user"));
            JSONObject flow=publicFlow(now);if(flow!=null)result.put("flow",flow);return result;
        }
        if("start".equals(action)){
            if(!clientId.matches("[a-zA-Z0-9]{10,100}"))throw new BackupError("O login GitHub ainda não foi configurado.",503);
            Result r=request("/login/device/code","POST",new JSONObject().put("client_id",clientId).put("scope","repo"),true,false);JSONObject d=r.data;
            if(r.status!=200||d.optString("device_code").isEmpty()||d.optString("user_code").isEmpty()||!"https://github.com/login/device".equals(d.optString("verification_uri")))throw new BackupError("Não foi possível iniciar o login. Confira se Device Flow está habilitado.",502);
            now=clock.getAsLong();int interval=Math.max(5,d.optInt("interval",5));
            JSONObject device=new JSONObject().put("code",d.getString("device_code")).put("userCode",d.getString("user_code")).put("interval",interval)
                .put("expires",now+Math.max(1,Math.min(900,d.optInt("expires_in",900)))*1000L).put("next",now+interval*1000L);
            save(new JSONObject().put("device",device));return publicFlow(now);
        }
        if("poll".equals(action)){
            cleanExpired(now);
            if(hasToken(now)){if(session.has("user"))return new JSONObject().put("user",session.getJSONObject("user"));return finishProfile();}
            JSONObject device=session.optJSONObject("device");
            if(device==null)throw new BackupError("O código expirou. Inicie a conexão novamente.",400);
            if(now<device.optLong("next"))return new JSONObject().put("pending",true).put("interval",Math.max(1,(device.optLong("next")-now+999)/1000));
            int interval=Math.max(5,device.optInt("interval",5));JSONObject next=copy();next.getJSONObject("device").put("next",now+interval*1000L);save(next);
            Result r=request("/login/oauth/access_token","POST",new JSONObject().put("client_id",clientId).put("device_code",device.getString("code")).put("grant_type","urn:ietf:params:oauth:grant-type:device_code"),true,false);JSONObject d=r.data;String error=d.optString("error");
            if("authorization_pending".equals(error)||"slow_down".equals(error)){
                if("slow_down".equals(error))interval+=5;next=copy();next.getJSONObject("device").put("interval",interval).put("next",clock.getAsLong()+interval*1000L);save(next);
                return new JSONObject().put("pending",true).put("interval",interval);
            }
            if("access_denied".equals(error)||"expired_token".equals(error)||"bad_verification_code".equals(error)){
                next=copy();next.remove("device");save(next);throw new BackupError("access_denied".equals(error)?"Você cancelou a autorização no GitHub.":"Código expirado ou inválido. Inicie a conexão novamente.",400);
            }
            if(r.status!=200||d.optString("access_token").isEmpty())throw new BackupError("Não foi possível concluir a conexão. Volte ao app para tentar verificar novamente.",502);
            if(!java.util.Arrays.asList(d.optString("scope").split("[ ,]+" )).contains("repo")){
                next=copy();next.remove("device");save(next);throw new BackupError("A permissão de backup privado não foi concedida.",400);
            }
            next=copy();next.put("token",d.getString("access_token")).put("expires",clock.getAsLong()+Math.max(1,Math.min(2592000,d.optLong("expires_in",2592000)))*1000L);
            // Preserve an issued token before /user: an interrupted profile
            // request must not force the student to authorize a second code.
            save(next);return finishProfile();
        }
        if(session.optLong("expires")<=now||!session.has("token")||!session.has("user"))throw new BackupError("Conecte sua conta GitHub novamente.",401);
        if(!"read".equals(action)&&!"write".equals(action))throw new BackupError("Operação inválida.",400);
        boolean exists=repository();
        if("read".equals(action)){
            if(!exists)return new JSONObject().put("backup",JSONObject.NULL).put("sha",JSONObject.NULL);
            Result metadata=request(path()+"/contents/"+FILE,"GET",null,false,false);
            if(metadata.status==404&&session.has("createdRepoId")&&api(path()).optLong("id")==session.optLong("createdRepoId"))return new JSONObject().put("backup",JSONObject.NULL).put("sha",JSONObject.NULL);
            if(metadata.status==404)throw new BackupError("Já existe equacao-backup sem um backup reconhecido. Renomeie esse repositório para evitar sobrescrever seus arquivos.",400);
            if(metadata.status!=200||metadata.data.optLong("size")>LIMIT||metadata.data.optString("sha").isEmpty())throw new BackupError("Não foi possível ler o backup.",502);
            Result raw=request(path()+"/contents/"+FILE,"GET",null,false,true);if(raw.status!=200)throw new BackupError("Não foi possível ler o backup.",502);validate(raw.data);
            return new JSONObject().put("backup",raw.data).put("sha",metadata.data.getString("sha"));
        }
        JSONObject backup=input.getJSONObject("backup");validate(backup);String sha=input.isNull("sha")?null:input.optString("sha");if(sha!=null&&!sha.matches("[a-f0-9]{40,64}"))throw new BackupError("Versão de backup inválida.",400);
        if(!exists){if(sha!=null)throw new BackupError("O backup remoto mudou. Tente novamente.",409);Result created=request("/user/repos","POST",new JSONObject().put("name",REPO).put("private",true).put("description","Backup privado do aplicativo Equação"),false,false);if(created.status==422)throw new BackupError("O repositório mudou. Tente novamente.",409);if(created.status!=201||!created.data.optBoolean("private")||created.data.optJSONObject("owner")==null||created.data.getJSONObject("owner").optLong("id")!=session.getJSONObject("user").getLong("id"))throw new BackupError("Não foi possível criar o repositório privado.",502);session.put("createdRepoId",created.data.getLong("id"));save();}
        else{Result current=request(path()+"/contents/"+FILE,"GET",null,false,true);if(current.status==404){if(api(path()).optLong("id")!=session.optLong("createdRepoId",-1))throw new BackupError("Repositório existente sem backup reconhecido. Nenhum arquivo foi alterado.",400);}else if(current.status==200)validate(current.data);else throw new BackupError("Não foi possível conferir o backup remoto.",502);}
        JSONObject body=new JSONObject().put("message","Atualizar progresso do Equação").put("content",Base64.encodeToString(backup.toString().getBytes(StandardCharsets.UTF_8),Base64.NO_WRAP));if(sha!=null)body.put("sha",sha);
        Result saved=request(path()+"/contents/"+FILE,"PUT",body,false,false);if(saved.status==409||saved.status==422)throw new BackupError("O backup mudou em outro aparelho. Tente novamente.",409);if(saved.status!=200&&saved.status!=201)throw new BackupError("Não foi possível salvar o backup.",502);
        return new JSONObject().put("sha",saved.data.getJSONObject("content").getString("sha")).put("savedAt",now);
    }
    static final class BackupError extends Exception {final int status;BackupError(String message,int status){super(message);this.status=status;}}
}
