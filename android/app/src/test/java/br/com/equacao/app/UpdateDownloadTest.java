package br.com.equacao.app;

import org.junit.Test;
import java.io.*;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.util.*;
import static org.junit.Assert.*;

public class UpdateDownloadTest {
    private UpdatePolicy.Release release(byte[] bytes) throws Exception {
        String hash = UpdateDownload.hex(MessageDigest.getInstance("SHA-256").digest(bytes));
        return new UpdatePolicy.Release("v1.1.1", 1, UpdatePolicy.APPLICATION_ID, "1.1.1", 4,
            UpdatePolicy.assetUrl("v1.1.1", "equacao-android-1.1.1.apk"), hash, bytes.length, bytes.length, "");
    }
    @Test public void completeDownloadIsVerifiedBeforeBecomingInstallable() throws Exception {
        byte[] bytes = new byte[100000]; new Random(9).nextBytes(bytes);
        ByteArrayOutputStream output = new ByteArrayOutputStream(); List<Integer> progress = new ArrayList<>();
        UpdateDownload.copyAndVerify(new ByteArrayInputStream(bytes), output, release(bytes), () -> false, progress::add);
        assertArrayEquals(bytes, output.toByteArray()); assertEquals(Integer.valueOf(100), progress.get(progress.size()-1));
        for (int i = 1; i < progress.size(); i++) assertTrue(progress.get(i) >= progress.get(i-1));
    }
    @Test public void rejectsTruncationExtraBytesAndChangedContent() throws Exception {
        byte[] bytes = new byte[]{1,2,3}; UpdatePolicy.Release expected = release(bytes);
        for (byte[] invalid : new byte[][]{{1,2},{1,2,3,4},{1,2,4}}) {
            assertThrows(IOException.class, () -> UpdateDownload.copyAndVerify(new ByteArrayInputStream(invalid), new ByteArrayOutputStream(), expected, () -> false, percent -> {}));
        }
    }
    @Test public void cancelStopsBeforeWritingAndLocalFilesAreRechecked() throws Exception {
        byte[] bytes = new byte[]{1,2,3}; UpdatePolicy.Release expected = release(bytes); ByteArrayOutputStream output = new ByteArrayOutputStream();
        assertThrows(UpdateDownload.Canceled.class, () -> UpdateDownload.copyAndVerify(new ByteArrayInputStream(bytes), output, expected, () -> true, percent -> {}));
        assertEquals(0, output.size());
        File file = Files.createTempFile("equacao-update", ".apk").toFile();
        try {
            Files.write(file.toPath(), bytes); UpdateDownload.verifyFile(file, expected);
            Files.write(file.toPath(), new byte[]{1,2,4}); assertThrows(IOException.class, () -> UpdateDownload.verifyFile(file, expected));
        } finally { file.delete(); }
    }
    @Test public void apkDownloadIsRestrictedToTheReleaseAndGithubHttpsCdn() throws Exception {
        UpdatePolicy.Release expected = release(new byte[]{1});
        assertTrue(UpdatePolicy.allowsApkRequest(expected.apkUrl, expected, 0));
        assertTrue(UpdatePolicy.allowsApkRequest("https://release-assets.githubusercontent.com/file?signature=a", expected, 1));
        assertTrue(UpdatePolicy.allowsApkRequest("https://objects.githubusercontent.com/file", expected, 2));
        assertFalse(UpdatePolicy.allowsApkRequest(expected.apkUrl.replace("MathApp", "Other"), expected, 0));
        for (String url : new String[]{"https://evil.test/a", "http://release-assets.githubusercontent.com/a", "https://user:secret@release-assets.githubusercontent.com/a", "https://release-assets.githubusercontent.com:444/a", "file:///tmp/app.apk"}) {
            assertFalse(url, UpdatePolicy.allowsApkRequest(url, expected, 1));
        }
        assertFalse(UpdatePolicy.allowsApkRequest("https://release-assets.githubusercontent.com/a", expected, 4));
    }
    @Test public void rejectsAnotherPackageVersionOrSigningKeyBeforeInstallation() throws Exception {
        UpdatePolicy.Release expected = release(new byte[]{1}); Set<String> key = Collections.singleton("original");
        assertTrue(UpdatePolicy.installIdentityMatches(UpdatePolicy.APPLICATION_ID, "1.1.1", 4, 3, expected, key, key));
        assertFalse(UpdatePolicy.installIdentityMatches("other.app", "1.1.1", 4, 3, expected, key, key));
        assertFalse(UpdatePolicy.installIdentityMatches(UpdatePolicy.APPLICATION_ID, "1.1.2", 4, 3, expected, key, key));
        assertFalse(UpdatePolicy.installIdentityMatches(UpdatePolicy.APPLICATION_ID, "1.1.1", 3, 3, expected, key, key));
        assertFalse(UpdatePolicy.installIdentityMatches(UpdatePolicy.APPLICATION_ID, "1.1.1", 4, 4, expected, key, key));
        assertFalse(UpdatePolicy.installIdentityMatches(UpdatePolicy.APPLICATION_ID, "1.1.1", 4, 3, expected, key, Collections.singleton("different")));
        assertFalse(UpdatePolicy.installIdentityMatches(UpdatePolicy.APPLICATION_ID, "1.1.1", 4, 3, expected, Collections.emptySet(), Collections.emptySet()));
    }
}
