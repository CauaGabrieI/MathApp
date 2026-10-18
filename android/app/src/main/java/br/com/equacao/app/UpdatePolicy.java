package br.com.equacao.app;

import java.net.URI;
import java.util.Set;

/** Release metadata is data only: it cannot choose another repository or app. */
final class UpdatePolicy {
    static final String REPOSITORY = "CauaGabrieI/MathApp";
    static final String APPLICATION_ID = "br.com.equacao.app";
    static final String LATEST_URL = "https://api.github.com/repos/" + REPOSITORY + "/releases/latest";
    static final long DAY = 24L * 60 * 60 * 1000;
    static final long RETRY = 60L * 60 * 1000;

    static boolean validVersion(String version) {
        return version != null && version.matches("[0-9]{1,6}\\.[0-9]{1,6}\\.[0-9]{1,6}");
    }

    static String assetUrl(String tag, String filename) {
        return "https://github.com/" + REPOSITORY + "/releases/download/" + tag + "/" + filename;
    }

    static boolean validAsset(String address, String tag, String filename) {
        return tag != null && tag.startsWith("v") && validVersion(tag.substring(1))
            && assetUrl(tag, filename).equals(address);
    }

    static boolean allowsMetadataRequest(String address, String initialAddress, int redirects) {
        try {
            boolean manifest = initialAddress != null && initialAddress.matches("https://github\\.com/"
                + REPOSITORY + "/releases/download/v[0-9]{1,6}\\.[0-9]{1,6}\\.[0-9]{1,6}/android-update\\.json");
            if ((!LATEST_URL.equals(initialAddress) && !manifest) || redirects < 0 || (redirects > 0 && !manifest)) return false;
            URI uri = new URI(address);
            if (!"https".equals(uri.getScheme()) || uri.getUserInfo() != null || uri.getFragment() != null
                || (uri.getPort() != -1 && uri.getPort() != 443) || redirects > 3) return false;
            if (redirects == 0) return address.equals(initialAddress);
            return "release-assets.githubusercontent.com".equals(uri.getHost())
                || "objects.githubusercontent.com".equals(uri.getHost());
        } catch (Exception ignored) { return false; }
    }

    static final class Release {
        final String version, apkUrl, sha256;
        final long size;
        final int versionCode;
        Release(String tag, int schema, String applicationId, String version, long code,
                String apkUrl, String sha256, long size, long assetSize, String assetDigest) {
            String filename = "equacao-android-" + version + ".apk";
            if (schema != 1 || !APPLICATION_ID.equals(applicationId) || !validVersion(version)
                || !("v" + version).equals(tag) || code < 1 || code > Integer.MAX_VALUE
                || !validAsset(apkUrl, tag, filename) || sha256 == null || !sha256.matches("[a-f0-9]{64}")
                || size < 1 || size > 150L * 1024 * 1024 || size != assetSize
                || (assetDigest != null && !assetDigest.isEmpty() && !("sha256:" + sha256).equals(assetDigest))) {
                throw new IllegalArgumentException("Metadados de atualização incompatíveis");
            }
            this.version = version; this.versionCode = (int) code; this.apkUrl = apkUrl; this.sha256 = sha256; this.size = size;
        }
        boolean newerThan(int installedCode) { return versionCode > installedCode; }
    }

    static boolean allowsApkRequest(String address, Release release, int redirects) {
        try {
            URI uri = new URI(address);
            if (redirects < 0 || redirects > 3 || !"https".equals(uri.getScheme()) || uri.getUserInfo() != null
                || uri.getFragment() != null || (uri.getPort() != -1 && uri.getPort() != 443)) return false;
            if (redirects == 0) return release.apkUrl.equals(address);
            return "release-assets.githubusercontent.com".equals(uri.getHost()) || "objects.githubusercontent.com".equals(uri.getHost());
        } catch (Exception ignored) { return false; }
    }

    static boolean installIdentityMatches(String packageName, String versionName, long code, long installedCode,
                                           Release expected, Set<String> installedSigners, Set<String> archiveSigners) {
        return APPLICATION_ID.equals(packageName) && expected.version.equals(versionName)
            && code == expected.versionCode && code > installedCode && installedSigners != null
            && !installedSigners.isEmpty() && installedSigners.equals(archiveSigners);
    }

    static boolean shouldOffer(Release release, int installedCode, boolean manual,
                               int deferredCode, long deferredUntil, long now) {
        return release.newerThan(installedCode) && (manual || deferredCode != release.versionCode || now >= deferredUntil);
    }

    static boolean shouldPrepareAutomatically(Release release, int installedCode, boolean enabled,
                                               boolean manual, int deferredCode, long deferredUntil, long now) {
        return enabled && !manual && shouldOffer(release, installedCode, false, deferredCode, deferredUntil, now);
    }
}
