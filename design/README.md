# Equação · Design system 1.0

Uma interface calma e legível para estudar matemática no celular. O sistema mantém a identidade lilás do Equação e reúne fundamentos, componentes, estados e orientação de uso. A biblioteca é utilizada pelo app, não apenas pelo guia de demonstração.

## Arquivos e execução

| Arquivo | Responsabilidade |
| --- | --- |
| `design/tokens.json` | Fonte dos valores visuais. |
| `scripts/design-system.mjs` | Geração e conferência dos recursos web e Android. |
| `public/design-tokens.css` | Variáveis CSS geradas, incluindo os dois temas. |
| `public/components.css` | Componentes compartilhados e seus estados. |
| `public/style.css` | Layout específico das telas; consome os tokens compartilhados. |
| `public/design-system.html` | Guia interativo com exemplos de componentes e aprendizagem. |
| `public/design-system.css` e `.js` | Layout e interações do guia. Não acessam o histórico do app. |
| `android/app/src/main/res/values/design_tokens.xml` | Cores Android geradas, incluindo referências explícitas aos dois temas. |
| `android/app/src/main/res/values-night/design_tokens.xml` | Papéis semânticos Android para o tema escuro do sistema. |

```sh
npm run design:build
npm run design:check
npm run build
npm run dev
```

Abra `/design-system.html` para o guia e `/#mapa` para o app. `PORT=4174 npm run dev` permite uma origem separada para revisão sem alterar o histórico do navegador existente. `npm run build` e `npm run android:prepare` geram os tokens automaticamente.

Para exportar o guia como HTML independente, com CSS, interações e fontes locais embutidos:

```sh
node scripts/design-system.mjs --export /caminho/equacao-design-system.html
```

## Direção

- **Conteúdo primeiro:** o enunciado e as alternativas recebem a maior atenção. Sem elementos decorativos sobrepondo a leitura.
- **Progresso com calma:** o texto orienta o próximo passo; acertos e erros não alteram o respeito pelo aluno.
- **Coerência:** a mesma aparência indica a mesma função. Seleção, estudo registrado e resposta correta são estados diferentes.
- **Honestidade:** nenhum card de resposta aparece antes de uma atividade concluída. Vídeos não confirmados, tópicos sem exercícios e desempenho ainda desconhecido têm estados vazios próprios.

## Cores por função

Use papéis, não valores hexadecimais soltos. Por exemplo, `--eq-color-primary` se adapta ao tema; um lilás fixo pode perder contraste no modo escuro.

| Papel | Uso |
| --- | --- |
| `canvas`, `surface`, `surface-subtle` | Fundo da tela, cards e áreas de apoio. |
| `text`, `text-secondary`, `text-tertiary` | Leitura principal, apoio e legendas. |
| `primary`, `on-primary`, `primary-hover` | Ação principal e seu texto. |
| `primary-container` | Seleção, navegação ativa e destaques suaves. |
| `border`, `border-strong` | Separação decorativa e contorno de controles. |
| `success`, `success-container` | Resposta correta e estudo registrado, acompanhados de rótulo. |
| `error`, `error-container` | Revisão e erro de preenchimento. |
| `warning`, `info` e seus containers | Atenção e informação, sem competir com a ação principal. |
| `paper` | Fundo branco preservado em imagens de questões. Não inverter gráficos no tema escuro. |
| `media`, `on-media`, `scrim` | Vídeos e sobreposição de diálogos. |
| `branch-1` a `branch-8` | Diferenciação decorativa das áreas do mapa; nomes continuam visíveis. |

Os pares textuais principais têm teste de contraste mínimo de 4,5:1 nos dois temas. A borda forte é testada em 3:1 contra fundo/superfície. A borda suave é decorativa e não identifica um campo sozinha. Esses testes de cores não constituem uma certificação de acessibilidade do produto inteiro.

## Tipografia, forma e ritmo

**Manrope** nos títulos; **DM Sans** no corpo e nos controles. Pesos 400 para leitura, 600–700 para destaque e 750–800 para títulos/identidade. As fontes são incluídas no APK, com suas licenças.

| Tamanho | Aplicação |
| --- | --- |
| 32 / 40 px | Destaques e números importantes. |
| 24 px | Títulos de painéis e diálogos. |
| 18 px | Títulos de seção. |
| 16 px | Enunciados e alternativas; entrelinha de 1,85 para leitura longa. |
| 14 px | Interface, campos e botões. |
| 12 px | Metadados e legendas. |
| 11 px | Exceção reservada aos rótulos da navegação compacta com cinco destinos. |

O espaçamento de novos componentes usa uma base de 4 px, com passos de 4, 8, 12, 16, 20, 24, 32, 40, 48 e 64. Raios de 8, 12, 16 e 24 px; arredondamento completo para elementos circulares. Os componentes comuns consomem os tokens; algumas medidas de composição do layout anterior permanecem em `style.css` para preservar a distribuição das telas.

Ícones preservam a grade SVG de 24 unidades e o traço existente, com `currentColor`. Não use emoji para substituir um ícone funcional. Os símbolos de exemplos do guia são acompanhados por texto.

## Componentes e estados

| Componente | Comportamento |
| --- | --- |
| Ação principal | Um botão de fundo lilás por tarefa. `button primary` / `learning-button` no app; `eq-button` no guia. |
| Ação secundária | Fundo suave e texto lilás; não competir com a principal. |
| Ação de contorno | Navegação e prática de um tópico, com limite do controle visível. |
| Ação destrutiva | Papel de erro, descrição clara e confirmação antes de apagar dados. |
| Botão desabilitado | Não pode ser acionado. A aparência de uma alternativa já corrigida permanece legível. |
| Carregamento | Texto que descreve a ação; `aria-busy` quando aplicável. Não simular progresso desconhecido. |
| Campo | Rótulo persistente; placeholder é apenas exemplo. Erro associado por `aria-describedby`. |
| Alternativa | Área clicável inteira, identificador A–E e seleção com `aria-pressed`. Acerto/revisão têm texto e ícone além da cor. |
| Card | Superfície, borda e metadados consistentes. Cards de histórico refletem somente respostas concluídas. |
| Progresso | Nome, valor e limite acessíveis. Não converter checklist de estudo em domínio calculado. |
| Estado vazio | Explica o motivo e oferece um próximo passo possível. Não inventa atividade, aulas ou resultados. |
| Diálogo | Título claro, ação e saída; foco visível e rolagem interna em telas pequenas. |
| Atualização | Aviso nativo usa as mesmas cores claras/escuras; o usuário escolhe baixar ou adiar. A instalação continua sendo confirmada pelo Android. |

Normal, hover, foco, pressionado e desabilitado têm estilos próprios. O foco usa contorno de 3 px, com afastamento de 3 px. A área de toque dos botões é de pelo menos 48 × 48 px; checkboxes têm uma área de rótulo maior que o desenho do controle.

## Movimento e adaptação

Transições de cor/estado usam 120–180 ms. Não animar o enunciado enquanto o usuário lê. `prefers-reduced-motion` desativa animações e transições. O carregamento continua sendo comunicado por texto quando o indicador não gira.

A navegação inferior aparece até 760 px, com cinco destinos e respeito à área segura do aparelho. O layout compacto de desktop começa em 1190 px. Não reduzir fonte de leitura para acomodar conteúdo: empilhar controles, quebrar linhas e permitir rolagem horizontal somente nas tabelas ou listas próprias.

No celular, os cards de histórico ocupam a largura disponível. Enunciados mantêm 16 px; imagens preservam proporção e ampliação; tabelas rolam dentro de seu contêiner. Diálogos usam a altura disponível sem ocultar a saída.

## Texto

Prefira “Vamos revisar” a mensagens de culpa. Explique o próximo passo: “Responda às questões para montar seus cards”, “Verifique sua conexão e tente novamente”. Use frases curtas, linguagem em português e nomes iguais para ações iguais. Não mostre nomes de arquivos ou detalhes de implementação nos fluxos de estudo.

## Manutenção

1. Altere `design/tokens.json`, não os arquivos gerados.
2. Ajuste componentes em `public/components.css`; use `style.css` para composição de tela.
3. Execute `npm run design:build`, `npm run build` e `npm test`.
4. Revise claro/escuro, 320/390 px e desktop. Confira enunciado real, teclado, áreas de toque e estados vazios.
5. Para Android, gere o APK e execute os testes/lint conforme `android/README.md`. Preserve assinatura, pacote e armazenamento. Publique uma release com manifesto para disponibilizar a atualização.

O HTML exportado é um guia de desenvolvimento. Os exemplos interativos não gravam dados, não baixam atualizações e não alteram as preferências do app. Componentes do sistema Android conservam a tipografia e o comportamento nativos da plataforma.

Referências para os critérios adotados: [visibilidade e áreas de toque no Android](https://developer.android.com/guide/topics/ui/accessibility/apps), [contraste de texto na WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) e [uso de cor com outros sinais](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
