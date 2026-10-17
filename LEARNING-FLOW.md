# Aprender, praticar e revisar · Equação 1.3.0

O roadmap fornecido pelo usuário organiza 11 módulos e 98 aulas: Básico do básico (23), Conjuntos (3), Funções (16), Geometria plana (12), Trigonometria (6), Geometria espacial (8), Progressões (3), Análise combinatória e probabilidade (9), Estatística (3), Geometria analítica (5) e Pré-cálculo (10).

## Caminho do estudante

1. **Aprender:** abrir um módulo para ler a apresentação e ver a lista ordenada de aulas.
2. **Aula:** explicação breve, regra principal, videoaula verificada, exemplo resolvido e ação explícita Concluir aula. O aluno pode revisitar ou desmarcar. A conclusão é uma declaração do aluno, não uma detecção de vídeo assistido nem um certificado de domínio.
3. **Prova do módulo:** liberada após concluir as aulas. Seleção de 5 a 10 questões autorais, com distribuição pelas aulas e preferência por questões inéditas. Respostas são salvas ao avançar e o app retoma a prova incompleta. Gabaritos, resultado e explicações aparecem ao concluir. Pode ser refeita; novas tentativas podem repetir questões.
4. **Praticar:** todos os módulos com aulas concluídas entram no mesmo conjunto de exercícios. A prova e sua nota não condicionam essa liberação, conforme a escolha explícita do usuário. O sorteio alterna módulos disponíveis quando possível e registra IDs antes de mostrar cada questão para evitar repetições na prática.
5. **Meus cards:** perguntas curtas de conceitos das aulas dos módulos aprendidos. O aluno revela a resposta e marca Lembrei ou Quero revisar. Sem módulo aprendido, a coleção fica vazia com explicação de como montá-la. O histórico de questões não é convertido em flashcards; continua disponível no botão Histórico de exercícios e na exportação.

Desmarcar uma aula retira o módulo da prática e dos cards até que todas as aulas voltem a estar concluídas. Respostas, provas e revisões permanecem armazenadas. Uma nota baixa não bloqueia nada. As respostas parciais da mesma prova em aparelhos diferentes são reunidas, e uma prova concluída prevalece sobre uma incompleta. Os módulos podem ser explorados livremente; a ordem do roadmap é uma recomendação.

## Conteúdo e fontes

`content/roadmap.mjs` é a fonte dos textos, regras, exemplos, perguntas rápidas e geradores de quatro variações por aula. O build gera `public/roadmap.json` e `public/study-bank.json`, com 392 exercícios autorais identificados como Equação. Os IDs têm a forma `equacao:roadmap.m01.l01:1` e não representam IDs das APIs ENEM. Os exemplos e os enunciados usam notação Unicode/Markdown e as alternativas continuam formatadas em blocos separados. A área de resultado liga erros à aula correspondente.

O acervo real de enem.dev e EnemHub foi preservado. `public/roadmap-index.json` mapeia conservadoramente as associações anteriores para o novo roadmap. Uma questão ENEM só entra na prática quando **todos** os módulos associados tiverem sido aprendidos. Questões sem associação ficam fora desse conjunto. A associação é automática, sujeita a revisão pedagógica, e não serve como certificação. Os exercícios autorais garantem cobertura também em assuntos sem questões ENEM adequadas, como conteúdos básicos e pré-cálculo.

O item ambíguo “relações métricas no triângulo quadrilátero” foi organizado como **Relações métricas em quadriláteros**, com explicação dessa interpretação na aula. O link de pré-cálculo do Khan Academy permanece como referência do roadmap, sem ampliar automaticamente a lista de canais permitidos.

## Vídeos

A lista autorizada agora inclui Umberto Mannarino (`umbertomann`), além dos sete canais anteriores. `content/video-coverage.json` registra as buscas, IDs, títulos e canais confirmados; `video-catalog-roadmap.json` associa candidatos às aulas. O serviço revalida disponibilidade, canal e correspondência de assunto por oEmbed antes de mostrar. Dá preferência às sementes da aula e a títulos de introdução/aula, oferece outras videoaulas confirmadas e mantém a pesquisa por canal como alternativa.

Vídeos são apoio ao conteúdo e podem cobrir parte de uma aula com vários assuntos. Nenhum candidato de canal diferente é usado. Se não houver vídeo correspondente confirmado, o app informa a ausência e oferece tentar novamente; não inventa um link nem substitui por outra matéria. Explicações e exemplos continuam disponíveis, inclusive offline. Na curadoria atual, 92 de 98 aulas tinham vídeo confirmado; as seis ausências estão listadas no relatório. A disponibilidade pode mudar e uma curadoria ainda requer revisão pedagógica humana.

## Dados e compatibilidade

O IndexedDB existente permanece na versão 2, preservando records/meta/learning. As aulas novas usam IDs `roadmap.mNN.lNN`, sem reutilizar os IDs `math.mNN.tNN` anteriores. Equivalências explícitas aproveitam marcações antigas sem converter um tópico estreito em um módulo inteiro. A migração é idempotente e também roda após restauração do GitHub. Marcações antigas permanecem no banco e no backup.

Provas ficam em `meta['learning.exams']` e revisões em `meta['learning.cards']`. As respostas das provas também entram no histórico de questões, preservando a primeira resposta já registrada para o mesmo ID. Provas repetidas têm resultados próprios. Cada tentativa tem UUID e timestamps. Limpar exercícios locais mantém aulas, provas e revisões e desativa o automático, conforme explicado na confirmação.

O backup passa ao schema 2, continua lendo schema 1 e inclui aulas novas, provas incompletas/concluídas e revisões dos cards. IDs, respostas, conta, tamanho e datas são validados. Provas concluídas prevalecem sobre a mesma prova incompleta; revisões seguem o timestamp mais recente; marcações de aula conservam a regra de última alteração. A restauração é transacional e preserva respostas locais concorrentes. Android e backend web aceitam os dois schemas, sem mudanças no OAuth, no armazenamento protegido do token ou no repositório privado de cada usuário. Versões anteriores do app não leem o novo schema; devem atualizar antes de restaurá-lo.

## Verificação

As miniaturas dos vídeos continuam usando as imagens originais do YouTube. A camada do botão de reprodução nos cards é transparente: antes, uma cor opaca cobria completamente a imagem, mesmo quando o download havia funcionado. O pôster das aulas usa um gradiente translúcido. O CSS é compartilhado pelo site e pelo Android; a revisão do cache foi atualizada para entregar a correção nas instalações existentes.

Testes cobrem contagem e estrutura do roadmap, alternativas e fórmulas das quatro variações, ausência de conteúdo antes do aprendizado, liberação sem prova, remoção após desmarcar, união de módulos, pré-requisitos temáticos de questões ENEM, seleção e retomada de prova, cálculo de resultado, revisão dos cards, backup dos novos dados, migração conservadora e alternância sem repetir IDs. A prévia do navegador usa dados locais de teste; nenhum histórico real foi enviado ao GitHub.
