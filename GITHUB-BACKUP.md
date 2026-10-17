# Login e backup privado no GitHub

No app, abra **Preferências → Conta e backup no GitHub → Conectar com GitHub**. Digite o código exibido em `https://github.com/login/device`, confira o nome Equação e autorize. Volte ao app para escolher **Salvar agora**, **Restaurar da minha conta** ou **Ativar backup automático**.

Cada usuário usa sua própria conta e seu repositório privado `equacao-backup`, arquivo `equacao-backup.json`. O app funciona offline sem conta. Conectar não envia dados de estudo; salvar ou ativar o automático autoriza o envio de todos os dados de estudo locais para a conta indicada. O automático funciona enquanto o app está aberto, aguarda 12 segundos após alterações e tenta novamente ao recuperar a conexão/voltar ao app. Também verifica alterações locais periodicamente. Não é uma tarefa agendada pelo Android com o app encerrado.

O backup contém IDs originais de todas as questões vistas, respostas e datas, associação com o mapa, marcações de estudo e último tópico. Não contém token, senha, chave de API, dados de outros repositórios ou conteúdo completo do banco ENEM. As questões são reconstruídas a partir do banco incluído no app; se uma versão não reconhecer algum ID do backup, a restauração inteira é recusada e pede atualização, sem apagar dados. As questões da versão inicial de operações básicas têm um registro compatível separado. O backup tem limite de 8 MiB.

Restauração e sincronização juntam os registros; não substituem o banco local nem criam cards para questões não respondidas. Para a mesma questão, a primeira resposta concluída é preservada. Nas marcações de estudo, prevalece a alteração com data mais recente, inclusive desmarcar. Datas usam o relógio dos aparelhos. As gravações usam o SHA da Contents API; conflito retorna à leitura/mesclagem, com no máximo três tentativas. A mesclagem local ocorre numa transação IndexedDB, preservando respostas concorrentes em outra aba.

O app verifica proprietário, privacidade, estado e marcador do backup antes de escrever. Um repositório público, de outra conta, arquivado, fork ou já existente sem um backup reconhecido é recusado. Não há exclusão de repositórios nem mudanças de visibilidade. Limpar histórico local desativa o automático neste aparelho e não apaga backups nem os commits anteriores no GitHub; restaurar/sincronizar pode recuperar esses registros. O repositório é privado, mas o JSON do progresso não é criptografado ponta a ponta: o GitHub e pessoas a quem o usuário conceder acesso ao repositório podem lê-lo.

## Cadastro do mantenedor

O Client ID em `public/github-config.json` é público e identifica o OAuth App Equação. Não concede acesso a nenhuma conta sozinho. O GitHub OAuth App deve habilitar **Device Flow**. Homepage e Redirect URI podem apontar para a página do projeto, já que o fluxo não usa callback. Para esta implementação sem segredo no Android, mantenha **Expire user access tokens** desmarcado. Se a opção for ativada, o login ainda funciona até a expiração, e o usuário terá que reconectar; refresh tokens não são utilizados. A sessão do app também é limitada a 30 dias.

A autorização solicita somente `repo`, necessária no OAuth App para criar/gravar backup privado. Essa permissão do GitHub é ampla: cobre outros repositórios públicos/privados. A tela informa a abrangência antes de conectar. Os adaptadores do Equação restringem as operações a `/user`, criação de `equacao-backup` e acesso ao arquivo de backup na conta identificada. Não há proxy autenticado de URL livre. Nenhuma credencial `gh` do mantenedor é usada no app. Para uma futura permissão restrita à seleção de repositórios, é necessário migrar para GitHub App e seu fluxo de instalação; isso não equivale ao atual OAuth App.

No Android, o token fica em SharedPreferences privado, criptografado com AES-GCM por chave não exportável no Android Keystore, sem entrar na WebView. A ponte aceita ações fixas apenas do frame principal na origem local do app. Desconectar apaga a sessão deste aparelho e desativa o automático. Isso não revoga a autorização no provedor; a tela oferece o link para `https://github.com/settings/applications`.

Na web, `github-service.js` roda somente no servidor. Configure `GITHUB_SESSION_KEY` com 32 bytes aleatórios em hexadecimal (64 caracteres), como segredo no ambiente do servidor. Nunca o inclua no código, manifesto ou bundle público. `GITHUB_CLIENT_ID` pode substituir o Client ID público. Tokens e códigos internos de dispositivo ficam em cookie criptografado AES-GCM, `__Host-`, HttpOnly, Secure e SameSite=Strict, com expiração. As rotas são POST same-origin, validam Origin/JSON, limitam tamanhos e respondem sem cache. O service worker não intercepta essas rotas. A autenticação de acesso ao site pela hospedagem continua independente da conexão opcional ao GitHub. Cada navegador tem sua sessão; não existe um token global do mantenedor para backups.

## Verificação

`npm run build && npm test` verifica o serviço com respostas simuladas do GitHub, protocolo de Device Flow, intervalo/slow_down, negação/expiração, identidade, CSRF, cookie, isolamento por conta, criação privada, proteção de repositório preexistente, conflitos e restauração concorrente no IndexedDB. `./gradlew --no-daemon assembleRelease testDebugUnitTest lintRelease` valida a compilação Android e regressões do atualizador. A preparação da release confere assinatura original, versão, pacote e alinhamento.

A iniciação real do Device Flow e o login web na prévia com a conta do usuário foram verificados. O usuário preferiu deixar o teste de backup para o celular: criação do repositório, ida/volta entre dois aparelhos e armazenamento no Android Keystore ainda precisam dessa validação; testes simulados e de navegador não comprovam essa etapa. Nenhum backup real do usuário foi enviado durante os testes.

Referências: [Device Flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow), [escopos OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps), [Contents API](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents), [Android Keystore](https://developer.android.com/privacy-and-security/keystore).

## Atualização 1.3.0

O schema 2 inclui as aulas do novo roadmap, tentativas de prova e revisões dos cards. A leitura do schema 1 permanece suportada. O repositório e a autenticação não mudaram. Versões antigas do app recusam o novo formato antes de gravar; atualize os aparelhos para restaurá-lo. Veja [LEARNING-FLOW.md](LEARNING-FLOW.md).
