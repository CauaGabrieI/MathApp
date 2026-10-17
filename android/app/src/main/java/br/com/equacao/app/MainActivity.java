package br.com.equacao.app;

import android.app.*;
import android.content.*;
import android.graphics.Color;
import android.net.Uri;
import android.os.*;
import android.view.*;
import android.webkit.*;
import android.widget.*;
import androidx.webkit.*;
import org.json.JSONObject;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;

public class MainActivity extends androidx.activity.ComponentActivity {
    private WebView web;
    private FrameLayout root;
    private View fullscreen;
    private WebChromeClient.CustomViewCallback fullscreenCallback;
    private final ExecutorService requests=Executors.newFixedThreadPool(8);
    private NativeHttp http;
    private String pendingExport;
    private volatile String pageError;
    private int background=Color.rgb(27,25,33);
    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        root=new FrameLayout(this);root.setBackgroundColor(background);setContentView(root);
        if(Build.VERSION.SDK_INT>=30){
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((view,insets)->{android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout());view.setPadding(bars.left,bars.top,bars.right,bars.bottom);return insets;});
        } else {root.setFitsSystemWindows(true);getWindow().setStatusBarColor(background);getWindow().setNavigationBarColor(background);}
        http=new NativeHttp(this);
        web=new WebView(this);web.setBackgroundColor(background);
        root.addView(web,new FrameLayout.LayoutParams(-1,-1));
        WebSettings settings=web.getSettings();
        settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(true);settings.setSupportMultipleWindows(false);
        settings.setUserAgentString(settings.getUserAgentString()+" EquacaoAndroid/1.0");
        CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
        WebViewAssetLoader.AssetsPathHandler assets=new WebViewAssetLoader.AssetsPathHandler(this);
        WebViewAssetLoader loader=new WebViewAssetLoader.Builder().addPathHandler("/",path->assets.handle(path.isEmpty()?"index.html":path)).build();
        web.setWebViewClient(new WebViewClientCompat(){
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
                Uri uri=request.getUrl();
                if("appassets.androidplatform.net".equals(uri.getHost())){
                    if(!"https".equals(uri.getScheme()))return NativeHttp.error(403,"HTTPS obrigatório");
                    if("/api/image".equals(uri.getPath()))return http.image(uri.getQueryParameter("url"));
                    WebResourceResponse response=loader.shouldInterceptRequest(uri);
                    return response!=null?response:NativeHttp.error(404,"Recurso não encontrado");
                }
                return super.shouldInterceptRequest(view,request);
            }
            @Override public boolean onRenderProcessGone(WebView view,RenderProcessGoneDetail detail){
                root.removeView(view);web=null;view.destroy();
                new AlertDialog.Builder(MainActivity.this).setTitle("Reabrir o Equação").setCancelable(false).setMessage("O Android interrompeu a tela do app. Seu histórico continua salvo.").setPositiveButton("Reabrir",(dialog,which)->recreate()).setNegativeButton("Fechar",(dialog,which)->finish()).show();return true;
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){
                Uri uri=request.getUrl();
                if(!request.isForMainFrame())return false;
                if("https".equals(uri.getScheme())&&"appassets.androidplatform.net".equals(uri.getHost()))return false;
                openExternal(uri.toString());return true;
            }
            @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceErrorCompat error){
                if(request.isForMainFrame())pageError=WebViewFeature.isFeatureSupported(WebViewFeature.WEB_RESOURCE_ERROR_GET_DESCRIPTION)?error.getDescription().toString():"Falha ao carregar o aplicativo";
            }
        });
        web.setWebChromeClient(new WebChromeClient(){
            @Override public boolean onConsoleMessage(ConsoleMessage message){if(message.messageLevel()==ConsoleMessage.MessageLevel.ERROR)pageError=message.message();return true;}
            @Override public void onShowCustomView(View view,CustomViewCallback callback){
                if(fullscreen!=null){callback.onCustomViewHidden();return;}
                fullscreen=view;fullscreenCallback=callback;root.addView(view,new FrameLayout.LayoutParams(-1,-1));web.setVisibility(View.GONE);
            }
            @Override public void onHideCustomView(){hideFullscreen();}
        });
        if(!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            new AlertDialog.Builder(this).setTitle("Atualize o Android System WebView").setMessage("O Equação precisa de uma versão atualizada do componente de navegação do Android.").setPositiveButton("Atualizar",(dialog,which)->openExternal("https://play.google.com/store/apps/details?id=com.google.android.webview")).setNegativeButton("Fechar",(dialog,which)->finish()).show();return;
        }
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER))WebViewCompat.addWebMessageListener(web,"AndroidNetwork",Collections.singleton(NetworkPolicy.ORIGIN),(view,message,origin,mainFrame,reply)->{
            if(!mainFrame||!("https".equals(origin.getScheme())&&"appassets.androidplatform.net".equals(origin.getHost())))return;
            try{
                JSONObject input=new JSONObject(message.getData());String kind=input.optString("kind");
                if("config".equals(kind)){if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER))reply.postMessage(new JSONObject().put("id",input.getString("id")).put("systemDark",isSystemDark()).toString());return;}
                if("theme".equals(kind)){applyTheme(input.optBoolean("dark",true));return;}
                if("open".equals(kind)){openExternal(input.optString("url"));return;}
                if("export".equals(kind)){exportHistory(input.optString("body"));return;}
                if(!"fetch".equals(kind))return;
                String id=input.getString("id"),url=input.getString("url");
                requests.execute(()->{JSONObject result;
                    try{result=http.request(url).put("id",id);}catch(Exception ignored){result=new JSONObject();try{result.put("id",id).put("error","Não foi possível consultar este serviço agora.");}catch(Exception impossible){return;}}
                    final String data=result.toString();runOnUiThread(()->{if(!isFinishing()&&!isDestroyed()&&WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){try{reply.postMessage(data);}catch(IllegalStateException ignored){}}});
                });
            }catch(Exception ignored){/* Unrecognized messages never grant access to native APIs. */}
        });
        getOnBackPressedDispatcher().addCallback(this,new androidx.activity.OnBackPressedCallback(true){@Override public void handleOnBackPressed(){handleBack();}});
        web.loadUrl(NetworkPolicy.ORIGIN+"/#mapa");
    }
    private boolean isSystemDark(){return (getResources().getConfiguration().uiMode&android.content.res.Configuration.UI_MODE_NIGHT_MASK)==android.content.res.Configuration.UI_MODE_NIGHT_YES;}
    @Override public void onConfigurationChanged(android.content.res.Configuration config){super.onConfigurationChanged(config);if(web!=null)web.evaluateJavascript("if(window.EquacaoAndroid){window.EquacaoAndroid.systemDark="+isSystemDark()+";window.dispatchEvent(new Event(\"android-system-theme\"));}",null);}
    private void applyTheme(boolean dark){
        background=Color.parseColor(dark?"#1b1921":"#f8f7fc");root.setBackgroundColor(background);web.setBackgroundColor(background);
        if(Build.VERSION.SDK_INT>=30){WindowInsetsController controller=getWindow().getInsetsController();if(controller!=null)controller.setSystemBarsAppearance(dark?0:WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS|WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS,WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS|WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);}
        else {getWindow().setStatusBarColor(background);getWindow().setNavigationBarColor(background);getWindow().getDecorView().setSystemUiVisibility(dark?0:View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR|View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);}
    }
    private void openExternal(String address){
        try{Uri uri=Uri.parse(address);if(!"https".equals(uri.getScheme())||uri.getHost()==null)return;startActivity(new Intent(Intent.ACTION_VIEW,uri).addCategory(Intent.CATEGORY_BROWSABLE));}
        catch(ActivityNotFoundException ignored){Toast.makeText(this,"Nenhum aplicativo disponível para abrir o link.",Toast.LENGTH_LONG).show();}
    }
    private void exportHistory(String text){
        if(text.length()>12*1024*1024)return;
        try{new JSONObject(text);}catch(Exception ignored){return;}
        pendingExport=text;
        Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT).setType("application/json").addCategory(Intent.CATEGORY_OPENABLE).putExtra(Intent.EXTRA_TITLE,"equacao-historico.json");
        try{startActivityForResult(intent,100);}catch(ActivityNotFoundException ignored){pendingExport=null;Toast.makeText(this,"Nenhum seletor de arquivos disponível.",Toast.LENGTH_LONG).show();}
    }
    @Override protected void onActivityResult(int request,int result,Intent data){
        super.onActivityResult(request,result,data);
        if(request==100){String text=pendingExport;pendingExport=null;if(result!=RESULT_OK||data==null||data.getData()==null||text==null)return;
            try(OutputStream stream=getContentResolver().openOutputStream(data.getData())){if(stream==null)throw new IllegalStateException();stream.write(text.getBytes(StandardCharsets.UTF_8));Toast.makeText(this,"Histórico exportado.",Toast.LENGTH_SHORT).show();}
            catch(Exception ignored){Toast.makeText(this,"Não foi possível salvar o arquivo.",Toast.LENGTH_LONG).show();}
        }
    }
    private void hideFullscreen(){if(fullscreen!=null){root.removeView(fullscreen);fullscreen=null;web.setVisibility(View.VISIBLE);if(fullscreenCallback!=null)fullscreenCallback.onCustomViewHidden();fullscreenCallback=null;}}
    private void handleBack(){
        if(web==null){finish();return;}
        if(fullscreen!=null){hideFullscreen();return;}
        web.evaluateJavascript("(()=>{const d=[...document.querySelectorAll('dialog[open]')].pop();if(d){d.close();return true;}if(location.hash!=='#mapa'){location.hash='#mapa';return true;}return false;})()",handled->{if("false".equals(handled))finish();});
    }
    @Override protected void onPause(){if(web!=null){web.evaluateJavascript("document.querySelector('#learning-dialog')?.close();document.querySelectorAll('iframe').forEach(f=>f.remove());",null);web.onPause();}super.onPause();}
    @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
    @Override protected void onDestroy(){requests.shutdownNow();if(web!=null){web.loadUrl("about:blank");web.destroy();}super.onDestroy();}
    WebView testWebView(){return web;}
    String testPageError(){return pageError;}
}
