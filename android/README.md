# Equação para Android

Aplicativo Android instalável (`br.com.equacao.app`, versão 1.1.0), Android 8.0/API 26 ou superior. É um app híbrido: uma Activity Android reutiliza a interface existente em uma WebView local, com assets incluídos no APK, armazenamento próprio e integração nativa para rede, links, exportação e botão de voltar. Não é um atalho do navegador e não abre o site privado para funcionar.

## Incluído no app

- Mapa de 25 módulos e 199 subtópicos; prática por matéria e subtópico; correção e cards após responder.
- Banco de 1.305 questões incluídas no APK: 581 do enem.dev e 724 da EnemHub. IDs originais e prevenção de repetições são preservados.
- Histórico, estudo e preferências persistidos no armazenamento privado da WebView, separados do navegador.
- Fontes e arquivos da interface locais. O app abre e permite praticar sem internet desde a primeira instalação; imagens ainda não carregadas e videoaulas precisam de conexão.
- Atualização individual de questões do enem.dev quando online. O acervo EnemHub desta versão é a cópia importada: o APK não contém a chave e não faz consultas autenticadas à EnemHub.
- Busca e confirmação de videoaulas nos sete canais autorizados, reutilizando o serviço JavaScript existente através de um transporte HTTPS nativo. Somente resultados confirmados são sugeridos.
- Exportação de resultados pelo seletor de arquivos Android, sem solicitar acesso amplo ao armazenamento.
- Links externos abrem no app correspondente. Player de aula integrado com alternativa Abrir no YouTube quando a incorporação estiver restrita.
- Back/gesto de voltar fecha primeiro o painel, volta ao mapa e então encerra a tela. AndroidX Activity faz a compatibilidade com o gesto de voltar dos Androids recentes.

O Android System WebView precisa estar atualizado. Se não oferecer a API necessária, o aplicativo apresenta uma ação para atualização.

## Preparar e compilar

Requer Node.js 22+, Java 17 e Android SDK 36/Build Tools 36.0.0. As dependências oficiais AndroidX são resolvidas pelo Gradle 9.7.1.

Na raiz do projeto:

```sh
npm ci
npm run build
npm run android:prepare
npm test
```

Configure `ANDROID_HOME` apontando para seu SDK ou crie `android/local.properties` com `sdk.dir=/caminho/do/sdk`. Esse arquivo é local e não acompanha a distribuição.

```sh
cd android
./gradlew assembleDebug testDebugUnitTest lintRelease
```

O APK de teste é gerado em `app/build/outputs/apk/debug/app-debug.apk`. Para gerar uma versão release assinada, configure sua chave em `.android-signing/equacao-release.jks` e as propriedades `storePassword`/`keyPassword` no arquivo local `.android-signing/signing.properties`. O alias deve ser `equacao`.

```sh
./gradlew assembleRelease testDebugUnitTest lintRelease
```

A chave usada para o APK entregue fica guardada localmente, fora dos arquivos distribuídos. Ela precisa ser preservada para assinar futuras atualizações compatíveis com a instalação existente. Não envie essa pasta para Git ou para o ZIP do código. Uma compilação com outra chave não pode atualizar a instalação atual sem desinstalá-la antes.

## Arquitetura e segurança

`WebViewAssetLoader` serve os assets sob a origem local HTTPS reservada `appassets.androidplatform.net`. A ponte `AndroidNetwork` usa `WebViewCompat.addWebMessageListener` somente nessa origem e no frame principal; ela não é exposta ao player externo. Não é usado `addJavascriptInterface`.

A Activity não permite acesso `file://` ou `content://` pela WebView e não ignora erros TLS. O transporte nativo faz somente GET para os serviços públicos usados pelo app. A política restringe os canais do YouTube, o oEmbed e os detalhes públicos do enem.dev; o proxy de imagem aceita somente as fontes autorizadas e formatos raster, com cache limitado a 64 MB.

IndexedDB e preferências permanecem após fechar o app e após atualizar com a mesma assinatura. Desinstalar ou limpar os dados do app apaga esse armazenamento. Exportar cria uma cópia JSON escolhida pelo usuário; esta versão não importa backup nem sincroniza histórico com o navegador ou outro aparelho.

Os dados do enem.dev são creditados sob GPL-2.0, com a licença incluída nos assets. Marked e DOMPurify conservam suas licenças. As fontes DM Sans e Manrope incluem os arquivos OFL na pasta `fonts` e no APK. AndroidX é obtido do repositório oficial Google Maven.

## Verificação desta entrega

- `assembleRelease`, `testDebugUnitTest` e `lintRelease`: concluídos.
- Testes Java da política de rede: 2 passaram.
- Sete arquivos de testes Node passaram, incluindo assets Android, roteamento local, fallback offline, preservação de conteúdo e ausência de chave no pacote.
- APK assinado e alinhado: verificados com `apksigner` e `zipalign`.
- Não houve teste em aparelho físico: nenhum dispositivo Android estava conectado. Não havia imagem de emulador disponível no ambiente.

As limitações pedagógicas do acervo e da associação automática dos exercícios permanecem as mesmas da versão web. A disponibilidade do YouTube depende do serviço e da rede; falha de confirmação não gera recomendações inventadas.

## Atualizações pelo GitHub

O app consulta somente a última release pública estável de [CauaGabrieI/MathApp](https://github.com/CauaGabrieI/MathApp/releases). Não usa login nem token de GitHub. Não envia histórico, respostas ou dados de estudo: faz somente GET dos metadados públicos de versão. O GitHub recebe a conexão HTTP normal, incluindo o IP e a versão do app no User-Agent.

A consulta automática acontece ao abrir/retomar o app, no máximo uma vez por dia. Há também Preferências → Verificar atualizações. Quando encontra uma versão mais nova, o aviso oferece Baixar atualização e Agora não. Adiar silencia aquela versão por 24 horas; a consulta manual ignora o adiamento. Falhas automáticas ficam silenciosas e permitem nova consulta após uma hora; consultas manuais informam problemas de conexão/limite do GitHub.

A release precisa conter `android-update.json` e o APK com o nome indicado nele. O app compara o `versionCode` Android, confere o identificador do aplicativo, a tag estável, o nome, o tamanho e o endereço do APK no mesmo repositório. Quando o GitHub fornece um digest, compara-o com o SHA-256 do manifesto. O download abre no navegador após o usuário aceitar; o app não baixa nem instala silenciosamente. O Android confirma a instalação e verifica a compatibilidade da assinatura do APK. Os dados locais são mantidos numa atualização normal, com mesmo pacote e assinatura.

Sem release pública ou arquivo Android válido, nenhum download é sugerido. Rascunhos, pré-lançamentos e versões com código igual ou menor são ignorados. A versão 1.0.0 não tinha esse recurso: instale a 1.0.1 ou mais recente uma vez por cima dela. Não desinstale para atualizar, pois isso apaga os dados do app. O recurso é exclusivo do APK; a versão web conserva seu mecanismo de cache.

### Publicar uma próxima versão

1. Aumente `versionCode` e `versionName` em `app/build.gradle`. Exemplo: código 4 e nome 1.1.1. Use sempre a chave de assinatura original, guardada localmente.
2. Na raiz, execute `npm ci`, `npm run build` e `npm test`. Em `android/`, execute `./gradlew --no-daemon assembleRelease testDebugUnitTest lintRelease`.
3. Na raiz, com `ANDROID_HOME` configurado, execute `npm run android:release-files`. O script verifica assinatura, alinhamento, pacote e versão do APK antes de gerar os arquivos em `android/build/github-release/` (fora do Git).
4. Faça commit e push do código. Crie uma release estável `v<versionName>` apontando para esse commit, com os três arquivos gerados: APK, `android-update.json` e `.sha256`. Publique os arquivos juntos, inicialmente em rascunho e depois tornando a release pública e latest.

Exemplo para uma próxima versão 1.1.1, depois dos testes e da preparação dos arquivos:

```sh
gh release create v1.1.1 android/build/github-release/equacao-android-1.1.1.apk android/build/github-release/android-update.json android/build/github-release/equacao-android-1.1.1.apk.sha256 --repo CauaGabrieI/MathApp --target main --title "Equação 1.1.1" --notes-file /caminho/notas.md --draft
gh release edit v1.1.1 --repo CauaGabrieI/MathApp --draft=false --latest
```

Um push de código sozinho não produz uma atualização instalável: é necessário publicar uma release com o APK assinado e seu manifesto. O script de preparação não publica nem inclui chaves privadas. A publicação usa a autenticação local do mantenedor via `gh`, fora do app. O repositório precisa permanecer público para a consulta sem login funcionar.

Referências: [GitHub Releases API](https://docs.github.com/en/rest/releases/releases#get-the-latest-release) e [limites da API pública](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).

### Verificação da atualização 1.0.1

`npm test` cobre oito arquivos de testes, incluindo preparação do manifesto e o botão/ponte Android. Os cinco testes Java adicionais cobrem comparação por código Android, adiamento e consulta manual, rejeição de aplicativo/artefato incompatível e restrição de origens/redirecionamentos. A compilação release, os sete testes Java e o lint passaram. A assinatura original e o alinhamento foram verificados. Ainda não houve teste do aviso e da instalação em aparelho físico ou emulador.

## Design system · versão 1.1.0

O app usa os [fundamentos e componentes compartilhados do Equação](../design/README.md). `design/tokens.json` gera tanto o CSS quanto os recursos Android. O fundo nativo, as barras e o diálogo de atualização usam a mesma paleta; o aviso acompanha a escolha de aparência do app. O CSS do app padroniza contraste, tipos de texto, campos, ações, cards, alternativas e estados. As fontes continuam incluídas no APK.

Validação: nove arquivos de testes Node, incluindo os pares de contraste principais; sete testes Java, build release e lint sem erros. Revisão da interface compartilhada no navegador em desktop, 390 e 320 px, claro/escuro, teclado, diálogo, enunciado real e histórico vazio. O teste no navegador não substitui a validação em aparelho Android ou TalkBack, que ainda não foi realizada.
