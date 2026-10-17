package br.com.equacao.app;

import android.content.Context;
import android.webkit.WebResourceResponse;
import org.json.JSONObject;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.util.*;

final class NativeHttp {
    private final File imageCache;
    NativeHttp(Context context) { imageCache = new File(context.getCacheDir(), "question-images"); imageCache.mkdirs(); }
    private static byte[] readLimited(InputStream input, int limit) throws IOException {
        if (input == null) return new byte[0];
        try (InputStream stream = input; ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[16384]; int size;
            while ((size = stream.read(buffer)) != -1) { if (out.size() + size > limit) throw new IOException("Resposta muito grande"); out.write(buffer, 0, size); }
            return out.toByteArray();
        }
    }
    static final class Result { final int status; final String type; final byte[] body; Result(int s, String t, byte[] b) { status=s;type=t;body=b; } }
    private Result get(String address, boolean image, int redirects) throws IOException {
        if (redirects > 3 || !(image ? NetworkPolicy.allowsImage(address) : NetworkPolicy.allowsApi(address))) throw new IOException("Origem não permitida");
        HttpURLConnection connection = (HttpURLConnection) new URL(address).openConnection();
        connection.setInstanceFollowRedirects(false);
        connection.setConnectTimeout(7000); connection.setReadTimeout(image ? 15000 : 7000);
        connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36 Equacao/1.0");
        connection.setRequestProperty("Accept-Language", "pt-BR,pt;q=0.9");
        try {
            int status=connection.getResponseCode();
            if (status>=300 && status<400) {
                String location=connection.getHeaderField("Location");
                if(location==null) throw new IOException("Redirecionamento inválido");
                return get(new URL(new URL(address),location).toString(),image,redirects+1);
            }
            String type=connection.getContentType(); if(type==null)type="application/octet-stream";
            if(image && (!type.toLowerCase(Locale.ROOT).matches("image/(png|jpeg|webp|gif|avif)(;.*)?") || status!=200))throw new IOException("Imagem indisponível");
            return new Result(status,type,readLimited(status>=400?connection.getErrorStream():connection.getInputStream(), image?10*1024*1024:5*1024*1024));
        } finally { connection.disconnect(); }
    }
    JSONObject request(String address) throws Exception {
        Result r=get(address,false,0);
        return new JSONObject().put("status",r.status).put("type",r.type).put("body",new String(r.body,StandardCharsets.UTF_8));
    }
    WebResourceResponse image(String address) {
        try {
            if(!NetworkPolicy.allowsImage(address))return error(403,"Origem não permitida");
            byte[] hash=MessageDigest.getInstance("SHA-256").digest(address.getBytes(StandardCharsets.UTF_8));
            StringBuilder name=new StringBuilder();for(byte b:hash)name.append(String.format(Locale.ROOT,"%02x",b));
            File data=new File(imageCache,name+".data"),typeFile=new File(imageCache,name+".type");
            if(data.isFile()&&typeFile.isFile()) {
                data.setLastModified(System.currentTimeMillis());
                return imageResponse(new String(Files.readAllBytes(typeFile.toPath()),StandardCharsets.UTF_8),new FileInputStream(data));
            }
            Result result=get(address,true,0);
            Files.write(data.toPath(),result.body);Files.write(typeFile.toPath(),result.type.getBytes(StandardCharsets.UTF_8));
            trimCache(); return imageResponse(result.type,new ByteArrayInputStream(result.body));
        } catch(Exception ignored) { return error(503,"Imagem indisponível. Conecte-se à internet para carregá-la."); }
    }
    private void trimCache() {
        File[] files=imageCache.listFiles((dir,name)->name.endsWith(".data"));if(files==null)return;
        Arrays.sort(files,Comparator.comparingLong(File::lastModified));long total=0;for(File f:files)total+=f.length();
        for(File f:files){if(total<=64L*1024*1024)break;total-=f.length();new File(imageCache,f.getName().replace(".data",".type")).delete();f.delete();}
    }
    private WebResourceResponse imageResponse(String type,InputStream body) {
        return new WebResourceResponse(type.split(";")[0],null,200,"OK",headers("max-age=604800"),body);
    }
    private static Map<String,String> headers(String cache){Map<String,String> h=new HashMap<>();h.put("Cache-Control",cache);h.put("X-Content-Type-Options","nosniff");return h;}
    static WebResourceResponse error(int status,String message) {
        return new WebResourceResponse("text/plain","UTF-8",status,"Unavailable",headers("no-store"),new ByteArrayInputStream(message.getBytes(StandardCharsets.UTF_8)));
    }
}
