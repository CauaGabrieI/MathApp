# Conferência das videoaulas

A lista de canais permitidos está em `public/video-topics.js`. O currículo atual usa os IDs de `public/learning-path.json`; o roadmap antigo de 98 aulas não representa as 199 aulas atuais.

`public/lesson-topics.js` define consultas e conceitos por aula. Vídeos podem explicar uma parte do conteúdo. Palavras ambíguas precisam do contexto correto: zero de função não é zero fatorial, por exemplo. O título, a disponibilidade e a autoria são conferidos no oEmbed do YouTube antes da sugestão. Isso não equivale a assistir integralmente ao vídeo.

Para gerar material de revisão, sem sobrescrever o catálogo publicado:

```sh
node scripts/audit-lesson-videos.mjs --output-dir /tmp/equacao-videos --search-missing --min-videos 2
```

Uma segunda passagem pode procurar no resultado geral do YouTube; só candidatos dos mesmos canais autorizados são admitidos:

```sh
node scripts/audit-lesson-videos.mjs --output-dir /tmp/equacao-videos --search-missing --min-videos 1 --global-search
```

O diretório de saída contém cache retomável, relatório por aula e `catalog-candidate.json`. Revise as associações antes de promover o catálogo para `video-catalog-roadmap.json`. Atualize `content/lesson-video-coverage.json` com os IDs confirmados. Preserve todos os IDs antigos de aulas e vídeos. Falhas de rede e ausência de correspondência confirmada não provam inexistência de uma videoaula.

Após promoção, compile o site e prepare os assets Android. `tests/video-catalog-coverage.test.mjs` confere a entrega de todas as aulas auditadas pelos dois runtimes usando os metadados públicos registrados, sem acessar contas pessoais. A disponibilidade continua sendo verificada ao usar o aplicativo.
