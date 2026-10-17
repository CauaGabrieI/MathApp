# Equação

App web instalável (PWA), em português, para praticar matemática com questões reais do ENEM. Layout responsivo inspirado no Material Design, com navegação inferior no celular, temas claro/escuro, sorteio e histórico de cards.

## Fontes

- **enem.dev é a fonte principal**, selecionada na primeira abertura. A API fornece contexto em Markdown, arquivos, alternativas, gabarito, ano e número da questão. Não fornece dificuldade: o app identifica explicitamente sua estimativa, baseada em extensão do texto, recursos visuais e termos do enunciado. Essa estimativa não tem validação pedagógica e não corresponde à classificação oficial do ENEM.
- **EnemHub é a fonte alternativa**. Preserva o HTML do enunciado, as imagens, o UUID nativo, a dificuldade fornecida e o gabarito. A chave é uma variável secreta `ENEMHUB_API_KEY` do servidor. Nunca precisa estar no navegador.
- Acervo inicial importado em 17/10/2026: 581 registros de matemática do enem.dev (2009–2023) e 724 da EnemHub. Registros com alternativas incompletas ou sem o texto de contexto necessário foram excluídos. Não representa todo o acervo disponível de cada serviço.

Documentação: https://docs.enem.dev e https://docs.enemhub.com.br.

## Executar localmente

Requer Node.js 22 ou mais recente; o projeto não tem dependências de build.

```sh
npm run build
npm run dev
```

Abra http://localhost:4173. Para consultar a EnemHub ao vivo no servidor local, injete `ENEMHUB_API_KEY` no ambiente do processo usando seu gerenciador de segredos. Sem ela, o acervo importado continua funcionando. O servidor local recebe a variável de ambiente e nunca a envia ao cliente.

## Instalar no Android

Abra a versão HTTPS publicada no Chrome e escolha ⋮ → Instalar aplicativo / Adicionar à tela inicial. É uma PWA, não um APK. Os textos, alternativas e histórico ficam disponíveis offline após o primeiro carregamento completo. As últimas 100 imagens visualizadas são guardadas em cache. As imagens ainda não visitadas precisam de conexão. Um aviso aparece quando uma imagem não carrega.

## Identificação e histórico

A aplicação salva o registro **antes de exibir** cada questão. Usa IndexedDB e uma transação única de leitura e escrita, serializada entre abas, para consultar questões vistas, selecionar uma inédita e reservar sua chave:

- `enemhub:<UUID original>`
- `enemdev:<ano>:<número original>`

Enunciados idênticos normalizados também recebem uma chave de conteúdo compartilhada entre fontes. Isso bloqueia duplicatas textuais exatas; não identifica reescritas do mesmo problema. Questões não respondidas ficam no histórico e não voltam no sorteio. O usuário pode retomá-las explicitamente pelo card. O esgotamento de um filtro é comunicado e não reinicia o histórico. Respostas antigas da primeira prévia continuam legíveis.

O histórico é local a este navegador/dispositivo. Não há sincronização entre aparelhos. A exportação JSON permite guardar uma cópia; limpar os dados do navegador remove os registros.

## API do app

- `GET /api` — acervo normalizado, com filtros `source=enemdev|enemhub|all`, `level=EASY|MEDIUM|HARD` e `limit`.
- `GET /api/question?id=...` — atualiza uma questão pelo identificador da fonte, com cache e fallback para a cópia importada. Chama o provedor pelo servidor; os clientes nunca recebem a chave.
- `GET /api/random` — sorteio, por padrão na fonte principal; aceita filtros e parâmetros `exclude` repetidos. O navegador usa a seleção transacional local para garantir exclusão do histórico e funcionamento offline.
- `GET /api/image?url=...` — proxy de imagens restrito aos domínios das fontes; permite cache offline e rejeita outros destinos/protocolos.

As chamadas individuais ao enem.dev são enfileiradas com intervalo de 1,1 segundo por instância. Os registros importados permitem continuar estudando durante indisponibilidade ou limites de API. O cache individual de questões dura 24 horas por instância. Em uma implantação com muitos usuários, um limitador central deve coordenar as chamadas entre instâncias.

## Formatação e verificação

Markdown: Marked 15.0.12. Sanitização HTML: DOMPurify 3.2.7. Bibliotecas servidas localmente; atributos de estilo e execução são removidos, mantendo parágrafos, listas, tabelas, imagens, sobrescritos e subscritos. As alternativas seguem a ordem original A–E. Há ampliação das imagens e rolagem de tabelas.

```sh
npm test
```

Os testes verificam IDs, filtros, exclusões, alternativas e gabaritos, dificuldade por fonte, integridade do histórico, proteção do proxy, ausência de credenciais públicas e recursos necessários para instalação. Os níveis estimados continuam sendo uma limitação pedagógica explícita.

## Licenças e créditos

Os dados do enem.dev provêm de https://github.com/yunger7/enem-api, sob GPL-2.0; uma cópia está em ENEM-API-LICENSE. Os enunciados originais são do ENEM/INEP. A EnemHub fornece seu acervo segundo os termos do serviço. Marked e DOMPurify mantêm seus avisos de licença nos arquivos distribuídos. Este repositório não contém chaves de acesso.
