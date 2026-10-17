# Learning Path · versão 1.4.0

Esta versão importa do Markdown o currículo exato de Matemática do ENEM: 25 módulos e 199 aulas. A divisão é:

- Básico: 5 módulos, 42 aulas.
- Intermediário: 15 módulos, 121 aulas.
- Avançado: 5 módulos, 36 aulas.

## Conteúdo e fluxo

Cada módulo expande independentemente e mantém seu estado. As aulas têm três estados persistentes: não iniciada, em andamento e concluída. A conclusão atualiza o progresso do módulo; abrir uma aula registra a continuidade sem declarar domínio.

Os exercícios aparecem dentro da aula e reutilizam o renderizador, a correção e o banco IndexedDB existentes. Cada associação usa IDs únicos de questão. A prática global e os cards só liberam as questões depois que todas as aulas do módulo foram concluídas. A prova do módulo é opcional e não exige nota mínima.

## Conteúdo reutilizado e lacunas honestas

O caminho reutiliza recursos relacionados de 154 aulas. Outras 45 aulas não têm teoria cadastrada e 35 ainda não têm exercícios associados; ambas as ausências são informadas explicitamente, sem remover conteúdos da trilha. A versão não afirma ter 199 teorias novas nem 199 videoaulas; sugestões de vídeo continuam sujeitas à confirmação dos catálogos e à disponibilidade de rede.

## Compatibilidade e migração

O roadmap legado de 98 aulas e 392 exercícios permanece disponível no arquivo, no histórico de respostas e nos backups. A migração usa equivalências diretas quando existentes e preserva dados antigos. O schema 2 já existia na versão 1.3 e agora inclui os novos IDs `math.*`, além dos registros anteriores.

O usuário preferiu testar o GitHub real no celular. O fluxo foi preparado para exportação e restauração, mas o aparelho físico e o upload real entre dispositivos ainda não foram testados.

## Estado de release

- Android 1.4.0 usa versionCode 7; a assinatura ainda precisa ser conferida antes da publicação.
- 14 arquivos de teste Node passaram.
- `assembleRelease`, `testDebugUnitTest` e `lintRelease` Android passaram: 12 testes JUnit, 0 erros e 95 avisos não bloqueadores.
- QA validou 320, 390 e 1280 px; módulos independentes persistentes; resposta, correção e salvamento inline; conclusão de 8 aulas liberando prática global e cards sem quiz; troca para outro módulo com mistura alternada; retomada da questão 2 da prova após reload; e caminho Avançado sem pré-requisitos obrigatórios.
- O backend corrige associações ENEM exclusivas por aula e prova, evita exigir módulos alheios, corrige “em razão de” como causa em vez de proporção e calcula estatísticas de altura média. Testes gerados finais desse ajuste ainda ficam pendentes.

O schema 2 já existia na versão 1.3; esta versão apenas expande os IDs para `math.*`. `LEARNING-FLOW.md` documenta o fluxo 1.3.0 e permanece como histórico.

## Validação final

Após os últimos ajustes de associação temática, os 14 arquivos de testes Node passaram. A questão ENEM 2019/160 passou a exigir Estatística, e a questão integrada de tangente de 2025 não entra mais nas aulas/prova de Razões e proporções. Questões ENEM nos exercícios de aula e provas de módulo exigem associação exclusiva àquele módulo; questões com vários módulos continuam na prática geral, condicionadas à conclusão de todos os módulos requeridos. A associação segue automática, sujeita a revisão pedagógica.
