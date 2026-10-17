package br.com.equacao.app;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import java.io.File;
import java.io.IOException;
import java.security.MessageDigest;
import java.util.HashSet;
import java.util.Set;

final class ApkVerifier {
    static void verify(Context context, File file, UpdatePolicy.Release expected) throws Exception {
        UpdateDownload.verifyFile(file, expected);
        PackageManager manager = context.getPackageManager();
        int flags = Build.VERSION.SDK_INT >= 28 ? PackageManager.GET_SIGNING_CERTIFICATES : PackageManager.GET_SIGNATURES;
        PackageInfo installed = manager.getPackageInfo(context.getPackageName(), flags);
        PackageInfo archive = manager.getPackageArchiveInfo(file.getAbsolutePath(), flags);
        if (archive == null || !UpdatePolicy.installIdentityMatches(archive.packageName, archive.versionName, code(archive), code(installed),
                expected, signers(installed), signers(archive))) throw new IOException("O arquivo não é uma atualização compatível e assinada do Equação");
    }
    private static long code(PackageInfo info) { return Build.VERSION.SDK_INT >= 28 ? info.getLongVersionCode() : info.versionCode; }
    private static Set<String> signers(PackageInfo info) throws Exception {
        Signature[] values = Build.VERSION.SDK_INT >= 28
            ? (info.signingInfo == null ? null : info.signingInfo.getApkContentsSigners()) : info.signatures;
        Set<String> result = new HashSet<>();
        if (values != null) for (Signature signature : values) result.add(UpdateDownload.hex(MessageDigest.getInstance("SHA-256").digest(signature.toByteArray())));
        return result;
    }
}
