package br.com.equacao.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.widget.Toast;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Checks only public releases. Download and installation always require user actions. */
final class GitHubUpdates implements AutoCloseable {
    private final Activity activity;
    private final SharedPreferences preferences;
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final Handler main = new Handler(Looper.getMainLooper());
    private boolean checking, resumed, closed;
    private boolean dark;
    private Result pending;
    private AlertDialog dialog;

    GitHubUpdates(Activity activity) {
        this.activity = activity;
        dark = (activity.getResources().getConfiguration().uiMode & android.content.res.Configuration.UI_MODE_NIGHT_MASK) == android.content.res.Configuration.UI_MODE_NIGHT_YES;
        preferences = activity.getSharedPreferences("github-updates", Context.MODE_PRIVATE);
    }
    void setDark(boolean dark) { this.dark = dark; }

    void onResume() {
        resumed = true;
        if (pending != null) { Result ready = pending; pending = null; show(ready); }
        check(false);
    }
    void onPause() { resumed = false; }

    void check(boolean manual) {
        if (closed || activity.isFinishing() || activity.isDestroyed()) return;
        if (checking) { if (manual) toast("Já estamos verificando atualizações…"); return; }
        if (dialog != null && dialog.isShowing()) return;
        long now = System.currentTimeMillis();
        long next = preferences.getLong("nextCheckAt", 0);
        // Also recover if the device clock was moved backwards.
        if (!manual && next > now && next - now <= UpdatePolicy.DAY) return;
        checking = true;
        if (manual) toast("Buscando atualizações no GitHub…");
        worker.execute(() -> {
            Result result;
            try { result = load(manual); }
            catch (Exception error) {
                result = new Result(manual, null, error instanceof RateLimited
                    ? "O GitHub limitou as consultas por enquanto. Tente novamente mais tarde."
                    : "Não foi possível verificar atualizações. Confira sua conexão e tente novamente.", true);
            }
            final Result completed = result;
            main.post(() -> {
                checking = false;
                if (closed) return;
                preferences.edit().putLong("nextCheckAt", System.currentTimeMillis()
                    + (completed.failed ? UpdatePolicy.RETRY : UpdatePolicy.DAY)).apply();
                if (resumed) show(completed); else pending = completed;
            });
        });
    }

    private Result load(boolean manual) throws Exception {
        String text = request(UpdatePolicy.LATEST_URL, UpdatePolicy.LATEST_URL, 0, 1024 * 1024, true);
        if (text == null) return new Result(manual, null, "Nenhuma versão Android foi publicada no GitHub ainda.", false);
        JSONObject release = new JSONObject(text);
        if (release.getBoolean("draft") || release.getBoolean("prerelease")) throw new IOException("Versão não estável");
        String tag = release.getString("tag_name");
        if (!tag.startsWith("v") || !UpdatePolicy.validVersion(tag.substring(1))) throw new IOException("Tag incompatível");
        JSONArray assets = release.getJSONArray("assets");
        JSONObject manifestAsset = findAsset(assets, "android-update.json");
        String manifestUrl = manifestAsset.getString("browser_download_url");
        if (!UpdatePolicy.validAsset(manifestUrl, tag, "android-update.json")) throw new IOException("Origem incompatível");
        JSONObject metadata = new JSONObject(request(manifestUrl, manifestUrl, 0, 64 * 1024, false));
        String version = metadata.getString("versionName");
        JSONObject apk = metadata.getJSONObject("apk");
        String filename = "equacao-android-" + version + ".apk";
        JSONObject apkAsset = findAsset(assets, filename);
        if (!filename.equals(apk.getString("name")) || !apk.getString("url").equals(apkAsset.getString("browser_download_url"))) {
            throw new IOException("APK não corresponde à versão publicada");
        }
        String digest = apkAsset.isNull("digest") ? "" : apkAsset.optString("digest");
        if (integer(metadata, "schemaVersion") != 1) throw new IOException("Formato de atualização incompatível");
        UpdatePolicy.Release update = new UpdatePolicy.Release(tag, 1,
            metadata.getString("applicationId"), version, integer(metadata, "versionCode"),
            apk.getString("url"), apk.getString("sha256"), integer(apk, "size"), integer(apkAsset, "size"), digest);
        return new Result(manual, update, "Não há atualização mais recente para sua versão (" + BuildConfig.VERSION_NAME + ").", false);
    }

    private static long integer(JSONObject data, String key) throws Exception {
        String raw = data.get(key).toString();
        if (!raw.matches("[0-9]{1,15}")) throw new IOException("Número inválido");
        return Long.parseLong(raw);
    }

    private static JSONObject findAsset(JSONArray assets, String name) throws Exception {
        JSONObject found = null;
        for (int i = 0; i < assets.length(); i++) {
            JSONObject asset = assets.getJSONObject(i);
            if (!name.equals(asset.optString("name"))) continue;
            if (found != null || !"uploaded".equals(asset.optString("state"))) throw new IOException("Arquivo inválido");
            found = asset;
        }
        if (found == null) throw new IOException("Versão sem arquivo Android");
        return found;
    }

    private String request(String address, String initial, int redirects, int limit, boolean api) throws IOException {
        if (!UpdatePolicy.allowsMetadataRequest(address, initial, redirects)) throw new IOException("Origem não permitida");
        HttpURLConnection connection = (HttpURLConnection) new URL(address).openConnection();
        connection.setInstanceFollowRedirects(false);
        connection.setConnectTimeout(8000); connection.setReadTimeout(8000);
        connection.setRequestProperty("User-Agent", "Equacao-Android/" + BuildConfig.VERSION_NAME);
        connection.setRequestProperty("Accept", api ? "application/vnd.github+json" : "application/json");
        connection.setRequestProperty("Cache-Control", "no-cache");
        try {
            int status = connection.getResponseCode();
            if (api && status == 404) return null;
            if (status == 403 || status == 429) throw new RateLimited();
            if (status >= 300 && status < 400) {
                if (api) throw new IOException("Repositório foi movido");
                String location = connection.getHeaderField("Location");
                if (location == null) throw new IOException("Redirecionamento inválido");
                return request(new URL(new URL(address), location).toString(), initial, redirects + 1, limit, false);
            }
            if (status != 200) throw new IOException("GitHub indisponível");
            try (InputStream input = connection.getInputStream(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                byte[] buffer = new byte[8192]; int count;
                while ((count = input.read(buffer)) != -1) {
                    if (output.size() + count > limit) throw new IOException("Resposta grande demais");
                    output.write(buffer, 0, count);
                }
                return new String(output.toByteArray(), StandardCharsets.UTF_8);
            }
        } finally { connection.disconnect(); }
    }

    private void show(Result result) {
        if (closed || activity.isFinishing() || activity.isDestroyed()) return;
        UpdatePolicy.Release release = result.release;
        if (release == null || !release.newerThan(BuildConfig.VERSION_CODE)) {
            if (result.manual) toast(result.message);
            return;
        }
        if (!UpdatePolicy.shouldOffer(release, BuildConfig.VERSION_CODE, result.manual,
            preferences.getInt("deferredVersion", 0), preferences.getLong("deferredUntil", 0), System.currentTimeMillis())) return;
        dialog = new AlertDialog.Builder(activity, dark ? R.style.EquacaoDialogDark : R.style.EquacaoDialogLight).setTitle("Atualização disponível")
            .setMessage("A versão " + release.version + " do Equação está disponível no GitHub. Você está usando a "
                + BuildConfig.VERSION_NAME + ".\n\nQuer baixar agora? O download será aberto no navegador. Depois, abra o APK e confirme a atualização no Android."
                + "\n\nAo atualizar com a mesma assinatura, seu histórico e seus estudos são mantidos.")
            .setPositiveButton("Baixar atualização", (which, button) -> {
                try {
                    activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(release.apkUrl)).addCategory(Intent.CATEGORY_BROWSABLE));
                    defer(release.versionCode);
                } catch (ActivityNotFoundException ignored) { toast("Nenhum navegador disponível para baixar a atualização."); }
            })
            .setNegativeButton("Agora não", (which, button) -> defer(release.versionCode))
            .setOnCancelListener(which -> defer(release.versionCode)).create();
        dialog.setOnDismissListener(which -> dialog = null);
        dialog.show();
    }

    private void defer(int code) {
        preferences.edit().putInt("deferredVersion", code).putLong("deferredUntil", System.currentTimeMillis() + UpdatePolicy.DAY).apply();
    }
    private void toast(String message) { Toast.makeText(activity, message, Toast.LENGTH_LONG).show(); }
    @Override public void close() {
        closed = true; pending = null; worker.shutdownNow(); main.removeCallbacksAndMessages(null);
        if (dialog != null) dialog.dismiss();
    }
    private static final class RateLimited extends IOException {}
    private static final class Result {
        final boolean manual, failed;
        final UpdatePolicy.Release release;
        final String message;
        Result(boolean manual, UpdatePolicy.Release release, String message, boolean failed) {
            this.manual = manual; this.release = release; this.message = message; this.failed = failed;
        }
    }
}
