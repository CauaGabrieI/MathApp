# Evolução pedagógica — lote inicial e limites

## Entrega real

Os 25 módulos e as 199 aulas foram inventariados antes das alterações. O baseline imutável está em `content-audit-baseline.json` e `.md`; o estado posterior por ID está em `content-audit-current.json` e `.md`. Nenhum ID de módulo, aula, questão existente ou equivalência de migração foi removido.

Há um candidato completo para as dez aulas de Números e operações: objetivo, diagnóstico, intuição, conceitos, procedimentos justificados, dois exemplos por aula, erros comuns, resumo, checagens, conexões, referências e quatro exercícios por aula. São **20 exemplos e 40 itens originais**, com habilidades, pré-requisitos, soluções e feedback. **Não há aprovação humana registrada.** As outras 189 aulas mantêm seus guias anteriores e estão explicitamente pendentes de revisão integral. Não foram reescritas nem matematicamente validadas neste lote.

## Arquitetura e arquivos

O aplicativo usa módulos JavaScript, HTML/CSS, um Worker gerado pelo build e WebView Android. O Markdown é o currículo de títulos/ordem, não uma coleção de aulas prontas. `content/learning-path.mjs` cruza esse currículo com guias autorais, apoios arquivados e associações de questões. `public/journey-ui.js` conserva as abas e o motor atual de exercícios. O estado continua em IndexedDB v2 e no backup opcional do GitHub.

| Área | Implementação |
|---|---|
| Auditoria antes/depois | `scripts/audit-content.mjs`, `scripts/pedagogy-status.mjs`, `docs/content-audit-*` |
| Sequência e dependências | `content/pedagogy-policy.mjs`, `scripts/import-curriculum.mjs`, `content/learning-path.mjs` |
| Conteúdo candidato | `content/review/module01.mjs`, `content/review/module01-feedback.mjs`, `content/enem-alignment.mjs` |
| Contrato, aprovação e adaptação | `content/lesson-schema.mjs`, `content/pedagogy-exercises.mjs`, `scripts/build.mjs` |
| Teoria e navegação existentes | `public/lesson-theory.js`, `public/journey-ui.js`, `public/journey-model.js` |
| Tentativas e backups | `public/db.js`, `public/backup-model.js`, `public/app.js`, `public/github-ui.js` |
| Vídeos e uso offline | `public/videos.js`, `public/video-categories.js`, `video-service.js`, `public/sw.js` |
| Revisão humana local | `scripts/review-pedagogy.mjs` gera HTML e JSON fora de `public/` |

## Antes e depois

Em `math.m01.t01`, o guia curto já ensinava valor posicional, mas o apoio, card e quatro questões vinham de Conjuntos numéricos, incluindo irracionalidade de √2. Removemos essa associação de t01 e t02. O acervo permanece disponível para histórico, sem ser novamente sorteado nessas aulas. O card agora acompanha o exemplo próprio da aula. Não inserimos questões de outro assunto para preencher a lacuna.

O novo candidato t01 ensina os dez algarismos, zero, agrupamentos, ordens, composição/decomposição e ordenação. Um exemplo calcula o valor do 6 em **46 305**; outro decompõe **12 408 kg** de um estoque, preservando ordens e unidades. O conteúdo estruturado é exibido somente na prévia editorial enquanto aguarda revisão humana.

Operações aparecem antes de sinais, expressões, divisibilidade e frações. `displayOrder` preserva `order` e os IDs do Markdown. No módulo 07, Discriminante precede Bhaskara. A navegação anterior/próxima, retomada e opções de videoaula usam a nova ordem.

As recomendações de módulo foram revisadas: m19 já dependia apenas de aritmética e continua assim; m21 explicita porcentagem/juros, potências, exponenciais e progressões; m23 recomenda proporcionalidade e estatística descritiva. Outras dependências de medidas/geometria/estatística também foram ajustadas. Nenhuma recomendação bloqueia o acesso.

## Publicação de conteúdo e histórico

O build normal exclui candidatos pendentes. A aprovação exige estado `approved`, identificação do revisor e data; uma marcação feita por teste ou IA não representa aprovação humana. Aula e exercício precisam estar aprovados para adicionar um item novo ao banco. Os 40 itens deste lote permanecem fora dele. As quatro alternativas dos novos itens são compatíveis com o motor, que continua usando Fisher–Yates e letras de origem para correção.

`PEDAGOGY_PREVIEW=1 npm run build` inclui a teoria candidata, claramente sinalizada, para conferência local. Os exercícios pendentes continuam fora do banco mesmo nessa prévia. `npm run android:prepare` rejeita um build editorial; é necessário executar novamente o build normal. Nenhum pacote ou site com gabaritos pendentes deve ser publicado como versão pronta.

Questões materialmente alteradas devem receber uma nova revisão identificada no ID; os itens antigos permanecem legíveis. As novas provas guardam snapshots completos das questões. A tela, correção e comparação usam esses snapshots. Registros modernos exportam seu próprio snapshot, e a restauração não depende da redação atual do banco. `contentVersionSeen` é opcional e não redefine aulas já concluídas.

Provas e backups antigos sem snapshot continuam compatíveis enquanto o acervo correspondente existir. Não é possível recuperar uma redação original que nunca foi salva. Se faltar o conteúdo, a tela preserva a resposta e informa indisponibilidade, sem inventar nota. As questões retiradas das associações de t01/t02 continuam no acervo e no catálogo permitido para restauração de provas anteriores. O limite de backup permanece 8 MiB; excedê-lo gera erro, sem truncamento silencioso.

## Revisão matemática e fontes

Os dois leitores de IA e a revisão do orquestrador examinaram as dez aulas, vinte exemplos e quarenta itens. A conferência final encontrou uma falha não detectada nas primeiras leituras: **2/3 e 30/45** eram alternativas equivalentes no mesmo item. Corrigimos o distrator e acrescentamos testes exatos de equivalência de números/frações/decimais. Também corrigimos duplicações entre distratores, a ausência do par **6 × 6** na explicação dos divisores de 36, antecipações de porcentagem/raízes e dependências invertidas. Isso documenta os limites da revisão por IA; não a transforma em chancela humana.

O portal de [provas e gabaritos do Inep](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos) foi consultado. H1–H4 foram consultadas no trecho indexado do [relatório pedagógico oficial 2009–2010](https://download.inep.gov.br/publicacoes/institucionais/avaliacoes_e_exames_da_educacao_basica/relatorio_pedagogico_enem_2009_2010.pdf). As relações propostas por aula são editoriais, justificadas, e não classificações oficiais do Inep. Não houve leitura integral do PDF nem reprodução de novas questões oficiais. A aula modelo Markdown mencionada no pedido não estava disponível.

O catálogo anterior registra 646 vídeos únicos e correspondências por título em 173 aulas; 26 permanecem sem confirmação suficiente. Não assistimos a todos os vídeos. A UI diferencia disponibilidade/autoria verificada de adequação estimada pelo título e oferece sugestão principal/complementares. Cobertura efetiva, duração, idioma, licença e incorporação permitida permanecem sem verificação integral. Links e atribuição foram mantidos, sem inventar vídeos ou preencher ausências.

## Verificações e pendências

- Suíte Node: os arquivos de testes existentes e os novos testes pedagógicos verificam identidades, ordem, dependências, aprovação, equivalência de alternativas, snapshots, restauração transacional, provas antigas, cards, prática e cache offline. O log final informa a contagem executada.
- Build web e verificação de privacidade aprovados; sem segredos ou caminhos pessoais no código público.
- Prévia no navegador: 320 e 390 px, desktop 1280 px, sem excesso horizontal nos painéis medidos; teclado das abas, conclusão/avanço e manutenção de seleção/correção conferidos.
- Android: `assembleRelease` e `lintRelease` aprovados; certificado original SHA-256 `cb2f8d2d2edf62d36e5fbf0506794028c7b0db9d8dfa45c429d69a38b81bb666` confirmado. Não houve teste em aparelho físico nem backup real na conta do usuário.
- Revisão humana de gabaritos, linguagem e adequação didática das dez candidatas continua necessária antes de produção. As 189 aulas restantes exigem revisão integral, uma a uma, começando pelas dependências do módulo 01 e pelas lacunas de exercícios registradas no inventário. Não há afirmação de domínio do aluno por marcar uma aula como estudada.

Este lote constitui as fases A/B e uma versão candidata de C, com correções de infraestrutura em E/F. A fase D não foi apresentada como concluída.
