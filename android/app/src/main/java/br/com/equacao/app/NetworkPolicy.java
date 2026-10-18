package br.com.equacao.app;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.HashSet;
import java.util.Arrays;

public final class NetworkPolicy {
    public static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final Set<String> CHANNELS = new HashSet<>(Arrays.asList("umbertomann", "PedroAssaad", "UniversoNarrado", "MétodoQuestiona", "paulojubilut", "sandrocuriodicasdemat", "Giscomgiz", "UniversoMilitares", "professorferretto"));
    private static final Set<String> IMAGE_HOSTS = new HashSet<>(Arrays.asList("img.enemhub.com.br", "enem.dev", "api.enem.dev"));
    private NetworkPolicy() {}
    private static URI parsed(String url) {
        try {
            URI uri = new URI(url);
            if (!"https".equals(uri.getScheme()) || uri.getHost() == null || uri.getUserInfo() != null || uri.getFragment() != null || (uri.getPort() != -1 && uri.getPort() != 443)) return null;
            return uri;
        } catch (Exception ignored) { return null; }
    }
    public static boolean allowsImage(String url) {
        URI uri = parsed(url);
        return uri != null && IMAGE_HOSTS.contains(uri.getHost());
    }
    public static boolean allowsApi(String url) {
        URI uri = parsed(url);
        if (uri == null) return false;
        if ("api.enem.dev".equals(uri.getHost())) return uri.getPath().matches("/v1/exams/[0-9]{4}/questions/[0-9]{1,3}");
        if (!"www.youtube.com".equals(uri.getHost())) return false;
        String path;try {path=URLDecoder.decode(uri.getRawPath(), "UTF-8");}catch(Exception ignored){return false;}
        if ("/oembed".equals(path)) return true;
        for (String handle : CHANNELS) if (path.equals("/@" + handle + "/search")) return true;
        return false;
    }
}
