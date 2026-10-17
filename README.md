# MathApp — Equação

Aplicativo Android e versão web instalável (PWA), em português, para praticar matemática com questões reais do ENEM. O mapa de aprendizagem é a página inicial. Layout responsivo inspirado no Material Design, com navegação inferior no celular, temas claro/escuro, prática por matéria, sorteio dentro do conteúdo e histórico de cards.

## Fontes

- **enem.dev é a fonte principal**. A seleção padrão “As duas fontes” inclui também a EnemHub. A API fornece contexto em Markdown, arquivos, alternativas, gabarito, ano e número da questão. Não fornece dificuldade: o app identifica explicitamente sua estimativa, baseada em extensão do texto, recursos visuais e termos do enunciado. Essa estimativa não tem validação pedagógica e não corresponde à classificação oficial do ENEM.
- **EnemHub é a fonte alternativa**. Preserva o HTML do enunciado, as imagens, o UUID nativo, a dificuldade fornecida e o gabarito. A chave é uma variável secreta `ENEMHUB_API_KEY` do servidor. Nunca precisa estar no navegador.
- Acervo inicial importado em 17/10/2026: 581 registros de matemática do enem.dev (2009–2023) e 724 da EnemHub. Registros com alternativas incompletas ou sem o texto de contexto necessário foram excluídos. Não representa todo o acervo disponível de cada serviço.

Documentação: https://docs.enem.dev e https://docs.enemhub.com.br.

## Design system

O [design system do Equação](design/README.md) centraliza cores semânticas claras/escuras, tipografia, espaçamento, formas, movimento e componentes. `design/tokens.json` gera as variáveis CSS e as cores Android. As telas compartilham `public/components.css`; os valores anteriores de cor e tamanho de texto foram substituídos por tokens.

Execute `npm run build` e `npm run dev`, e abra `/design-system.html` para o guia interativo. `npm run design:check` verifica se os recursos gerados estão atualizados. O guia pode ser exportado como HTML independente, com fontes incluídas, conforme a documentação. A versão Android 1.1.0 aplica o sistema e conserva o histórico e a assinatura das versões anteriores.

## Executar localmente

Requer Node.js 22 ou mais recente; o projeto não tem dependências de build.

```sh
npm run build
npm run dev
```

Abra http://localhost:4173. Para consultar a EnemHub ao vivo no servidor local, injete `ENEMHUB_API_KEY` no ambiente do processo usando seu gerenciador de segredos. Sem ela, o acervo importado continua funcionando. O servidor local recebe a variável de ambiente e nunca a envia ao cliente.

## Instalar no Android

O projeto Android está em [`android/`](android/README.md), com instruções para gerar o APK. Requer Android 8.0 ou superior. O aplicativo inclui a interface e o acervo localmente, com histórico próprio, exportação pelo seletor de arquivos e integração nativa de rede. Imagens ainda não carregadas e videoaulas precisam de internet. Consulte o README Android para os requisitos de compilação e as limitações de validação.

Baixe o APK em [GitHub Releases](https://github.com/CauaGabrieI/MathApp/releases/latest). A partir da versão 1.0.1, o app verifica novas releases ao abrir e oferece baixar ou adiar a atualização. Há consulta manual em Preferências. O download abre no navegador e a instalação é confirmada pelo Android. As próximas versões precisam ser publicadas com APK assinado e manifesto, conforme o [guia Android](android/README.md#atualizações-pelo-github).

Também é possível instalar a versão web publicada pelo menu do Chrome → Instalar aplicativo / Adicionar à tela inicial. Na PWA, textos, alternativas e histórico ficam disponíveis offline após o primeiro carregamento completo. As últimas 100 imagens visualizadas são guardadas em cache. As imagens ainda não visitadas precisam de conexão. Um aviso aparece quando uma imagem não carrega.

## Identificação e histórico

A aplicação salva o registro **antes de exibir** cada questão. Usa IndexedDB e uma transação única de leitura e escrita, serializada entre abas, para consultar questões vistas, selecionar uma inédita e reservar sua chave:

- `enemhub:<UUID original>`
- `enemdev:<ano>:<número original>`

Enunciados idênticos normalizados também recebem uma chave de conteúdo compartilhada entre fontes. Isso bloqueia duplicatas textuais exatas; não identifica reescritas do mesmo problema. Questões não respondidas ficam registradas internamente para não voltar no sorteio, mas não aparecem nos cards. Apenas depois de conferir uma resposta o usuário ganha um card, com a alternativa marcada e seu resultado. A questão em andamento pode ser retomada ao reabrir o app. O esgotamento de um filtro é comunicado e não reinicia o histórico. Respostas antigas da primeira prévia continuam legíveis.

O histórico é local a este navegador/dispositivo. Não há sincronização entre aparelhos. A exportação JSON contém os cards concluídos e os IDs já vistos para guardar uma cópia; limpar os dados do navegador remove os registros.

## API do app

- `GET /api` — acervo normalizado, com filtros `source=enemdev|enemhub|all`, `level=EASY|MEDIUM|HARD` e `limit`.
- `GET /api/question?id=...` — atualiza uma questão pelo identificador da fonte, com cache e fallback para a cópia importada. Chama o provedor pelo servidor; os clientes nunca recebem a chave.
- `GET /api/random` — sorteio, por padrão na fonte principal; aceita filtros e parâmetros `exclude` repetidos. O navegador usa a seleção transacional local para garantir exclusão do histórico e funcionamento offline.
- `GET /api/image?url=...` — proxy de imagens restrito aos domínios das fontes; permite cache offline e rejeita outros destinos/protocolos.

As chamadas individuais ao enem.dev são enfileiradas com intervalo de 1,1 segundo por instância. Os registros importados permitem continuar estudando durante indisponibilidade ou limites de API. O cache individual de questões dura 24 horas por instância. Em uma implantação com muitos usuários, um limitador central deve coordenar as chamadas entre instâncias.

## Formatação e verificação

Markdown: Marked 15.0.12. Sanitização HTML: DOMPurify 3.2.7. Bibliotecas servidas localmente; atributos de estilo e execução são removidos, mantendo parágrafos, listas, tabelas, imagens, sobrescritos e subscritos. As alternativas seguem a ordem original A–E. Há ampliação das imagens e rolagem de tabelas.

```sh
npm ci # instala somente a dependência de teste fake-indexeddb
npm test
```

Os testes verificam IDs, filtros, exclusões, alternativas e gabaritos, dificuldade por fonte, integridade do histórico, proteção do proxy, ausência de credenciais públicas e recursos necessários para instalação. Os níveis estimados continuam sendo uma limitação pedagógica explícita.

## Licenças e créditos

Os dados do enem.dev provêm de https://github.com/yunger7/enem-api, sob GPL-2.0; uma cópia está em ENEM-API-LICENSE. Os enunciados originais são do ENEM/INEP. A EnemHub fornece seu acervo segundo os termos do serviço. Marked e DOMPurify mantêm seus avisos de licença nos arquivos distribuídos. Este repositório não contém chaves de acesso.

## Videoaulas e sugestões

A aba Videoaulas permite filtrar 14 temas de matemática e os sete canais autorizados pelo usuário: Pedro Assaad, Universo Narrado, Método Questiona, Paulo Jubilut, Dicasdemat Sandro Curió, Gis com Giz e Universo Narrado Militares.

Sem respostas concluídas, o app sugere matemática básica/introdução. Depois, usa o tema reconhecido no enunciado ou na classificação da fonte. Se não conseguir reconhecer o tema, não insere uma sugestão junto à questão. A aba permite escolher outro tema manualmente.

`GET /api/videos?topic=basics&channel=all` pesquisa nas páginas públicas de busca dos canais, valida o ID do canal nos resultados e confirma cada vídeo no oEmbed oficial do YouTube. O catálogo curado de apoio também passa pela verificação ao vivo. Vídeos removidos, privados, de outro canal, não verificáveis ou sem relação confirmada com o tema são omitidos. A disponibilidade pode mudar depois da verificação; o cache de resultados dura até 10 minutos e a verificação de metadados até 15 minutos. Erros e ausência de resultados não geram recomendações substitutas. A indisponibilidade offline oculta novas sugestões.

A busca pública do YouTube não é um contrato estável e pode ser bloqueada ou mudar de formato. Nesses casos, o catálogo de apoio continua sendo verificado; se a verificação também falhar, a lista fica vazia. Não há garantia de encontrar todas as aulas existentes nos canais. O app abre o vídeo original no YouTube; não baixa nem hospeda os vídeos e não requer uma chave adicional do YouTube.


## Mapa de aprendizagem

A rota inicial `#mapa` integra o currículo de Matemática ao mesmo aplicativo JavaScript nativo, sem framework novo, iframe ou biblioteca de grafos. São 25 módulos e 199 subtópicos, preservados do Markdown fornecido. Os oito ramos usam HTML/CSS e conexões SVG decorativas em uma seção expansível; a versão mobile reorganiza os nós em cards legíveis. O visual compartilha as cores, fontes e superfícies do aplicativo nos temas claro e escuro. O progresso e a continuidade aparecem antes da lista de matérias. Há pesquisa sem acentos e por palavras, filtros combinados, acordeões, detalhes, conhecimentos recomendados, relações entre módulos, continuidade e prática por conteúdo.

### Dados e manutenção

- `public/curriculum.json`: disciplina, oito áreas, módulos, subtópicos, níveis de conteúdo, sequência e pré-requisitos recomendados. IDs como `math.m09.t01` não dependem do nome exibido.
- `scripts/import-curriculum.mjs`: importador do Markdown e validação de quantidade, referências e ciclos. Para importar, execute `node scripts/import-curriculum.mjs /caminho/ENEM_mapa_mental_completo.md`. O currículo anterior é usado para preservar IDs. Mudanças ambíguas de nome e posição exigem revisão do diff antes de publicar.
- `question-classifier.js`: regras explícitas de termos matemáticos aplicadas à classificação e ao enunciado durante a build.
- `public/curriculum-index.json`: índice de IDs de questões por conteúdo. Não duplica enunciados, alternativas ou gabaritos e pode ser carregado sem carregar o banco inteiro.
- `public/learning-model.js`: filtros, estatísticas, continuidade e validação do grafo.
- `public/learning-map.js`: apresentação e eventos da tela; delega a persistência e a prática ao aplicativo existente.

A ordem do Markdown foi preservada como sequência recomendada, mas não foi convertida em uma corrente obrigatória. Geometria não depende de progressões apenas por aparecer depois; estatística não depende de toda a geometria. Os avisos de bases recomendadas permitem navegar para elas e continuar livremente.

### Exercícios e limitações pedagógicas

O botão de prática envia os IDs de questões associadas ao mecanismo transacional existente. Mantém filtro de fonte, prevenção de repetições, alternativas e correção. A prática é escolhida por matéria e subtópico, sem filtro adicional de dificuldade: a etapa vem do currículo. Metadados de dificuldade das fontes continuam preservados nos registros antigos. O nível curricular Básico/Intermediário/Avançado é independente da dificuldade Fácil/Médio/Difícil da questão. O retorno ao mapa preserva os filtros e o progresso.

A associação inicial alcança 102 dos 199 subtópicos; os demais exibem a ausência de exercícios. Todos os 25 módulos têm ao menos uma associação. As regras são automáticas e podem omitir questões ou produzir associações imprecisas: não constituem curadoria pedagógica. Não se pressupõe que o acervo cubra integralmente o currículo. Há casos vazios mesmo quando o módulo mais amplo contém questões.

Não há teoria própria cadastrada nem um modelo validado de domínio. A interface informa essas ausências. Marcar um tópico como estudado altera somente o checklist; abrir um tópico registra onde o aluno parou; respostas concluídas alimentam as contagens e a taxa de acerto. Nenhuma dessas ações gera domínio automaticamente.

### Persistência e migração

IndexedDB `equacao-history`, versão 2: as stores antigas `records` e `meta` são preservadas, e a store `learning` registra `id`, `studied`, `startedAt`, `studiedAt` e `updatedAt`. A store `meta` guarda o último tópico, os filtros do mapa e o contexto de prática. A exportação JSON inclui o estudo manual, último tópico e filtros, além das respostas concluídas e IDs vistos. Não há conta, backend de progresso, sincronização entre dispositivos ou importação do backup pela interface nesta versão.

Limpar o histórico de exercícios não apaga o checklist de estudo. Limpar os dados do site pelo navegador apaga ambos. O cache é versionado separadamente dos dados IndexedDB; atualizar o aplicativo não reinicia o progresso. A navegação tenta obter a versão atual e recorre à cópia local quando offline. O banco de questões é carregado apenas ao entrar na prática, não para abrir o mapa.

### Validação

`npm test` cobre fidelidade ao Markdown, pré-requisitos e ciclos, IDs estáveis, filtros combinados, contagens e separação entre estudo/desempenho, associação de questões, migração IndexedDB v1→v2, reserva concorrente, persistência após reabrir e conservação do estudo ao limpar exercícios. Os testes de API, formatação, histórico e videoaulas continuam na mesma suíte. `fake-indexeddb` é apenas uma dependência de desenvolvimento; não vai para o app ou Worker.

A validação manual no navegador incluiu desktop e celular de 390 e 320 pixels: ramos, busca, acordeões, detalhes, marcação de estudo, recarregamento, prática de coeficientes angular/linear, correção e retorno ao mapa, tópico sem questões, preferências no mobile, cards vazios sem respostas e videoaulas introdutórias. A confirmação ao vivo do YouTube depende de rede; indisponibilidade não gera vídeos inventados.


## Fluxo de aprendizagem como início do app

O mapa é a página inicial também ao instalar a PWA. A primeira opção no menu é Meu aprendizado (Aprender no celular). Matérias e subtópicos têm botões de prática, inclusive tópicos sem questões: estes abrem a prática com o nome escolhido e um estado vazio honesto. Abrir Praticar diretamente restaura o conteúdo selecionado; sem seleção anterior, usa o último tópico válido ou a primeira matéria. O sorteio nunca remove o filtro de conteúdo.

`public/learning-flow.js` centraliza seleção, restauração e validação da prática. Ao restaurar contextos antigos, descarta a escolha de dificuldade e reconstrói os IDs permitidos a partir do índice curricular. O histórico e as marcações de estudo são preservados. O progresso passa a exibir matérias em vez de uma separação por dificuldade.

O painel de tópico inclui a videoaula confirmada, com miniatura, título, canal e reprodução integrada ao clicar. `GET /api/videos?content=math.m01.t01` aceita somente IDs curriculares existentes. `public/lesson-topics.js` define a consulta e a correspondência do assunto; o servidor verifica também o canal e o oEmbed oficial. Um vídeo genérico de equações não substitui uma aula de sistema decimal. Se nenhum vídeo puder ser confirmado, o painel informa isso sem inserir outro assunto. A aba de videoaulas continua disponível.

A reprodução usa youtube-nocookie.com e só carrega o player após o clique. Fechar o painel remove o player para interromper a reprodução. O link Abrir no YouTube permanece disponível caso o canal ou navegador restrinja o player integrado. As sugestões ao lado da prática também acompanham o conteúdo selecionado, mesmo antes de responder.

Testes adicionais em `tests/learning-flow.test.mjs`: restauração sem dificuldade antiga; validação de matéria/subtópico; tópico vazio sem fallback para outras matérias; vídeo compatível com o subtópico; curadoria de apoio sem contornar essa correspondência. `tests/api.test.mjs` também rejeita IDs curriculares desconhecidos na consulta de aulas.
