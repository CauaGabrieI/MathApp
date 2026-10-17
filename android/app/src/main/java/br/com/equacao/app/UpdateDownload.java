package br.com.equacao.app;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.*;
import java.security.MessageDigest;
import java.util.UUID;
import java.util.function.BooleanSupplier;

/** Downloads to private storage and never exposes incomplete/unverified files. */
final class UpdateDownload {
    interface Progress { void update(int percent); }
    static final class Canceled extends IOException {}
    private volatile boolean canceled;
    private volatile HttpURLConnection active;

    void cancel() { canceled = true; HttpURLConnection connection = active; if (connection != null) connection.disconnect(); }
    boolean isCanceled() { return canceled || Thread.currentThread().isInterrupted(); }

    static String hex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte value : bytes) result.append(String.format(java.util.Locale.ROOT, "%02x", value));
        return result.toString();
    }

    static void copyAndVerify(InputStream input, OutputStream output, UpdatePolicy.Release release,
                               BooleanSupplier canceled, Progress progress) throws IOException {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[32768]; long total = 0; int count, last = -1;
            while (true) {
                if (canceled.getAsBoolean()) throw new Canceled();
                count = input.read(buffer);
                if (count == -1) break;
                if (canceled.getAsBoolean()) throw new Canceled();
                total += count;
                if (total > release.size) throw new IOException("Arquivo maior que o esperado");
                digest.update(buffer, 0, count); output.write(buffer, 0, count);
                int percent = (int) (total * 100 / release.size);
                if (percent != last) { progress.update(percent); last = percent; }
            }
            if (canceled.getAsBoolean()) throw new Canceled();
            if (total != release.size || !release.sha256.equals(hex(digest.digest()))) throw new IOException("Falha na integridade da atualização");
        } catch (java.security.NoSuchAlgorithmException impossible) { throw new IOException(impossible); }
    }

    static void verifyFile(File file, UpdatePolicy.Release release) throws IOException {
        if (!file.isFile() || file.length() != release.size) throw new IOException("Atualização salva incompleta");
        try (InputStream input = new FileInputStream(file)) {
            copyAndVerify(input, new OutputStream() {
                @Override public void write(int value) {}
                @Override public void write(byte[] bytes, int offset, int count) {}
            }, release, () -> Thread.currentThread().isInterrupted(), percent -> {});
        }
    }

    File download(UpdatePolicy.Release release, File directory, Progress progress) throws IOException {
        if (!directory.isDirectory() && !directory.mkdirs()) throw new IOException("Sem espaço para a atualização");
        File ready = new File(directory, release.sha256 + ".apk");
        if (ready.exists()) {
            try { verifyFile(ready, release); return ready; }
            catch (IOException invalid) { if (isCanceled()) throw new Canceled(); if (!ready.delete()) throw invalid; }
        }
        File partial = new File(directory, UUID.randomUUID() + ".part");
        try {
            HttpURLConnection connection = connect(release.apkUrl, release, 0);
            try (InputStream input = connection.getInputStream(); FileOutputStream output = new FileOutputStream(partial)) {
                long declared = connection.getContentLengthLong();
                if (declared >= 0 && declared != release.size) throw new IOException("Tamanho de atualização incompatível");
                copyAndVerify(input, output, release, this::isCanceled, progress);
                output.getFD().sync();
            } finally { connection.disconnect(); active = null; }
            if (isCanceled()) throw new Canceled();
            try { Files.move(partial.toPath(), ready.toPath(), StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING); }
            catch (AtomicMoveNotSupportedException ignored) { Files.move(partial.toPath(), ready.toPath(), StandardCopyOption.REPLACE_EXISTING); }
            return ready;
        } finally { partial.delete(); }
    }

    private HttpURLConnection connect(String address, UpdatePolicy.Release release, int redirects) throws IOException {
        if (isCanceled()) throw new Canceled();
        if (!UpdatePolicy.allowsApkRequest(address, release, redirects)) throw new IOException("Origem de atualização não permitida");
        HttpURLConnection connection = (HttpURLConnection) new URL(address).openConnection(); active = connection;
        connection.setInstanceFollowRedirects(false); connection.setConnectTimeout(8000); connection.setReadTimeout(15000);
        connection.setRequestProperty("User-Agent", "Equacao-Android-Updater");
        connection.setRequestProperty("Accept-Encoding", "identity");
        try {
            int status = connection.getResponseCode();
            if (isCanceled()) throw new Canceled();
            if (status >= 300 && status < 400) {
                String location = connection.getHeaderField("Location");
                if (location == null) throw new IOException("Redirecionamento inválido");
                String next = new URL(new URL(address), location).toString();
                connection.disconnect();
                return connect(next, release, redirects + 1);
            }
            if (status != 200) throw new IOException("Não foi possível baixar a atualização");
            return connection;
        } catch (IOException failure) { connection.disconnect(); throw failure; }
    }
}
