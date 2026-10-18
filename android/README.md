# Equação para Android

Aplicativo Android instalável (`br.com.equacao.app`, versão 1.5.2, `versionCode 10`), Android 8.0/API 26 ou superior. É um app híbrido: uma Activity Android reutiliza a interface existente em uma WebView local, com assets incluídos no APK, armazenamento próprio e integração nativa para rede, links, exportação e botão de voltar. Não é um atalho do navegador e não abre o site privado para funcionar.

## Incluído no app

- Mapa de 25 módulos e 199 subtópicos; prática por matéria e subtópico; correção e cards após responder.
- Fluxo de aprendizagem com diagnóstico inicial, aulas por matéria e avaliação final comparável ao diagnóstico.
- Banco de 1.305 questões incluídas no APK: 581 do enem.dev e 724 da EnemHub. IDs originais e prevenção de repetições são preservados.
- Histórico, estudo e preferências persistidos no armazenamento privado da WebView, separados do navegador.
- Fontes e arquivos da interface locais. O app abre e permite praticar sem internet desde a primeira instalação; imagens ainda não carregadas e videoaulas precisam de conexão.
- Atualização individual de questões do enem.dev quando online. O acervo EnemHub desta versão é a cópia importada: o APK não contém a chave e não faz consultas autenticadas à EnemHub.
- Busca e confirmação de videoaulas por contexto de questão autoral e ENEM nos canais autorizados, reutilizando o serviço JavaScript existente através de um transporte HTTPS nativo. Canal e oEmbed oficial são verificados; somente resultados confirmados são sugeridos.
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

### Versão 1.5.2

Preferências inclui o controle de atualizações automáticas. A tela de aula usa três abas reais, com cabeçalho fixo e rolagem no painel: Teoria, Videoaula e Exercícios. Trocar de aba preserva a seleção, a questão e a correção; sair de Videoaula interrompe o player e preserva a escolha do vídeo. Somente concluir a aula altera o progresso de conclusão.

As 199 aulas atuais receberam resumos próprios, passos de resolução, exemplos resolvidos e alertas de erros comuns. Os materiais de apoio anteriores continuam disponíveis. IDs, ordem curricular e associações de exercícios não mudaram.

A busca oferece até 12 vídeos confirmados, com consultas por conceito, sinônimos editoriais e rejeição de assuntos vizinhos. Continua restrita aos oito canais autorizados. O limite não garante 12 resultados em todo assunto: vídeos sem confirmação de autoria, disponibilidade ou tema são descartados.

A consulta automática acontece ao abrir/retomar o app, no máximo uma vez por dia. Há também Preferências → Verificar atualizações. A opção **Atualizações automáticas**, inicialmente desativada, permite buscar e preparar uma nova versão dentro do app sem o aviso intermediário. A escolha fica salva no Android e ativá-la inicia uma consulta. Pode usar dados móveis; não há atualização agendada com o app fechado. O instalador Android continua exigindo confirmação e, quando necessário, a autorização para instalar desta fonte.

Com a opção desativada ou em consultas manuais, o aviso oferece Atualizar agora e Agora não. Adiar silencia aquela versão por 24 horas, inclusive a preparação automática; a consulta manual ignora o adiamento. Falhas automáticas ficam silenciosas e permitem nova consulta após uma hora; consultas manuais informam problemas de conexão/limite do GitHub. A preferência não interfere no histórico de estudo nem no backup.

A release precisa conter `android-update.json` e o APK com o nome indicado nele. O app compara o `versionCode` Android, confere o identificador do aplicativo, a tag estável, o nome, o tamanho e o endereço do APK no mesmo repositório. Quando o GitHub fornece um digest, compara-o com o SHA-256 do manifesto. Depois de aceitar, o usuário vê o progresso dentro do app. O APK é baixado para `files/updates`, no armazenamento privado, sem navegador nem pasta Downloads. Antes de abrir o instalador, o app confere tamanho e SHA-256 dos bytes, pacote, versão mais nova e os certificados atuais do aplicativo instalado. A instalação é iniciada pelo próprio app e confirmada na tela do Android. Os dados locais são mantidos numa atualização normal, com mesmo pacote e assinatura.

Sem release pública ou arquivo Android válido, nenhum download é sugerido. Rascunhos, pré-lançamentos e versões com código igual ou menor são ignorados. A versão 1.0.0 não tinha esse recurso: instale uma versão recente uma vez por cima dela. As versões 1.0.1 e 1.1.0 tinham somente download pelo navegador; a 1.1.1 precisa ser instalada uma vez por esse fluxo antigo para ativar o instalador interno nas próximas atualizações. Não desinstale para atualizar, pois isso apaga os dados do app. O recurso é exclusivo do APK; a versão web conserva seu mecanismo de cache.

### Publicar uma próxima versão

1. Aumente `versionCode` e `versionName` em `app/build.gradle`. Exemplo: código 5 e nome 1.1.2. Use sempre a chave de assinatura original, guardada localmente.
2. Na raiz, execute `npm ci`, `npm run build` e `npm test`. Em `android/`, execute `./gradlew --no-daemon assembleRelease testDebugUnitTest lintRelease`.
3. Na raiz, com `ANDROID_HOME` configurado, execute `npm run android:release-files`. O script verifica assinatura, alinhamento, pacote e versão do APK antes de gerar os arquivos em `android/build/github-release/` (fora do Git).
4. Faça commit e push do código. Crie uma release estável `v<versionName>` apontando para esse commit, com os três arquivos gerados: APK, `android-update.json` e `.sha256`. Publique os arquivos juntos, inicialmente em rascunho e depois tornando a release pública e latest.

Exemplo para uma próxima versão 1.1.2, depois dos testes e da preparação dos arquivos:

```sh
gh release create v1.1.2 android/build/github-release/equacao-android-1.1.2.apk android/build/github-release/android-update.json android/build/github-release/equacao-android-1.1.2.apk.sha256 --repo CauaGabrieI/MathApp --target main --title "Equação 1.1.2" --notes-file /caminho/notas.md --draft
gh release edit v1.1.2 --repo CauaGabrieI/MathApp --draft=false --latest
```

Um push de código sozinho não produz uma atualização instalável: é necessário publicar uma release com o APK assinado e seu manifesto. O script de preparação não publica nem inclui chaves privadas. A publicação usa a autenticação local do mantenedor via `gh`, fora do app. O repositório precisa permanecer público para a consulta sem login funcionar.

Referências: [GitHub Releases API](https://docs.github.com/en/rest/releases/releases#get-the-latest-release) e [limites da API pública](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).

### Verificação da atualização 1.0.1

`npm test` cobre oito arquivos de testes, incluindo preparação do manifesto e o botão/ponte Android. Os cinco testes Java adicionais cobrem comparação por código Android, adiamento e consulta manual, rejeição de aplicativo/artefato incompatível e restrição de origens/redirecionamentos. A compilação release, os sete testes Java e o lint passaram. A assinatura original e o alinhamento foram verificados. Ainda não houve teste do aviso e da instalação em aparelho físico ou emulador.

## Design system · versão 1.1.0

O app usa os [fundamentos e componentes compartilhados do Equação](../design/README.md). `design/tokens.json` gera tanto o CSS quanto os recursos Android. O fundo nativo, as barras e o diálogo de atualização usam a mesma paleta; o aviso acompanha a escolha de aparência do app. O CSS do app padroniza contraste, tipos de texto, campos, ações, cards, alternativas e estados. As fontes continuam incluídas no APK.

Validação: nove arquivos de testes Node, incluindo os pares de contraste principais; sete testes Java, build release e lint sem erros. Revisão da interface compartilhada no navegador em desktop, 390 e 320 px, claro/escuro, teclado, diálogo, enunciado real e histórico vazio. O teste no navegador não substitui a validação em aparelho Android ou TalkBack, que ainda não foi realizada.

## Instalador interno · versão 1.1.1

Fluxo: Atualizar agora → progresso dentro do Equação → verificação de integridade e assinatura → confirmação do instalador Android. O usuário não precisa baixar um APK no navegador nem procurar/abrir um arquivo. O pacote continua sendo um APK internamente; a instalação sem confirmação não é permitida a um app comum.

Na primeira atualização interna, o Android pode exigir Permitir desta fonte para o Equação. O app abre somente a configuração da própria origem, por `ACTION_MANAGE_UNKNOWN_APP_SOURCES`, após o usuário aceitar o aviso. Ao voltar com autorização, revalida o arquivo e abre automaticamente o instalador. Negar, adiar ou cancelar mantém a versão instalada e todo o histórico. Nenhuma autorização é concedida automaticamente.

A permissão `REQUEST_INSTALL_PACKAGES` é usada somente para esse fluxo de atualização. O `UpdateFileProvider` não é exportado e só compartilha a pasta privada `updates/`, com acesso temporário de leitura para o instalador. Não existe acesso amplo ao armazenamento, à WebView, aos registros do aluno ou a outras pastas. A chamada dedicada `ACTION_INSTALL_PACKAGE`, compatível com o Android mínimo do app, recebe somente uma URI `content://` do arquivo verificado. O Android também verifica a assinatura antes de instalar.

O download usa HTTPS para a release exata do MathApp e permite redirecionamento somente para o CDN do GitHub, com limite de tamanho, cancelamento, arquivo parcial e renomeação após conferir tamanho/SHA-256. O arquivo pronto é revalidado antes de instalar ou retomar depois das configurações. A versão e o conjunto de certificados devem corresponder ao app instalado; downgrade, outro pacote ou outra chave são rejeitados. A chave privada de assinatura continua somente no computador do mantenedor.

Uma atualização já verificada fica salva para nova tentativa se o usuário cancelar o instalador. O app limpa os arquivos de atualização antigos depois de reconhecer uma versão instalada mais nova. Partes antigas de download também são descartadas. O download pode ser interrompido se o Android encerrar o processo; uma nova tentativa baixa novamente a parte incompleta. Se o processo for recriado durante a autorização, o manifesto e o arquivo pronto permitem retomar sem confiar em dados não verificados. A limpeza é restrita à pasta de atualizações e não altera o histórico.

Validação desta versão: build release, 12 testes Java (incluindo truncamento, bytes excedentes, alteração de conteúdo, cancelamento, redirecionamentos, versão/pacote e troca de assinatura), nove arquivos de testes Node, lint sem erros, assinatura e alinhamento do APK. Não havia dispositivo conectado ou emulador; a confirmação real da permissão e da instalação ainda precisa de teste em aparelho Android.

Roteiro para aparelho: instalar esta versão por cima da anterior, publicar uma próxima versão com código maior e mesma chave, verificar atualizações, aceitar Atualizar agora, testar cancelamento do progresso, negar e depois conceder a autorização, cancelar e repetir a instalação, confirmar e conferir a versão e o histórico preservado.

Referências: [FileProvider e permissões temporárias](https://developer.android.com/reference/androidx/core/content/FileProvider), [intenção de instalação e confirmação do Android](https://developer.android.com/reference/android/content/Intent#ACTION_INSTALL_PACKAGE).

## Conta e backup · versão 1.2.0

Login opcional pelo GitHub com Device Flow; backup privado em `equacao-backup` da conta conectada, restauração com mesclagem e automático opcional enquanto o app estiver aberto. Histórico e prática offline continuam independentes da conexão. A assinatura e o pacote Android são os mesmos das versões anteriores.

Veja [GITHUB-BACKUP.md](../GITHUB-BACKUP.md) para uso, configuração, escopo `repo`, proteção das credenciais, conflitos, limites e roteiro de validação com uma conta real.

## Fluxo de aprendizado · versão 1.3.0

O APK inclui o novo roadmap, aulas, exemplos, provas, exercícios e cards para estudar offline. A conclusão de todas as aulas de um módulo libera a prática misturada e a revisão rápida, sem nota mínima. Videoaulas continuam dependendo da confirmação no YouTube; agora também é permitido o canal Umberto Mannarino. O backup schema 2 inclui provas e revisões e mantém compatibilidade de leitura com o schema 1. Atualize todos os aparelhos antes de restaurar dados do novo formato. Detalhes em [LEARNING-FLOW.md](../LEARNING-FLOW.md).

## Diagnóstico e avaliação final · versão 1.5.0

Antes de concluir as aulas, o aluno pode responder ao diagnóstico inicial. Depois das aulas, a avaliação final permite comparar os dois resultados. A comparação não cria uma nota de domínio nem bloqueia a prática. As provas autorais evitam repetir questões de tentativas anteriores enquanto existirem questões inéditas; ao esgotar o conjunto, informam a situação honestamente.

A navegação usa **Aprender → Matérias**. O hero foi removido, as rails ficam dentro da etapa e a prática não exibe banner, dica ou fonte. Login, backup privado do GitHub e atualização pelo GitHub continuam disponíveis. Videoaulas usam o contexto da questão autoral e do ENEM; canal e oEmbed são confirmados, e a resposta fica vazia sem confirmação.

O `versionCode` desta entrega é 8. `assembleRelease`, `testDebugUnitTest`, `lintRelease` e `android:release-files` concluíram com a assinatura verificada. A validação no navegador confirmou o ciclo diagnóstico → aulas → avaliação final, a comparação após recarregar, as três rails em suas próprias etapas e ausência de overflow. Não houve aparelho ou emulador, e o backup real ficou fora do teste por escolha do usuário.
