# Auditoria de conteúdo atual — inventário e status pedagógico

Gerado deterministicamente a partir de `docs/content-audit-baseline.json`, `public/learning-path.json` e `content/review/module01.mjs`. Baseline preservado: `2026-10-19T16:37:05.871Z`.

## Contagens reais

- Currículo público: **25 módulos / 199 aulas**.
- Candidato editorial M01: **10 aulas / 20 exemplos / 40 exercícios**.
- Aprovação humana: **0 aulas / 0 exercícios**.
- Revisão integral pendente sem candidata: **189 aulas**.
- Revisão pendente em candidatas: **10 aulas / 40 exercícios**.
- Novos candidatos publicados: **0 aulas / 0 exercícios/gabaritos**.

## Identidade, ordem e pré-requisitos

- IDs e ordem de origem contra o baseline: **intactos**.
- `math.m01` displayOrder: **[1, 5, 2, 6, 7, 8, 9, 10, 3, 4]**.
- `math.m07` displayOrder: **[1, 4, 2, 3, 6, 5, 7, 8]**.
- Política de pré-requisitos: **recommended**, revisão **2**.

## Publicação e prévia

- `public/learning-path.json` está com `editorialPreview=false` neste snapshot.
- A prévia editorial é opt-in por `PEDAGOGY_PREVIEW=1`; o build reconhece o switch: **sim**.
- A preparação Android rejeita prévia editorial: **sim**.
- Candidatas com status pendente não entram no banco produtivo nem alteram tentativas históricas.

## Vídeos

- IDs únicos no baseline: **646**; aulas com correspondência por título no recorte: **173**; pendências de cobertura: **26**.
- Duração, licença, idioma e embeddability permanecem não verificados para os IDs catalogados.

## Referências e limites

- A aula modelo `aula_modelo_naturais_sistema_decimal.md` está ausente.
- O portal de provas e gabaritos do Inep foi consultado online nesta revisão; o trecho indexado do relatório pedagógico oficial 2009–2010 foi consultado; a URL está no JSON. Não houve leitura integral do PDF.
- H1–H4 são mapeamentos editoriais não oficiais por aula.
- Este documento não afirma revisão matemática das 199 aulas; apenas registra inventário, candidata e estados pendentes.

## Pendência por ID curricular

| ID | Módulo | Aula | Ordem origem | Display | Produção | Candidata | Estado pendente | Questões produção |
|---|---|---|---:|---:|---|---|---|---:|
| math.m01.t01 | math.m01 | Naturais e sistema decimal | 1 | 1 | legacy_pending_review | sim | candidate_pending_human_review | 0 |
| math.m01.t02 | math.m01 | Inteiros e números negativos | 2 | 3 | legacy_pending_review | sim | candidate_pending_human_review | 0 |
| math.m01.t03 | math.m01 | Frações próprias e impróprias | 3 | 9 | legacy_pending_review | sim | candidate_pending_human_review | 5 |
| math.m01.t04 | math.m01 | Decimais e conversões | 4 | 10 | legacy_pending_review | sim | candidate_pending_human_review | 9 |
| math.m01.t05 | math.m01 | Adição, subtração, multiplicação e divisão | 5 | 2 | legacy_pending_review | sim | candidate_pending_human_review | 9 |
| math.m01.t06 | math.m01 | Ordem das operações e parênteses | 6 | 4 | legacy_pending_review | sim | candidate_pending_human_review | 4 |
| math.m01.t07 | math.m01 | Múltiplos e divisores | 7 | 5 | legacy_pending_review | sim | candidate_pending_human_review | 4 |
| math.m01.t08 | math.m01 | Critérios de divisibilidade | 8 | 6 | legacy_pending_review | sim | candidate_pending_human_review | 4 |
| math.m01.t09 | math.m01 | Números primos e fatoração | 9 | 7 | legacy_pending_review | sim | candidate_pending_human_review | 0 |
| math.m01.t10 | math.m01 | MMC e MDC | 10 | 8 | legacy_pending_review | sim | candidate_pending_human_review | 6 |
| math.m02.t01 | math.m02 | Razão e taxa | 1 | 1 | legacy_pending_review | não | full_review_pending | 78 |
| math.m02.t02 | math.m02 | Proporcionalidade direta e inversa | 2 | 2 | legacy_pending_review | não | full_review_pending | 13 |
| math.m02.t03 | math.m02 | Regra de três simples | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m02.t04 | math.m02 | Regra de três composta | 4 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m02.t05 | math.m02 | Divisão em partes proporcionais | 5 | 5 | legacy_pending_review | não | full_review_pending | 0 |
| math.m02.t06 | math.m02 | Escalas | 6 | 6 | legacy_pending_review | não | full_review_pending | 38 |
| math.m02.t07 | math.m02 | Velocidade média como razão | 7 | 7 | legacy_pending_review | não | full_review_pending | 4 |
| math.m02.t08 | math.m02 | Densidade e vazão | 8 | 8 | legacy_pending_review | não | full_review_pending | 14 |
| math.m03.t01 | math.m03 | Conversão fração-decimal-percentual | 1 | 1 | legacy_pending_review | não | full_review_pending | 8 |
| math.m03.t02 | math.m03 | Cálculo percentual | 2 | 2 | legacy_pending_review | não | full_review_pending | 87 |
| math.m03.t03 | math.m03 | Acréscimos e descontos | 3 | 3 | legacy_pending_review | não | full_review_pending | 19 |
| math.m03.t04 | math.m03 | Variações sucessivas | 4 | 4 | legacy_pending_review | não | full_review_pending | 0 |
| math.m03.t05 | math.m03 | Porcentagem reversa | 5 | 5 | legacy_pending_review | não | full_review_pending | 0 |
| math.m03.t06 | math.m03 | Lucro e prejuízo | 6 | 6 | legacy_pending_review | não | full_review_pending | 11 |
| math.m03.t07 | math.m03 | Juros simples | 7 | 7 | legacy_pending_review | não | full_review_pending | 4 |
| math.m03.t08 | math.m03 | Juros compostos | 8 | 8 | legacy_pending_review | não | full_review_pending | 4 |
| math.m03.t09 | math.m03 | Taxa de juros e inflação | 9 | 9 | legacy_pending_review | não | full_review_pending | 0 |
| math.m04.t01 | math.m04 | Potenciação e propriedades | 1 | 1 | legacy_pending_review | não | full_review_pending | 9 |
| math.m04.t02 | math.m04 | Potências de dez | 2 | 2 | legacy_pending_review | não | full_review_pending | 4 |
| math.m04.t03 | math.m04 | Notação científica | 3 | 3 | legacy_pending_review | não | full_review_pending | 8 |
| math.m04.t04 | math.m04 | Ordem de grandeza | 4 | 4 | legacy_pending_review | não | full_review_pending | 1 |
| math.m04.t05 | math.m04 | Raiz quadrada e cúbica | 5 | 5 | legacy_pending_review | não | full_review_pending | 4 |
| math.m04.t06 | math.m04 | Simplificação de radicais | 6 | 6 | legacy_pending_review | não | full_review_pending | 4 |
| math.m04.t07 | math.m04 | Racionalização simples | 7 | 7 | legacy_pending_review | não | full_review_pending | 5 |
| math.m04.t08 | math.m04 | Expoentes fracionários | 8 | 8 | legacy_pending_review | não | full_review_pending | 4 |
| math.m05.t01 | math.m05 | SI e prefixos | 1 | 1 | legacy_pending_review | não | full_review_pending | 4 |
| math.m05.t02 | math.m05 | Conversões de comprimento, massa, volume, área e tempo | 2 | 2 | legacy_pending_review | não | full_review_pending | 6 |
| math.m05.t03 | math.m05 | Relação litro e metro cúbico | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m05.t04 | math.m05 | Medidas angulares | 4 | 4 | legacy_pending_review | não | full_review_pending | 8 |
| math.m05.t05 | math.m05 | Estimativas | 5 | 5 | legacy_pending_review | não | full_review_pending | 0 |
| math.m05.t06 | math.m05 | Algarismos significativos | 6 | 6 | legacy_pending_review | não | full_review_pending | 0 |
| math.m05.t07 | math.m05 | Arredondamento e erro de medida | 7 | 7 | legacy_pending_review | não | full_review_pending | 0 |
| math.m06.t01 | math.m06 | Variáveis e expressões | 1 | 1 | legacy_pending_review | não | full_review_pending | 5 |
| math.m06.t02 | math.m06 | Propriedade distributiva | 2 | 2 | legacy_pending_review | não | full_review_pending | 4 |
| math.m06.t03 | math.m06 | Produtos notáveis | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m06.t04 | math.m06 | Fatoração algébrica | 4 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m06.t05 | math.m06 | Frações algébricas | 5 | 5 | legacy_pending_review | não | full_review_pending | 0 |
| math.m06.t06 | math.m06 | Equação do primeiro grau | 6 | 6 | legacy_pending_review | não | full_review_pending | 4 |
| math.m06.t07 | math.m06 | Inequações de primeiro grau | 7 | 7 | legacy_pending_review | não | full_review_pending | 4 |
| math.m06.t08 | math.m06 | Sistemas lineares 2x2 | 8 | 8 | legacy_pending_review | não | full_review_pending | 5 |
| math.m06.t09 | math.m06 | Problemas com incógnitas | 9 | 9 | legacy_pending_review | não | full_review_pending | 8 |
| math.m07.t01 | math.m07 | Equação de segundo grau | 1 | 1 | legacy_pending_review | não | full_review_pending | 4 |
| math.m07.t02 | math.m07 | Fórmula de Bhaskara | 2 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m07.t03 | math.m07 | Soma e produto das raízes | 3 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m07.t04 | math.m07 | Discriminante | 4 | 2 | legacy_pending_review | não | full_review_pending | 4 |
| math.m07.t05 | math.m07 | Sistemas com equação quadrática | 5 | 6 | legacy_pending_review | não | full_review_pending | 0 |
| math.m07.t06 | math.m07 | Polinômios e operações | 6 | 5 | legacy_pending_review | não | full_review_pending | 0 |
| math.m07.t07 | math.m07 | Equações biquadradas (aprofundamento) | 7 | 7 | legacy_pending_review | não | full_review_pending | 0 |
| math.m07.t08 | math.m07 | Inequações quadráticas | 8 | 8 | legacy_pending_review | não | full_review_pending | 8 |
| math.m08.t01 | math.m08 | Conceito de função | 1 | 1 | legacy_pending_review | não | full_review_pending | 4 |
| math.m08.t02 | math.m08 | Domínio, contradomínio e imagem | 2 | 2 | legacy_pending_review | não | full_review_pending | 9 |
| math.m08.t03 | math.m08 | Pares ordenados | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m08.t04 | math.m08 | Plano cartesiano | 4 | 4 | legacy_pending_review | não | full_review_pending | 5 |
| math.m08.t05 | math.m08 | Gráfico e tabela | 5 | 5 | legacy_pending_review | não | full_review_pending | 9 |
| math.m08.t06 | math.m08 | Crescimento e decrescimento | 6 | 6 | legacy_pending_review | não | full_review_pending | 9 |
| math.m08.t07 | math.m08 | Taxa de variação | 7 | 7 | legacy_pending_review | não | full_review_pending | 4 |
| math.m08.t08 | math.m08 | Zeros e interceptos | 8 | 8 | legacy_pending_review | não | full_review_pending | 8 |
| math.m08.t09 | math.m08 | Composição e função inversa (quando pertinente) | 9 | 9 | legacy_pending_review | não | full_review_pending | 8 |
| math.m09.t01 | math.m09 | Coeficientes angular e linear | 1 | 1 | legacy_pending_review | não | full_review_pending | 4 |
| math.m09.t02 | math.m09 | Equação da reta | 2 | 2 | legacy_pending_review | não | full_review_pending | 8 |
| math.m09.t03 | math.m09 | Interpretação gráfica | 3 | 3 | legacy_pending_review | não | full_review_pending | 8 |
| math.m09.t04 | math.m09 | Zero da função | 4 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m09.t05 | math.m09 | Sinal da função | 5 | 5 | legacy_pending_review | não | full_review_pending | 8 |
| math.m09.t06 | math.m09 | Taxa constante | 6 | 6 | legacy_pending_review | não | full_review_pending | 8 |
| math.m09.t07 | math.m09 | Sistemas representados graficamente | 7 | 7 | legacy_pending_review | não | full_review_pending | 4 |
| math.m09.t08 | math.m09 | Modelagem de tarifas e consumos | 8 | 8 | legacy_pending_review | não | full_review_pending | 4 |
| math.m10.t01 | math.m10 | Parábola e concavidade | 1 | 1 | legacy_pending_review | não | full_review_pending | 5 |
| math.m10.t02 | math.m10 | Zeros e vértice | 2 | 2 | legacy_pending_review | não | full_review_pending | 8 |
| math.m10.t03 | math.m10 | Máximos e mínimos | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m10.t04 | math.m10 | Intervalos de sinal | 4 | 4 | legacy_pending_review | não | full_review_pending | 8 |
| math.m10.t05 | math.m10 | Gráfico e deslocamentos | 5 | 5 | legacy_pending_review | não | full_review_pending | 4 |
| math.m10.t06 | math.m10 | Problemas de área/otimização | 6 | 6 | legacy_pending_review | não | full_review_pending | 4 |
| math.m10.t07 | math.m10 | Modelagem de trajetórias | 7 | 7 | legacy_pending_review | não | full_review_pending | 5 |
| math.m11.t01 | math.m11 | Crescimento e decaimento exponencial | 1 | 1 | legacy_pending_review | não | full_review_pending | 4 |
| math.m11.t02 | math.m11 | Função exponencial | 2 | 2 | legacy_pending_review | não | full_review_pending | 4 |
| math.m11.t03 | math.m11 | Equações exponenciais | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m11.t04 | math.m11 | Conceito de logaritmo | 4 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m11.t05 | math.m11 | Propriedades de logaritmos | 5 | 5 | legacy_pending_review | não | full_review_pending | 4 |
| math.m11.t06 | math.m11 | Função logarítmica | 6 | 6 | legacy_pending_review | não | full_review_pending | 4 |
| math.m11.t07 | math.m11 | Escalas logarítmicas (pH, decibéis, Richter) | 7 | 7 | legacy_pending_review | não | full_review_pending | 6 |
| math.m11.t08 | math.m11 | Aplicações a juros e populações | 8 | 8 | legacy_pending_review | não | full_review_pending | 8 |
| math.m12.t01 | math.m12 | Padrões e sequências | 1 | 1 | legacy_pending_review | não | full_review_pending | 6 |
| math.m12.t02 | math.m12 | PA e termo geral | 2 | 2 | legacy_pending_review | não | full_review_pending | 4 |
| math.m12.t03 | math.m12 | Soma da PA | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m12.t04 | math.m12 | PG e termo geral | 4 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m12.t05 | math.m12 | Soma da PG finita | 5 | 5 | legacy_pending_review | não | full_review_pending | 4 |
| math.m12.t06 | math.m12 | Crescimento geométrico | 6 | 6 | legacy_pending_review | não | full_review_pending | 4 |
| math.m12.t07 | math.m12 | Sequências recorrentes simples | 7 | 7 | legacy_pending_review | não | full_review_pending | 0 |
| math.m12.t08 | math.m12 | Modelos financeiros | 8 | 8 | legacy_pending_review | não | full_review_pending | 8 |
| math.m13.t01 | math.m13 | Ponto, reta, segmento e ângulo | 1 | 1 | legacy_pending_review | não | full_review_pending | 25 |
| math.m13.t02 | math.m13 | Retas paralelas e transversais | 2 | 2 | legacy_pending_review | não | full_review_pending | 0 |
| math.m13.t03 | math.m13 | Triângulos e classificação | 3 | 3 | legacy_pending_review | não | full_review_pending | 16 |
| math.m13.t04 | math.m13 | Soma dos ângulos | 4 | 4 | legacy_pending_review | não | full_review_pending | 8 |
| math.m13.t05 | math.m13 | Congruência e semelhança | 5 | 5 | legacy_pending_review | não | full_review_pending | 10 |
| math.m13.t06 | math.m13 | Teorema de Tales | 6 | 6 | legacy_pending_review | não | full_review_pending | 0 |
| math.m13.t07 | math.m13 | Teorema de Pitágoras | 7 | 7 | legacy_pending_review | não | full_review_pending | 4 |
| math.m13.t08 | math.m13 | Relações métricas do triângulo retângulo | 8 | 8 | legacy_pending_review | não | full_review_pending | 6 |
| math.m14.t01 | math.m14 | Quadriláteros e polígonos | 1 | 1 | legacy_pending_review | não | full_review_pending | 17 |
| math.m14.t02 | math.m14 | Polígonos regulares | 2 | 2 | legacy_pending_review | não | full_review_pending | 4 |
| math.m14.t03 | math.m14 | Perímetro e áreas | 3 | 3 | legacy_pending_review | não | full_review_pending | 26 |
| math.m14.t04 | math.m14 | Triângulo e fórmula de Heron (aprofundamento) | 4 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m14.t05 | math.m14 | Circunferência e círculo | 5 | 5 | legacy_pending_review | não | full_review_pending | 17 |
| math.m14.t06 | math.m14 | Arcos, setores e coroas | 6 | 6 | legacy_pending_review | não | full_review_pending | 2 |
| math.m14.t07 | math.m14 | Ângulo inscrito e central | 7 | 7 | legacy_pending_review | não | full_review_pending | 0 |
| math.m14.t08 | math.m14 | Tangência e relações geométricas | 8 | 8 | legacy_pending_review | não | full_review_pending | 6 |
| math.m15.t01 | math.m15 | Seno, cosseno e tangente no triângulo retângulo | 1 | 1 | legacy_pending_review | não | full_review_pending | 10 |
| math.m15.t02 | math.m15 | Ângulos notáveis | 2 | 2 | legacy_pending_review | não | full_review_pending | 4 |
| math.m15.t03 | math.m15 | Lei dos senos | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m15.t04 | math.m15 | Lei dos cossenos | 4 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m15.t05 | math.m15 | Ciclo trigonométrico (noções) | 5 | 5 | legacy_pending_review | não | full_review_pending | 4 |
| math.m15.t06 | math.m15 | Funções seno e cosseno | 6 | 6 | legacy_pending_review | não | full_review_pending | 4 |
| math.m15.t07 | math.m15 | Graus e radianos | 7 | 7 | legacy_pending_review | não | full_review_pending | 4 |
| math.m15.t08 | math.m15 | Interpretação de fenômenos periódicos | 8 | 8 | legacy_pending_review | não | full_review_pending | 4 |
| math.m16.t01 | math.m16 | Prismas e pirâmides | 1 | 1 | legacy_pending_review | não | full_review_pending | 28 |
| math.m16.t02 | math.m16 | Cubo e paralelepípedo | 2 | 2 | legacy_pending_review | não | full_review_pending | 19 |
| math.m16.t03 | math.m16 | Cilindros, cones e esferas | 3 | 3 | legacy_pending_review | não | full_review_pending | 36 |
| math.m16.t04 | math.m16 | Planificações | 4 | 4 | legacy_pending_review | não | full_review_pending | 1 |
| math.m16.t05 | math.m16 | Área lateral e total | 5 | 5 | legacy_pending_review | não | full_review_pending | 16 |
| math.m16.t06 | math.m16 | Volume | 6 | 6 | legacy_pending_review | não | full_review_pending | 46 |
| math.m16.t07 | math.m16 | Seções e relações de escala | 7 | 7 | legacy_pending_review | não | full_review_pending | 8 |
| math.m16.t08 | math.m16 | Troncos de cone e pirâmide | 8 | 8 | legacy_pending_review | não | full_review_pending | 5 |
| math.m17.t01 | math.m17 | Distância entre pontos | 1 | 1 | legacy_pending_review | não | full_review_pending | 4 |
| math.m17.t02 | math.m17 | Ponto médio | 2 | 2 | legacy_pending_review | não | full_review_pending | 1 |
| math.m17.t03 | math.m17 | Coeficiente angular | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m17.t04 | math.m17 | Retas e equações | 4 | 4 | legacy_pending_review | não | full_review_pending | 9 |
| math.m17.t05 | math.m17 | Paralelismo e perpendicularismo | 5 | 5 | legacy_pending_review | não | full_review_pending | 6 |
| math.m17.t06 | math.m17 | Interseção de retas | 6 | 6 | legacy_pending_review | não | full_review_pending | 8 |
| math.m17.t07 | math.m17 | Circunferência no plano | 7 | 7 | legacy_pending_review | não | full_review_pending | 4 |
| math.m17.t08 | math.m17 | Área por coordenadas | 8 | 8 | legacy_pending_review | não | full_review_pending | 4 |
| math.m18.t01 | math.m18 | Leitura de distribuição de frequência | 1 | 1 | legacy_pending_review | não | full_review_pending | 7 |
| math.m18.t02 | math.m18 | Tabelas e gráficos | 2 | 2 | legacy_pending_review | não | full_review_pending | 41 |
| math.m18.t03 | math.m18 | Média simples e ponderada | 3 | 3 | legacy_pending_review | não | full_review_pending | 30 |
| math.m18.t04 | math.m18 | Mediana e moda | 4 | 4 | legacy_pending_review | não | full_review_pending | 16 |
| math.m18.t05 | math.m18 | Amplitude | 5 | 5 | legacy_pending_review | não | full_review_pending | 0 |
| math.m18.t06 | math.m18 | Quartis e interpretação | 6 | 6 | legacy_pending_review | não | full_review_pending | 0 |
| math.m18.t07 | math.m18 | Variância e desvio padrão | 7 | 7 | legacy_pending_review | não | full_review_pending | 1 |
| math.m18.t08 | math.m18 | Identificação de gráficos enganosos | 8 | 8 | legacy_pending_review | não | full_review_pending | 0 |
| math.m19.t01 | math.m19 | Princípio fundamental da contagem | 1 | 1 | legacy_pending_review | não | full_review_pending | 4 |
| math.m19.t02 | math.m19 | Diagramas de árvore | 2 | 2 | legacy_pending_review | não | full_review_pending | 4 |
| math.m19.t03 | math.m19 | Permutação simples | 3 | 3 | legacy_pending_review | não | full_review_pending | 8 |
| math.m19.t04 | math.m19 | Permutação com repetição | 4 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m19.t05 | math.m19 | Arranjo | 5 | 5 | legacy_pending_review | não | full_review_pending | 4 |
| math.m19.t06 | math.m19 | Combinação | 6 | 6 | legacy_pending_review | não | full_review_pending | 8 |
| math.m19.t07 | math.m19 | Contagem com restrições | 7 | 7 | legacy_pending_review | não | full_review_pending | 8 |
| math.m19.t08 | math.m19 | Princípio aditivo e multiplicativo | 8 | 8 | legacy_pending_review | não | full_review_pending | 4 |
| math.m20.t01 | math.m20 | Espaço amostral e eventos | 1 | 1 | legacy_pending_review | não | full_review_pending | 4 |
| math.m20.t02 | math.m20 | Eventos equiprováveis | 2 | 2 | legacy_pending_review | não | full_review_pending | 4 |
| math.m20.t03 | math.m20 | Complementar | 3 | 3 | legacy_pending_review | não | full_review_pending | 0 |
| math.m20.t04 | math.m20 | União e interseção | 4 | 4 | legacy_pending_review | não | full_review_pending | 8 |
| math.m20.t05 | math.m20 | Eventos independentes | 5 | 5 | legacy_pending_review | não | full_review_pending | 4 |
| math.m20.t06 | math.m20 | Probabilidade condicional | 6 | 6 | legacy_pending_review | não | full_review_pending | 0 |
| math.m20.t07 | math.m20 | Contagem em probabilidades | 7 | 7 | legacy_pending_review | não | full_review_pending | 8 |
| math.m20.t08 | math.m20 | Probabilidade de múltiplas etapas | 8 | 8 | legacy_pending_review | não | full_review_pending | 6 |
| math.m21.t01 | math.m21 | Capitalização composta | 1 | 1 | legacy_pending_review | não | full_review_pending | 4 |
| math.m21.t02 | math.m21 | Taxas equivalentes | 2 | 2 | legacy_pending_review | não | full_review_pending | 0 |
| math.m21.t03 | math.m21 | Valor presente e futuro | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m21.t04 | math.m21 | Parcelamentos e prestações | 4 | 4 | legacy_pending_review | não | full_review_pending | 0 |
| math.m21.t05 | math.m21 | Comparação de investimentos | 5 | 5 | legacy_pending_review | não | full_review_pending | 7 |
| math.m21.t06 | math.m21 | Inflação acumulada | 6 | 6 | legacy_pending_review | não | full_review_pending | 0 |
| math.m21.t07 | math.m21 | Análise crítica de juros nominais e reais | 7 | 7 | legacy_pending_review | não | full_review_pending | 0 |
| math.m22.t01 | math.m22 | Funções definidas por partes | 1 | 1 | legacy_pending_review | não | full_review_pending | 0 |
| math.m22.t02 | math.m22 | Valor absoluto e módulo | 2 | 2 | legacy_pending_review | não | full_review_pending | 8 |
| math.m22.t03 | math.m22 | Relação entre gráficos e fórmulas | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m22.t04 | math.m22 | Otimização contextualizada | 4 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m22.t05 | math.m22 | Composição de modelos | 5 | 5 | legacy_pending_review | não | full_review_pending | 8 |
| math.m22.t06 | math.m22 | Modelos não lineares | 6 | 6 | legacy_pending_review | não | full_review_pending | 8 |
| math.m22.t07 | math.m22 | Comparação de crescimento linear e exponencial | 7 | 7 | legacy_pending_review | não | full_review_pending | 8 |
| math.m23.t01 | math.m23 | Amostragem e representatividade | 1 | 1 | legacy_pending_review | não | full_review_pending | 0 |
| math.m23.t02 | math.m23 | Viés amostral | 2 | 2 | legacy_pending_review | não | full_review_pending | 0 |
| math.m23.t03 | math.m23 | Correlação e causalidade | 3 | 3 | legacy_pending_review | não | full_review_pending | 0 |
| math.m23.t04 | math.m23 | Interpolação e extrapolação | 4 | 4 | legacy_pending_review | não | full_review_pending | 0 |
| math.m23.t05 | math.m23 | Séries temporais | 5 | 5 | legacy_pending_review | não | full_review_pending | 0 |
| math.m23.t06 | math.m23 | Leitura de boxplots | 6 | 6 | legacy_pending_review | não | full_review_pending | 0 |
| math.m23.t07 | math.m23 | Distribuição normal (intuição) | 7 | 7 | legacy_pending_review | não | full_review_pending | 0 |
| math.m23.t08 | math.m23 | Variabilidade e tomada de decisões | 8 | 8 | legacy_pending_review | não | full_review_pending | 0 |
| math.m24.t01 | math.m24 | Proporção + geometria | 1 | 1 | legacy_pending_review | não | full_review_pending | 8 |
| math.m24.t02 | math.m24 | Probabilidade + combinatória | 2 | 2 | legacy_pending_review | não | full_review_pending | 8 |
| math.m24.t03 | math.m24 | Função + finanças | 3 | 3 | legacy_pending_review | não | full_review_pending | 8 |
| math.m24.t04 | math.m24 | Geometria espacial + conversões | 4 | 4 | legacy_pending_review | não | full_review_pending | 8 |
| math.m24.t05 | math.m24 | Trigonometria + topografia | 5 | 5 | legacy_pending_review | não | full_review_pending | 4 |
| math.m24.t06 | math.m24 | Estatística + interpretação | 6 | 6 | legacy_pending_review | não | full_review_pending | 4 |
| math.m24.t07 | math.m24 | Estimativa e análise dimensional | 7 | 7 | legacy_pending_review | não | full_review_pending | 4 |
| math.m25.t01 | math.m25 | Matrizes e determinantes básicos | 1 | 1 | legacy_pending_review | não | full_review_pending | 6 |
| math.m25.t02 | math.m25 | Sistemas lineares por matrizes | 2 | 2 | legacy_pending_review | não | full_review_pending | 0 |
| math.m25.t03 | math.m25 | Números complexos noções | 3 | 3 | legacy_pending_review | não | full_review_pending | 4 |
| math.m25.t04 | math.m25 | Identidades trigonométricas básicas | 4 | 4 | legacy_pending_review | não | full_review_pending | 4 |
| math.m25.t05 | math.m25 | Equações modulares | 5 | 5 | legacy_pending_review | não | full_review_pending | 4 |
| math.m25.t06 | math.m25 | Cônicas em nível interpretativo | 6 | 6 | legacy_pending_review | não | full_review_pending | 4 |
| math.m25.t07 | math.m25 | Raciocínio lógico e conjuntos | 7 | 7 | legacy_pending_review | não | full_review_pending | 12 |
