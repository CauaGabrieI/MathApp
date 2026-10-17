package br.com.equacao.app;

import org.junit.Test;
import static org.junit.Assert.*;

public class UpdatePolicyTest {
    private static final String HASH = "a".repeat(64);
    private static final String URL = UpdatePolicy.assetUrl("v1.0.2", "equacao-android-1.0.2.apk");
    private UpdatePolicy.Release release(long code) {
        return new UpdatePolicy.Release("v1.0.2", 1, "br.com.equacao.app", "1.0.2", code, URL, HASH, 100, 100, "sha256:" + HASH);
    }
    @Test public void comparesAndroidVersionCodesInsteadOfVersionStrings() {
        assertTrue(release(3).newerThan(2));
        assertFalse(release(2).newerThan(2));
        assertFalse(release(1).newerThan(2));
    }
    @Test public void laterDefersOnlyThatVersionAndManualChecksBypassDeferral() {
        assertFalse(UpdatePolicy.shouldOffer(release(3), 2, false, 3, 1000, 999));
        assertTrue(UpdatePolicy.shouldOffer(release(3), 2, false, 3, 1000, 1000));
        assertTrue(UpdatePolicy.shouldOffer(release(3), 2, true, 3, 1000, 999));
        assertTrue(UpdatePolicy.shouldOffer(release(4), 2, false, 3, 1000, 999));
        assertFalse(UpdatePolicy.shouldOffer(release(1), 2, true, 0, 0, 999));
    }
    @Test public void refusesOtherAppsRepositoriesCorruptedAndMismatchedAssets() {
        assertThrows(IllegalArgumentException.class, () -> new UpdatePolicy.Release("v1.0.2", 1, "other.app", "1.0.2", 3, URL, HASH, 100, 100, ""));
        assertThrows(IllegalArgumentException.class, () -> new UpdatePolicy.Release("v1.0.3", 1, UpdatePolicy.APPLICATION_ID, "1.0.2", 3, URL, HASH, 100, 100, ""));
        assertThrows(IllegalArgumentException.class, () -> new UpdatePolicy.Release("v1.0.2", 1, UpdatePolicy.APPLICATION_ID, "1.0.2", 3, "https://evil.test/app.apk", HASH, 100, 100, ""));
        assertThrows(IllegalArgumentException.class, () -> new UpdatePolicy.Release("v1.0.2", 1, UpdatePolicy.APPLICATION_ID, "1.0.2", 3, URL, HASH, 99, 100, ""));
        assertThrows(IllegalArgumentException.class, () -> new UpdatePolicy.Release("v1.0.2", 1, UpdatePolicy.APPLICATION_ID, "1.0.2", 3, URL, HASH, 100, 100, "sha256:" + "b".repeat(64)));
        assertThrows(IllegalArgumentException.class, () -> new UpdatePolicy.Release("v1.0.2", 1, UpdatePolicy.APPLICATION_ID, "1.0.2", 3, URL, "invalid", 100, 100, ""));
        assertThrows(IllegalArgumentException.class, () -> release(2147483648L));
        assertThrows(IllegalArgumentException.class, () -> release(0));
    }
    @Test public void downloadUrlsCannotEscapeTheSelectedStableRelease() {
        assertTrue(UpdatePolicy.validAsset(URL, "v1.0.2", "equacao-android-1.0.2.apk"));
        for (String address : new String[]{URL + "?token=a", URL + "#fake", URL.replace("https:", "http:"), URL.replace("MathApp", "AnotherApp"), URL.replace("github.com/", "github.com.evil.test/")}) {
            assertFalse(address, UpdatePolicy.validAsset(address, "v1.0.2", "equacao-android-1.0.2.apk"));
        }
        assertFalse(UpdatePolicy.validVersion("1.0.2-beta"));
        assertFalse(UpdatePolicy.validAsset(URL, "../../evil", "equacao-android-1.0.2.apk"));
    }
    @Test public void allowsOnlyGithubMetadataAndItsHttpsAssetRedirects() {
        String manifest = UpdatePolicy.assetUrl("v1.0.2", "android-update.json");
        assertTrue(UpdatePolicy.allowsMetadataRequest(UpdatePolicy.LATEST_URL, UpdatePolicy.LATEST_URL, 0));
        assertTrue(UpdatePolicy.allowsMetadataRequest(manifest, manifest, 0));
        assertTrue(UpdatePolicy.allowsMetadataRequest("https://release-assets.githubusercontent.com/a?signature=test", manifest, 1));
        assertFalse(UpdatePolicy.allowsMetadataRequest("https://evil.test/a", "https://evil.test/a", 0));
        assertFalse(UpdatePolicy.allowsMetadataRequest("https://release-assets.githubusercontent.com/a", UpdatePolicy.LATEST_URL, 1));
        assertFalse(UpdatePolicy.allowsMetadataRequest("https://release-assets.githubusercontent.com/a", manifest, 4));
        for (String address : new String[]{"http://release-assets.githubusercontent.com/a", "https://evil.test/a", "https://user:secret@release-assets.githubusercontent.com/a", "https://release-assets.githubusercontent.com:444/a", "file:///tmp/a"}) {
            assertFalse(address, UpdatePolicy.allowsMetadataRequest(address, manifest, 1));
        }
    }
}
