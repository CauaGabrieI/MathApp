# Learning Path · versão 1.5.1

Esta versão importa do Markdown o currículo exato de Matemática do ENEM: uma matéria com 25 módulos e 199 aulas. Cada módulo mantém seu nível curricular (Básico, Intermediário ou Avançado) como metadado para orientar a sequência recomendada.

## Conteúdo e fluxo

Cada módulo expande independentemente e mantém seu estado. As aulas têm três estados persistentes: não iniciada, em andamento e concluída. A conclusão atualiza o progresso do módulo; abrir uma aula registra a continuidade sem declarar domínio.

Os exercícios aparecem dentro da aula e reutilizam o renderizador, a correção e o banco IndexedDB existentes. Cada associação usa IDs únicos de questão. A prática global e os cards só liberam as questões depois que todas as aulas do módulo foram concluídas. A prova do módulo é opcional e não exige nota mínima.

## Conteúdo reutilizado e lacunas honestas

O caminho reutiliza recursos relacionados de 154 aulas. Outras 45 aulas não têm teoria cadastrada e 35 ainda não têm exercícios associados; ambas as ausências são informadas explicitamente, sem remover conteúdos da trilha. A versão não afirma ter 199 teorias novas nem 199 videoaulas; sugestões de vídeo continuam sujeitas à confirmação dos catálogos e à disponibilidade de rede.

## Compatibilidade e migração

O roadmap legado de 98 aulas e 392 exercícios permanece disponível no arquivo, no histórico de respostas e nos backups. A migração usa equivalências diretas quando existentes e preserva dados antigos. O schema 2 já existia na versão 1.3 e agora inclui os novos IDs `math.*`, além dos registros anteriores.

O usuário preferiu testar o GitHub real no celular. O fluxo foi preparado para exportação e restauração, mas o aparelho físico e o upload real entre dispositivos ainda não foram testados.

## Estado de release

- Android 1.5.0 usa versionCode 8; a assinatura ainda precisa ser conferida antes da publicação.
- 15 arquivos de teste Node passaram.
- `assembleRelease`, `testDebugUnitTest`, `lintRelease` Android e `android:release-files` concluíram com a assinatura e o `versionCode 8` verificados.
- A validação no navegador confirmou o ciclo diagnóstico → aulas → avaliação final, a comparação após recarregar, a matéria Matemática com seus 25 módulos e ausência de overflow.
- Não havia aparelho físico ou emulador disponível; o backup real não foi testado por escolha do usuário.

O schema 2 já existia na versão 1.3; esta versão apenas expande os IDs para `math.*`. `LEARNING-FLOW.md` documenta o fluxo 1.3.0 e permanece como histórico.

## Alterações da 1.5.0

O caminho agora inclui diagnóstico antes da conclusão das aulas e avaliação final depois dela, com comparação entre o primeiro diagnóstico e o resultado posterior. A comparação é um indicador de evolução, sem certificação de domínio ou bloqueio da prática.

A entrada do conteúdo é **Aprender → Matérias**. O hero foi removido, as rails ficam dentro da etapa e a prática não exibe banner, dica ou fonte. Cada nova prova autoral exclui questões usadas enquanto houver alternativas inéditas; ao esgotar o conjunto, o app informa a situação. Login, backup e atualização pelo GitHub permanecem preservados.

As sugestões de vídeo são contextuais à questão autoral e ao ENEM. O serviço verifica canal e oEmbed; a heurística pode falhar e a resposta fica vazia sem confirmação. Nesta entrega, 15 arquivos de testes Node passaram; assemble/unit/lint Android, preparação dos arquivos de release e navegador concluíram. Não havia aparelho ou emulador, e o backup real não foi testado por escolha do usuário.

## Validação final

Após os últimos ajustes de associação temática, os 14 arquivos de testes Node passaram. A questão ENEM 2019/160 passou a exigir Estatística, e a questão integrada de tangente de 2025 não entra mais nas aulas/prova de Razões e proporções. Questões ENEM nos exercícios de aula e provas de módulo exigem associação exclusiva àquele módulo; questões com vários módulos continuam na prática geral, condicionadas à conclusão de todos os módulos requeridos. A associação segue automática, sujeita a revisão pedagógica.
