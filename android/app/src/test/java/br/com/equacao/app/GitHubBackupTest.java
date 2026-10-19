package br.com.equacao.app;

import org.json.JSONObject;
import org.junit.Test;
import java.util.*;
import java.util.function.LongSupplier;
import static org.junit.Assert.*;

public class GitHubBackupTest {
  static class Store implements GitHubBackup.SessionStore {
    JSONObject v; boolean fail;
    public JSONObject load() throws Exception {return v==null?null:new JSONObject(v.toString());}
    public void save(JSONObject x) throws Exception {if(fail) throw new Exception("save"); v=new JSONObject(x.toString());}
    public void clear(){v=null;}
  }
  static class Clock implements LongSupplier {long now; public long getAsLong(){return now;}}
  static class Wire implements GitHubBackup.Transport {
    final List<String> paths=new ArrayList<>(); final Deque<GitHubBackup.Result> q=new ArrayDeque<>();
    public GitHubBackup.Result send(String p,String m,JSONObject b,boolean o,boolean raw,String t){paths.add(p);return q.removeFirst();}
    void add(int s,JSONObject d){q.add(new GitHubBackup.Result(s,d));}
  }
  static JSONObject d(String s){try{return new JSONObject(s);}catch(Exception e){throw new AssertionError(e);}}
  @Test public void pendingDeviceSurvivesRecreationAndStatusDoesNotEraseIt() throws Exception {
    Store s=new Store(); Clock c=new Clock(); Wire w=new Wire();
    w.add(200,d("{device_code:'hidden',user_code:'ABCD-EFGH',verification_uri:'https://github.com/login/device',expires_in:900,interval:1}"));
    GitHubBackup a=new GitHubBackup("Ov23abc123456789",s,w,c); JSONObject f=a.action("start",new JSONObject());
    assertEquals("ABCD-EFGH",f.getString("userCode")); assertTrue(s.v.has("device")); assertFalse(f.toString().contains("hidden"));
    GitHubBackup b=new GitHubBackup("Ov23abc123456789",s,w,c); assertEquals("authorizing",b.action("status",new JSONObject()).getJSONObject("flow").getString("phase"));
  }
  @Test public void minimumIntervalAndSlowDownArePersisted() throws Exception {
    Store s=new Store(); Clock c=new Clock(); Wire w=new Wire();
    w.add(200,d("{device_code:'x',user_code:'U',verification_uri:'https://github.com/login/device',expires_in:900,interval:1}"));
    GitHubBackup g=new GitHubBackup("Ov23abc123456789",s,w,c);g.action("start",new JSONObject());c.now=5000;
    w.add(200,d("{error:'slow_down'}")); JSONObject p=g.action("poll",new JSONObject()); assertTrue(p.getBoolean("pending")); assertEquals(10,p.getInt("interval")); assertEquals(15_000L,s.v.getJSONObject("device").getLong("next"));
  }
  @Test public void pollBeforeIntervalDoesNotCallTransport() throws Exception {
    Store s=new Store(); Clock c=new Clock(); Wire w=new Wire();
    w.add(200,d("{device_code:'fixture-device',user_code:'U',verification_uri:'https://github.com/login/device',expires_in:900,interval:5}"));
    GitHubBackup g=new GitHubBackup("Ov23abc123456789",s,w,c);g.action("start",new JSONObject());assertEquals(1,w.paths.size());
    JSONObject p=g.action("poll",new JSONObject());assertTrue(p.getBoolean("pending"));assertEquals(1,w.paths.size());
  }
  @Test public void expiredFlowAndLogoutClearStore() throws Exception {
    Store s=new Store(); Clock c=new Clock(); Wire w=new Wire();
    w.add(200,d("{device_code:'fixture-device',user_code:'U',verification_uri:'https://github.com/login/device',expires_in:1,interval:5}"));
    GitHubBackup g=new GitHubBackup("Ov23abc123456789",s,w,c);g.action("start",new JSONObject());c.now=2000;
    JSONObject st=g.action("status",new JSONObject());assertFalse(st.has("flow"));assertFalse(s.v.has("device"));g.action("logout",new JSONObject());assertNull(s.v);
  }
  @Test public void saveFailureDoesNotPublishFlow() throws Exception {
    Store s=new Store();s.fail=true;Clock c=new Clock();Wire w=new Wire();
    w.add(200,d("{device_code:'fixture-device',user_code:'U',verification_uri:'https://github.com/login/device',expires_in:900,interval:5}"));
    GitHubBackup g=new GitHubBackup("Ov23abc123456789",s,w,c);try{g.action("start",new JSONObject());fail();}catch(Exception ignored){}assertNull(s.v);
  }
  @Test public void invalidScopeDoesNotConnect() throws Exception {
    Store s=new Store();Clock c=new Clock();Wire w=new Wire();
    w.add(200,d("{device_code:'fixture-device',user_code:'U',verification_uri:'https://github.com/login/device',expires_in:900,interval:5}"));
    GitHubBackup g=new GitHubBackup("Ov23abc123456789",s,w,c);g.action("start",new JSONObject());c.now=5000;w.add(200,d("{access_token:'fixture-token',scope:'read',expires_in:900}"));
    try{g.action("poll",new JSONObject());fail();}catch(GitHubBackup.BackupError ignored){}assertFalse(s.v.has("token"));
  }
  @Test public void tokenIsSavedWhenProfileFailsAndNextPollUsesIt() throws Exception {
    Store s=new Store(); Clock c=new Clock(); Wire w=new Wire();
    w.add(200,d("{device_code:'x',user_code:'U',verification_uri:'https://github.com/login/device',expires_in:900,interval:5}"));
    GitHubBackup g=new GitHubBackup("Ov23abc123456789",s,w,c);g.action("start",new JSONObject());c.now=5000;
    w.add(200,d("{access_token:'secret',scope:'repo',expires_in:900}")); w.add(502,new JSONObject());
    try{g.action("poll",new JSONObject());fail();}catch(GitHubBackup.BackupError e){assertEquals(502,e.status);} assertTrue(s.v.has("token"));
    w.add(200,d("{id:7,login:'student'}")); JSONObject ok=g.action("poll",new JSONObject());assertEquals("student",ok.getJSONObject("user").getString("login"));assertFalse(ok.toString().contains("secret"));
  }
  @Test public void denialClearsPendingAndBackupsNeverRunUnauthenticated() throws Exception {
    Store s=new Store(); Clock c=new Clock(); Wire w=new Wire();
    w.add(200,d("{device_code:'x',user_code:'U',verification_uri:'https://github.com/login/device',expires_in:900,interval:5}"));
    GitHubBackup g=new GitHubBackup("Ov23abc123456789",s,w,c);g.action("start",new JSONObject());c.now=5000;w.add(400,d("{error:'access_denied'}"));
    try{g.action("poll",new JSONObject());fail();}catch(GitHubBackup.BackupError ignored){} assertFalse(s.v.has("device"));
    try{g.action("read",new JSONObject());fail();}catch(GitHubBackup.BackupError ignored){} assertEquals(2,w.paths.size());
  }
}
