package br.com.equacao.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.*;
import android.content.res.ColorStateList;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.view.ContextThemeWrapper;
import android.widget.*;
import org.json.JSONObject;
import java.io.File;
import java.util.concurrent.*;

/** User-approved, private download -> verification -> Android installation UI. */
final class UpdateInstaller implements AutoCloseable {
    private static final int INSTALL_REQUEST = 201, PERMISSION_REQUEST = 202;
    private final Activity activity;
    private final SharedPreferences preferences;
    private final File directory;
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final Handler main = new Handler(Looper.getMainLooper());
    private boolean closed, resumed, busy, dark;
    private UpdateDownload download;
    private UpdatePolicy.Release pendingReady;
    private String pendingFailure;
    private AlertDialog dialog;
    private ProgressBar progress;
    private TextView status;

    UpdateInstaller(Activity activity) {
        this.activity = activity;
        directory = new File(activity.getFilesDir(), "updates");
        preferences = activity.getSharedPreferences("github-install", Context.MODE_PRIVATE);
        worker.execute(this::cleanOldFiles);
    }
    void setDark(boolean dark) { this.dark = dark; }
    boolean isBusy() { return busy || (dialog != null && dialog.isShowing()); }

    void onResume() {
        resumed = true;
        if (pendingFailure != null) { String text = pendingFailure; pendingFailure = null; fail(text); }
        if (pendingReady != null) { UpdatePolicy.Release release = pendingReady; pendingReady = null; ready(release); }
        if (!busy && preferences.getBoolean("resumeAfterPermission", false)) {
            preferences.edit().putBoolean("resumeAfterPermission", false).apply();
            UpdatePolicy.Release release = savedRelease();
            if (release == null) return;
            if (activity.getPackageManager().canRequestPackageInstalls()) prepare(release, false);
            else toast("A autorização não foi concedida. Você pode tentar novamente em Preferências → Verificar atualizações.");
        }
    }
    void onPause() { resumed = false; }

    void begin(UpdatePolicy.Release release) {
        if (closed || isBusy()) return;
        preferences.edit().putBoolean("resumeAfterPermission", false).apply();
        prepare(release, true);
    }

    private void prepare(UpdatePolicy.Release release, boolean allowDownload) {
        if (closed || busy || !release.newerThan(BuildConfig.VERSION_CODE)) return;
        busy = true;
        download = new UpdateDownload();
        UpdateDownload operation = download;
        showProgress(release, operation);
        worker.execute(() -> {
            try {
                File file = allowDownload ? operation.download(release, directory, percent -> main.post(() -> {
                    if (!closed && download == operation && progress != null) {
                        progress.setProgress(percent);
                        status.setText(percent < 100 ? "Baixando atualização… " + percent + "%" : "Verificando a atualização…");
                    }
                })) : apkFile(release);
                if (operation.isCanceled()) throw new UpdateDownload.Canceled();
                ApkVerifier.verify(activity, file, release);
                if (operation.isCanceled()) throw new UpdateDownload.Canceled();
                saveRelease(release);
                main.post(() -> {
                    busy = false; download = null; dismiss();
                    if (closed || operation.isCanceled()) return;
                    if (resumed) ready(release); else pendingReady = release;
                });
            } catch (Exception error) {
                boolean canceled = operation.isCanceled() || error instanceof UpdateDownload.Canceled;
                main.post(() -> {
                    busy = false; download = null; dismiss();
                    if (closed || canceled) return;
                    String message = "Não foi possível baixar ou verificar a atualização. Seu app e seu histórico continuam intactos. Tente novamente.";
                    if (resumed) fail(message); else pendingFailure = message;
                });
            }
        });
    }

    private void ready(UpdatePolicy.Release release) {
        if (closed || activity.isFinishing() || activity.isDestroyed()) return;
        if (!activity.getPackageManager().canRequestPackageInstalls()) {
            dialog = builder().setTitle("Permitir atualização do Equação")
                .setMessage("O Android precisa que você autorize o Equação a instalar suas próprias atualizações.\n\nNa próxima tela, ative Permitir desta fonte. Ao voltar, a confirmação de instalação será aberta. Seu histórico será mantido.")
                .setPositiveButton("Abrir configurações", (which, button) -> {
                    preferences.edit().putBoolean("resumeAfterPermission", true).apply();
                    try {
                        activity.startActivityForResult(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                            Uri.parse("package:" + activity.getPackageName())), PERMISSION_REQUEST);
                    } catch (ActivityNotFoundException | SecurityException error) {
                        preferences.edit().putBoolean("resumeAfterPermission", false).apply();
                        toast("Não foi possível abrir a autorização de instalação deste Android.");
                    }
                }).setNegativeButton("Agora não", (which, button) -> {}).create();
            display(dialog);
            return;
        }
        try {
            Uri uri = UpdateFileProvider.getUriForFile(activity, activity.getPackageName() + ".updates", apkFile(release));
            // Dedicated installation intent: the user never opens an APK/browser/download folder.
            Intent intent = new Intent(Intent.ACTION_INSTALL_PACKAGE).setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION).putExtra(Intent.EXTRA_RETURN_RESULT, true);
            intent.setClipData(ClipData.newRawUri("Atualização do Equação", uri));
            activity.startActivityForResult(intent, INSTALL_REQUEST);
        } catch (ActivityNotFoundException | SecurityException | IllegalArgumentException error) {
            fail("Não foi possível abrir o instalador do Android. A atualização continua salva para você tentar novamente.");
        }
    }

    void onActivityResult(int request, int result) {
        if (request == INSTALL_REQUEST && result != Activity.RESULT_OK)
            toast("Instalação não concluída. Você pode tentar novamente em Preferências → Verificar atualizações.");
        // Permission results are checked using canRequestPackageInstalls() in onResume,
        // including recreation/process death while the system settings screen is open.
    }

    private void showProgress(UpdatePolicy.Release release, UpdateDownload operation) {
        Context themed = new ContextThemeWrapper(activity, dark ? R.style.EquacaoDialogDark : R.style.EquacaoDialogLight);
        LinearLayout content = new LinearLayout(themed); content.setOrientation(LinearLayout.VERTICAL);
        int padding = Math.round(24 * activity.getResources().getDisplayMetrics().density);
        content.setPadding(padding, padding / 2, padding, padding / 2);
        status = new TextView(themed); status.setText("Preparando versão " + release.version + "…"); status.setTextSize(16);
        content.addView(status);
        progress = new ProgressBar(themed, null, android.R.attr.progressBarStyleHorizontal);
        progress.setMax(100); progress.setProgressTintList(ColorStateList.valueOf(activity.getColor(dark ? R.color.eq_dark_primary : R.color.eq_light_primary)));
        LinearLayout.LayoutParams layout = new LinearLayout.LayoutParams(-1, -2); layout.topMargin = padding / 2;
        content.addView(progress, layout);
        AlertDialog progressDialog = builder().setTitle("Atualizando Equação").setView(content)
            .setNegativeButton("Cancelar", (which, button) -> operation.cancel())
            .setOnCancelListener(which -> operation.cancel()).create();
        dialog = progressDialog; display(progressDialog);
    }

    private AlertDialog.Builder builder() { return new AlertDialog.Builder(activity, dark ? R.style.EquacaoDialogDark : R.style.EquacaoDialogLight); }
    private void display(AlertDialog next) {
        next.setOnDismissListener(which -> { if (dialog == next) { dialog = null; progress = null; status = null; } });
        next.show();
    }
    private void dismiss() { if (dialog != null) dialog.dismiss(); }
    private void fail(String message) {
        dialog = builder().setTitle("Atualização não concluída").setMessage(message).setPositiveButton("Entendi", (which, button) -> {}).create();
        display(dialog);
    }
    private File apkFile(UpdatePolicy.Release release) { return new File(directory, release.sha256 + ".apk"); }
    private void toast(String message) { Toast.makeText(activity, message, Toast.LENGTH_LONG).show(); }

    private void saveRelease(UpdatePolicy.Release release) throws Exception {
        JSONObject data = new JSONObject().put("version", release.version).put("code", release.versionCode)
            .put("url", release.apkUrl).put("sha256", release.sha256).put("size", release.size);
        if (!preferences.edit().putString("readyRelease", data.toString()).commit()) throw new java.io.IOException("Falha ao salvar atualização");
    }
    private UpdatePolicy.Release savedRelease() {
        try {
            JSONObject data = new JSONObject(preferences.getString("readyRelease", ""));
            return new UpdatePolicy.Release("v" + data.getString("version"), 1, UpdatePolicy.APPLICATION_ID,
                data.getString("version"), data.getLong("code"), data.getString("url"), data.getString("sha256"),
                data.getLong("size"), data.getLong("size"), "");
        } catch (Exception ignored) { return null; }
    }
    private void cleanOldFiles() {
        UpdatePolicy.Release saved = savedRelease();
        if (saved != null && !saved.newerThan(BuildConfig.VERSION_CODE)) {
            preferences.edit().remove("readyRelease").remove("resumeAfterPermission").apply(); saved = null;
        }
        File[] files = directory.listFiles(); if (files == null) return;
        String keep = saved == null ? "" : saved.sha256 + ".apk";
        for (File file : files) {
            if (file.getName().endsWith(".apk") && !file.getName().equals(keep)) file.delete();
            else if (file.getName().endsWith(".part") && System.currentTimeMillis() - file.lastModified() > UpdatePolicy.DAY) file.delete();
        }
    }

    @Override public void close() {
        closed = true; if (download != null) download.cancel(); worker.shutdownNow(); main.removeCallbacksAndMessages(null); dismiss();
    }
}
