# Privacidade e credenciais

O repositório público contém o código, o currículo e questões educacionais. Histórico de estudo, backups, tokens de login, variáveis de ambiente e chaves privadas de assinatura pertencem ao dispositivo ou ao armazenamento privado do proprietário.

- Guarde `ENEMHUB_API_KEY` e outras credenciais no gerenciador de segredos do ambiente. Somente exemplos vazios de configuração podem ser versionados.
- O Client ID público do OAuth identifica o aplicativo; não é um Client Secret. Tokens de acesso nunca devem estar no código ou nos relatórios.
- A chave privada de assinatura Android e suas senhas ficam em `android/.android-signing/`, ignorado pelo Git. Os certificados públicos e APKs distribuídos não contêm a chave privada.
- Os arquivos locais, pacotes compilados, exportações e relatórios são ignorados. `.gitignore` não remove um arquivo que já foi versionado e não corrige commits antigos.
- Execute `npm run privacy:check` antes de enviar código. O verificador procura arquivos privados, segredos reconhecíveis e caminhos pessoais sem imprimir os valores encontrados. Uma verificação automática não substitui uma revisão manual.
- Configure o Git com seu nome de usuário público e o e-mail `noreply` disponibilizado pelo GitHub. Evite seu endereço pessoal nos metadados de commits e tags.

Uma credencial publicada deve ser revogada no serviço de origem, mesmo após sua remoção do histórico. Reescrever o histórico elimina referências controladas pelo projeto; cópias externas e caches do provedor exigem tratamento separado.
