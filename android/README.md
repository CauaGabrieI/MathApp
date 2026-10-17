# Equação para Android

Aplicativo Android instalável (`br.com.equacao.app`, versão 1.0.0), Android 8.0/API 26 ou superior. É um app híbrido: uma Activity Android reutiliza a interface existente em uma WebView local, com assets incluídos no APK, armazenamento próprio e integração nativa para rede, links, exportação e botão de voltar. Não é um atalho do navegador e não abre o site privado para funcionar.

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
