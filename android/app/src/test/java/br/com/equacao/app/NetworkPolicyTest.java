package br.com.equacao.app;
import org.junit.Test;
import static org.junit.Assert.*;
public class NetworkPolicyTest {
    @Test public void allowsOnlyTheRequiredPublicServices(){
        assertTrue(NetworkPolicy.allowsApi("https://www.youtube.com/@Giscomgiz/search?query=matematica"));
        assertTrue(NetworkPolicy.allowsApi("https://www.youtube.com/@professorferretto/search?query=matematica"));
        assertTrue(NetworkPolicy.allowsApi("https://www.youtube.com/@M%C3%A9todoQuestiona/search?query=porcentagem"));
        assertTrue(NetworkPolicy.allowsApi("https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3Y0u8kPYvko&format=json"));
        assertTrue(NetworkPolicy.allowsApi("https://api.enem.dev/v1/exams/2016/questions/149"));
        assertFalse(NetworkPolicy.allowsApi("https://www.youtube.com/@OtherChannel/search?query=math"));
        assertFalse(NetworkPolicy.allowsApi("https://api.enem.dev/private"));
    }
    @Test public void rejectsUntrustedOriginsAndCredentials(){
        for(String url:new String[]{"http://api.enem.dev/v1/exams/2016/questions/149","https://api.enem.dev.evil.test/v1/exams/2016/questions/149","https://user:secret@api.enem.dev/v1/exams/2016/questions/149","https://api.enem.dev:444/v1/exams/2016/questions/149","file:///etc/passwd","https://evil.test/oembed"})assertFalse(url,NetworkPolicy.allowsApi(url));
        assertFalse(NetworkPolicy.allowsImage("https://evil.test/a.png"));
        assertFalse(NetworkPolicy.allowsImage("http://enem.dev/a.png"));
        assertFalse(NetworkPolicy.allowsImage(null));
        assertTrue(NetworkPolicy.allowsImage("https://enem.dev/2016/questions/149/diagram.png"));
        assertTrue(NetworkPolicy.allowsImage("https://img.enemhub.com.br/a.png"));
    }
}
