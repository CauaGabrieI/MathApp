# Baseline de auditoria de conteúdo — Fase A

Gerado em 2026-10-19T16:37:05.871Z. Escopo: inventário verificável antes de alterar produção. Nenhum arquivo servido foi alterado por esta auditoria.

## Contagens confirmadas

- Currículo canônico: **25 módulos / 199 aulas**.
- Apoio legado arquivado: **11 módulos / 98 aulas** (98 não contam como as 199).
- Exercícios: **392 autorais Equação**, **1334 normalizados de EnemHub/Enem.dev**; 1366 referências de aula para 779 IDs únicos neste snapshot.
- Vídeos: **173/199 aulas** marcadas como verified; 646 IDs únicos e 969 referências nas aulas. Duração não está presente no catálogo auditado.

## Arquitetura e origem efetiva

- `public/learning-path.json` é a fonte canônica consumida pela GUI: 25 módulos, 199 aulas, IDs `math.mXX.tYY`, `prerequisiteIds`, `resources`, `questionIds` e `guide`.
- `content/math-curriculum.md` fornece títulos, nível e ordem; `scripts/import-curriculum.mjs` preserva IDs estáveis. A seção correspondente do Markdown original foi comparada por módulo/título/ordem.
- Teoria vem de `content/guides-foundations.mjs`/`guides-advanced.mjs` por `content/lesson-guides.mjs`; cada aula possui somente `summary`, `steps`, `pitfall` e `example` no guia atual.
- Apoios vêm das associações em `content/learning-path.mjs` para aulas `roadmap.*` arquivadas e geradas por `content/roadmap.mjs`. Há 45 aulas sem apoio legado.
- A GUI carrega `study-bank.json` + `bank.json` em `public/app.js`; `public/questions.json` é legado do `main.py`, fica excluído do build web e não foi contado como banco servido.
- Vídeos são servidos pelo `video-service.js` a partir de seeds/catálogo; `content/lesson-video-coverage.json` é evidência da auditoria de cobertura e não a fonte direta das abas.

## Comparação curricular

A seção Matemática local tem 25 módulos e 199 tópicos; o original disponível tem 25 módulos e 199 tópicos. Resultado da comparação: **mesmos títulos e ordens na seção comparada**. Isso não significa que o Markdown contenha aulas didáticas prontas.

## Achados prioritários

- **Alto — `math.m01.t01`**: recurso `roadmap.m02.l03 — Conjuntos numéricos`, card sobre dízima periódica e exemplo `√2`; desvio direto do objetivo Naturais e sistema decimal. A aula deve ser reescrita na fase produtiva para valor posicional e base dez.
- **Médio — Módulo 01**: operações básicas estão em t05 depois de frações e decimais; revisar ordem de apresentação preservando IDs.
- **Médio — Módulo 07**: Bhaskara está em t02 e discriminante em t04; a dependência conceitual pede ajuste de `displayOrder`/recomendação.
- **Alto — exercícios**: m23 tem 8 aulas sem questões associadas; 35 aulas não têm nenhum ID de exercício. 570 referências de questões importadas no currículo não têm explicação armazenada (as 392 autorais têm explicação). Isso exige revisão humana, não preenchimento automático.
- **Alto — vídeos**: 17 aulas estão `no_match_confirmed` e 9 `inconclusive`; não declarar ausência absoluta de vídeo. Metadados não têm duração e não houve teste de embeddability nesta fase.
- **Médio — estrutura didática**: o guia está presente nas 199 aulas, mas não contém campos semânticos de objetivo, diagnóstico, intuição, conceitos formais, conexões, mini-checagem ou referências por aula.

### Referências e limites

- `aula_modelo_naturais_sistema_decimal.md` não foi encontrada; o baseline registra essa ausência e não a usa como referência fictícia.
- A matriz e provas do Inep foram citadas no pedido, mas não foram baixadas/consultadas nesta fase. Não há afirmação de correspondência oficial.
- Correção matemática dos exemplos, gabaritos, alternativas, unidades e casos-limite permanece `not_performed_in_phase_A`. Testes de esquema não comprovam matemática.

## Inventário por aula

| ID | Módulo | Aula | Nível | Apoios | Exercícios/origens | Correção | Mídia | Vídeo | Severidade | Achados |
|---|---|---|---|---:|---:|---|---|---|---|---|
| math.m01.t01 | Números e operações | Naturais e sistema decimal | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (15) | alto | desvio de assunto no apoio/exemplo associado |
| math.m01.t02 | Números e operações | Inteiros e números negativos | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m01.t03 | Números e operações | Frações próprias e impróprias | Básico | 1 | 5 (equacao:4, enemhub:1) | 4/5 exp. | 0/5 | verified (9) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m01.t04 | Números e operações | Decimais e conversões | Básico | 1 | 9 (equacao:4, enemhub:1, enemdev:4) | 4/9 exp. | 2/9 | verified (12) | médio | 5 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m01.t05 | Números e operações | Adição, subtração, multiplicação e divisão | Básico | 1 | 9 (equacao:4, enemhub:3, enemdev:2) | 4/9 exp. | 1/9 | verified (7) | médio | 5 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m01.t06 | Números e operações | Ordem das operações e parênteses | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m01.t07 | Números e operações | Múltiplos e divisores | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m01.t08 | Números e operações | Critérios de divisibilidade | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m01.t09 | Números e operações | Números primos e fatoração | Básico | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (15) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m01.t10 | Números e operações | MMC e MDC | Básico | 1 | 6 (equacao:4, enemhub:2) | 4/6 exp. | 0/6 | verified (7) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m02.t01 | Razões e proporções | Razão e taxa | Básico | 1 | 78 (equacao:4, enemhub:64, enemdev:10) | 4/78 exp. | 7/78 | verified (19) | médio | 74 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m02.t02 | Razões e proporções | Proporcionalidade direta e inversa | Básico | 1 | 13 (equacao:4, enemhub:6, enemdev:3) | 4/13 exp. | 1/13 | verified (15) | médio | 9 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m02.t03 | Razões e proporções | Regra de três simples | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m02.t04 | Razões e proporções | Regra de três composta | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (2) | médio | inventário; revisão matemática pendente |
| math.m02.t05 | Razões e proporções | Divisão em partes proporcionais | Básico | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (4) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m02.t06 | Razões e proporções | Escalas | Básico | 1 | 38 (equacao:4, enemhub:23, enemdev:11) | 4/38 exp. | 6/38 | verified (5) | médio | 34 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m02.t07 | Razões e proporções | Velocidade média como razão | Básico | 0 | 4 (enemhub:2, enemdev:2) | 0/4 exp. | 2/4 | verified (9) | médio | 4 exercício(s) sem explicação armazenada; revisão humana necessária; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m02.t08 | Razões e proporções | Densidade e vazão | Básico | 0 | 14 (enemhub:5, enemdev:9) | 0/14 exp. | 5/14 | verified (2) | médio | 14 exercício(s) sem explicação armazenada; revisão humana necessária; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m03.t01 | Porcentagem e finanças básicas | Conversão fração-decimal-percentual | Básico | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m03.t02 | Porcentagem e finanças básicas | Cálculo percentual | Básico | 1 | 87 (equacao:4, enemhub:37, enemdev:46) | 4/87 exp. | 22/87 | verified (17) | médio | 83 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m03.t03 | Porcentagem e finanças básicas | Acréscimos e descontos | Básico | 1 | 19 (equacao:4, enemhub:7, enemdev:8) | 4/19 exp. | 2/19 | verified (16) | médio | 15 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m03.t04 | Porcentagem e finanças básicas | Variações sucessivas | Básico | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (3) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m03.t05 | Porcentagem e finanças básicas | Porcentagem reversa | Básico | 0 | 0 (—) | 0/0 exp. | 0/0 | no_match_confirmed (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: no_match_confirmed; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m03.t06 | Porcentagem e finanças básicas | Lucro e prejuízo | Básico | 0 | 11 (enemhub:4, enemdev:7) | 0/11 exp. | 3/11 | verified (2) | médio | 11 exercício(s) sem explicação armazenada; revisão humana necessária; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m03.t07 | Porcentagem e finanças básicas | Juros simples | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (2) | médio | inventário; revisão matemática pendente |
| math.m03.t08 | Porcentagem e finanças básicas | Juros compostos | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (12) | médio | inventário; revisão matemática pendente |
| math.m03.t09 | Porcentagem e finanças básicas | Taxa de juros e inflação | Básico | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (1) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m04.t01 | Potências e radicais | Potenciação e propriedades | Básico | 1 | 9 (equacao:4, enemhub:5) | 4/9 exp. | 0/9 | verified (5) | médio | 5 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m04.t02 | Potências e radicais | Potências de dez | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m04.t03 | Potências e radicais | Notação científica | Básico | 1 | 8 (equacao:4, enemhub:2, enemdev:2) | 4/8 exp. | 1/8 | verified (5) | médio | 4 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m04.t04 | Potências e radicais | Ordem de grandeza | Básico | 0 | 1 (enemhub:1) | 0/1 exp. | 0/1 | verified (3) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m04.t05 | Potências e radicais | Raiz quadrada e cúbica | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m04.t06 | Potências e radicais | Simplificação de radicais | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m04.t07 | Potências e radicais | Racionalização simples | Básico | 0 | 5 (enemhub:5) | 0/5 exp. | 0/5 | verified (7) | médio | 5 exercício(s) sem explicação armazenada; revisão humana necessária; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m04.t08 | Potências e radicais | Expoentes fracionários | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m05.t01 | Medidas e estimativas | SI e prefixos | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | no_match_confirmed (0) | alto | cobertura de vídeo: no_match_confirmed |
| math.m05.t02 | Medidas e estimativas | Conversões de comprimento, massa, volume, área e tempo | Básico | 1 | 6 (equacao:4, enemhub:1, enemdev:1) | 4/6 exp. | 1/6 | verified (3) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m05.t03 | Medidas e estimativas | Relação litro e metro cúbico | Básico | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m05.t04 | Medidas e estimativas | Medidas angulares | Básico | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m05.t05 | Medidas e estimativas | Estimativas | Básico | 0 | 0 (—) | 0/0 exp. | 0/0 | no_match_confirmed (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: no_match_confirmed; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m05.t06 | Medidas e estimativas | Algarismos significativos | Básico | 0 | 0 (—) | 0/0 exp. | 0/0 | inconclusive (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: inconclusive; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m05.t07 | Medidas e estimativas | Arredondamento e erro de medida | Básico | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (2) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m06.t01 | Álgebra fundamental | Variáveis e expressões | Intermediário | 1 | 5 (equacao:4, enemdev:1) | 4/5 exp. | 0/5 | verified (11) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m06.t02 | Álgebra fundamental | Propriedade distributiva | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m06.t03 | Álgebra fundamental | Produtos notáveis | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m06.t04 | Álgebra fundamental | Fatoração algébrica | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (9) | médio | inventário; revisão matemática pendente |
| math.m06.t05 | Álgebra fundamental | Frações algébricas | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (7) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m06.t06 | Álgebra fundamental | Equação do primeiro grau | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (9) | médio | inventário; revisão matemática pendente |
| math.m06.t07 | Álgebra fundamental | Inequações de primeiro grau | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (10) | médio | inventário; revisão matemática pendente |
| math.m06.t08 | Álgebra fundamental | Sistemas lineares 2x2 | Intermediário | 1 | 5 (equacao:4, enemhub:1) | 4/5 exp. | 0/5 | verified (7) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m06.t09 | Álgebra fundamental | Problemas com incógnitas | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m07.t01 | Equações e polinômios | Equação de segundo grau | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (13) | médio | inventário; revisão matemática pendente |
| math.m07.t02 | Equações e polinômios | Fórmula de Bhaskara | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (13) | médio | ordem canônica coloca Bhaskara antes de discriminante |
| math.m07.t03 | Equações e polinômios | Soma e produto das raízes | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m07.t04 | Equações e polinômios | Discriminante | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (2) | médio | inventário; revisão matemática pendente |
| math.m07.t05 | Equações e polinômios | Sistemas com equação quadrática | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (2) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m07.t06 | Equações e polinômios | Polinômios e operações | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (14) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m07.t07 | Equações e polinômios | Equações biquadradas (aprofundamento) | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (6) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m07.t08 | Equações e polinômios | Inequações quadráticas | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (9) | médio | inventário; revisão matemática pendente |
| math.m08.t01 | Introdução às funções | Conceito de função | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m08.t02 | Introdução às funções | Domínio, contradomínio e imagem | Intermediário | 2 | 9 (equacao:8, enemdev:1) | 8/9 exp. | 1/9 | verified (10) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m08.t03 | Introdução às funções | Pares ordenados | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m08.t04 | Introdução às funções | Plano cartesiano | Intermediário | 1 | 5 (equacao:4, enemdev:1) | 4/5 exp. | 1/5 | verified (8) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m08.t05 | Introdução às funções | Gráfico e tabela | Intermediário | 1 | 9 (equacao:4, enemdev:5) | 4/9 exp. | 3/9 | verified (23) | médio | 5 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m08.t06 | Introdução às funções | Crescimento e decrescimento | Intermediário | 2 | 9 (equacao:8, enemdev:1) | 8/9 exp. | 0/9 | verified (1) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m08.t07 | Introdução às funções | Taxa de variação | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m08.t08 | Introdução às funções | Zeros e interceptos | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (8) | médio | inventário; revisão matemática pendente |
| math.m08.t09 | Introdução às funções | Composição e função inversa (quando pertinente) | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m09.t01 | Função afim | Coeficientes angular e linear | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m09.t02 | Função afim | Equação da reta | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (15) | médio | inventário; revisão matemática pendente |
| math.m09.t03 | Função afim | Interpretação gráfica | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m09.t04 | Função afim | Zero da função | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m09.t05 | Função afim | Sinal da função | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m09.t06 | Função afim | Taxa constante | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m09.t07 | Função afim | Sistemas representados graficamente | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m09.t08 | Função afim | Modelagem de tarifas e consumos | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | no_match_confirmed (0) | alto | cobertura de vídeo: no_match_confirmed |
| math.m10.t01 | Função quadrática | Parábola e concavidade | Intermediário | 1 | 5 (equacao:4, enemdev:1) | 4/5 exp. | 1/5 | verified (12) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m10.t02 | Função quadrática | Zeros e vértice | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m10.t03 | Função quadrática | Máximos e mínimos | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m10.t04 | Função quadrática | Intervalos de sinal | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m10.t05 | Função quadrática | Gráfico e deslocamentos | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (8) | médio | inventário; revisão matemática pendente |
| math.m10.t06 | Função quadrática | Problemas de área/otimização | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m10.t07 | Função quadrática | Modelagem de trajetórias | Intermediário | 1 | 5 (equacao:4, enemdev:1) | 4/5 exp. | 1/5 | verified (2) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m11.t01 | Exponencial e logaritmos | Crescimento e decaimento exponencial | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m11.t02 | Exponencial e logaritmos | Função exponencial | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m11.t03 | Exponencial e logaritmos | Equações exponenciais | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m11.t04 | Exponencial e logaritmos | Conceito de logaritmo | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m11.t05 | Exponencial e logaritmos | Propriedades de logaritmos | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (2) | médio | inventário; revisão matemática pendente |
| math.m11.t06 | Exponencial e logaritmos | Função logarítmica | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m11.t07 | Exponencial e logaritmos | Escalas logarítmicas (pH, decibéis, Richter) | Intermediário | 1 | 6 (equacao:4, enemdev:2) | 4/6 exp. | 2/6 | inconclusive (0) | alto | 2 exercício(s) sem explicação armazenada; revisão humana necessária; cobertura de vídeo: inconclusive |
| math.m11.t08 | Exponencial e logaritmos | Aplicações a juros e populações | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (12) | médio | inventário; revisão matemática pendente |
| math.m12.t01 | Sequências e progressões | Padrões e sequências | Intermediário | 1 | 6 (equacao:4, enemdev:2) | 4/6 exp. | 2/6 | verified (2) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m12.t02 | Sequências e progressões | PA e termo geral | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (9) | médio | inventário; revisão matemática pendente |
| math.m12.t03 | Sequências e progressões | Soma da PA | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m12.t04 | Sequências e progressões | PG e termo geral | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m12.t05 | Sequências e progressões | Soma da PG finita | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m12.t06 | Sequências e progressões | Crescimento geométrico | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m12.t07 | Sequências e progressões | Sequências recorrentes simples | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (2) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m12.t08 | Sequências e progressões | Modelos financeiros | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m13.t01 | Geometria plana I | Ponto, reta, segmento e ângulo | Intermediário | 1 | 25 (equacao:4, enemhub:12, enemdev:9) | 4/25 exp. | 9/25 | verified (4) | médio | 21 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m13.t02 | Geometria plana I | Retas paralelas e transversais | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (3) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m13.t03 | Geometria plana I | Triângulos e classificação | Intermediário | 1 | 16 (equacao:4, enemhub:9, enemdev:3) | 4/16 exp. | 3/16 | verified (2) | médio | 12 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m13.t04 | Geometria plana I | Soma dos ângulos | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (8) | médio | inventário; revisão matemática pendente |
| math.m13.t05 | Geometria plana I | Congruência e semelhança | Intermediário | 2 | 10 (equacao:8, enemhub:2) | 8/10 exp. | 0/10 | verified (7) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m13.t06 | Geometria plana I | Teorema de Tales | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (4) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m13.t07 | Geometria plana I | Teorema de Pitágoras | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (17) | médio | inventário; revisão matemática pendente |
| math.m13.t08 | Geometria plana I | Relações métricas do triângulo retângulo | Intermediário | 1 | 6 (equacao:4, enemhub:2) | 4/6 exp. | 0/6 | verified (4) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m14.t01 | Geometria plana II | Quadriláteros e polígonos | Intermediário | 2 | 17 (equacao:8, enemhub:7, enemdev:2) | 8/17 exp. | 2/17 | verified (17) | médio | 9 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m14.t02 | Geometria plana II | Polígonos regulares | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m14.t03 | Geometria plana II | Perímetro e áreas | Intermediário | 2 | 26 (equacao:8, enemhub:15, enemdev:3) | 8/26 exp. | 3/26 | verified (4) | médio | 18 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m14.t04 | Geometria plana II | Triângulo e fórmula de Heron (aprofundamento) | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (2) | médio | inventário; revisão matemática pendente |
| math.m14.t05 | Geometria plana II | Circunferência e círculo | Intermediário | 1 | 17 (equacao:4, enemhub:8, enemdev:5) | 4/17 exp. | 5/17 | verified (13) | médio | 13 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m14.t06 | Geometria plana II | Arcos, setores e coroas | Intermediário | 0 | 2 (enemhub:1, enemdev:1) | 0/2 exp. | 1/2 | verified (8) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m14.t07 | Geometria plana II | Ângulo inscrito e central | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (5) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m14.t08 | Geometria plana II | Tangência e relações geométricas | Intermediário | 1 | 6 (equacao:4, enemhub:1, enemdev:1) | 4/6 exp. | 1/6 | verified (2) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m15.t01 | Trigonometria | Seno, cosseno e tangente no triângulo retângulo | Intermediário | 2 | 10 (equacao:8, enemdev:2) | 8/10 exp. | 2/10 | verified (8) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m15.t02 | Trigonometria | Ângulos notáveis | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m15.t03 | Trigonometria | Lei dos senos | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (10) | médio | inventário; revisão matemática pendente |
| math.m15.t04 | Trigonometria | Lei dos cossenos | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m15.t05 | Trigonometria | Ciclo trigonométrico (noções) | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m15.t06 | Trigonometria | Funções seno e cosseno | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m15.t07 | Trigonometria | Graus e radianos | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (2) | médio | inventário; revisão matemática pendente |
| math.m15.t08 | Trigonometria | Interpretação de fenômenos periódicos | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (2) | médio | inventário; revisão matemática pendente |
| math.m16.t01 | Geometria espacial | Prismas e pirâmides | Intermediário | 2 | 28 (equacao:8, enemhub:14, enemdev:6) | 8/28 exp. | 4/28 | verified (13) | médio | 20 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m16.t02 | Geometria espacial | Cubo e paralelepípedo | Intermediário | 1 | 19 (equacao:4, enemhub:10, enemdev:5) | 4/19 exp. | 3/19 | verified (11) | médio | 15 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m16.t03 | Geometria espacial | Cilindros, cones e esferas | Intermediário | 2 | 36 (equacao:8, enemhub:20, enemdev:8) | 8/36 exp. | 5/36 | verified (8) | médio | 28 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m16.t04 | Geometria espacial | Planificações | Intermediário | 0 | 1 (enemdev:1) | 0/1 exp. | 1/1 | verified (2) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m16.t05 | Geometria espacial | Área lateral e total | Intermediário | 4 | 16 (equacao:16) | 16/16 exp. | 0/16 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m16.t06 | Geometria espacial | Volume | Intermediário | 4 | 46 (equacao:16, enemhub:14, enemdev:16) | 16/46 exp. | 8/46 | verified (14) | médio | 30 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m16.t07 | Geometria espacial | Seções e relações de escala | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | inconclusive (0) | alto | cobertura de vídeo: inconclusive |
| math.m16.t08 | Geometria espacial | Troncos de cone e pirâmide | Intermediário | 0 | 5 (enemhub:3, enemdev:2) | 0/5 exp. | 1/5 | no_match_confirmed (0) | alto | 5 exercício(s) sem explicação armazenada; revisão humana necessária; cobertura de vídeo: no_match_confirmed; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m17.t01 | Geometria analítica | Distância entre pontos | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m17.t02 | Geometria analítica | Ponto médio | Intermediário | 0 | 1 (enemdev:1) | 0/1 exp. | 1/1 | verified (1) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m17.t03 | Geometria analítica | Coeficiente angular | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m17.t04 | Geometria analítica | Retas e equações | Intermediário | 1 | 9 (equacao:4, enemhub:5) | 4/9 exp. | 0/9 | verified (4) | médio | 5 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m17.t05 | Geometria analítica | Paralelismo e perpendicularismo | Intermediário | 1 | 6 (equacao:4, enemhub:2) | 4/6 exp. | 0/6 | verified (2) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m17.t06 | Geometria analítica | Interseção de retas | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m17.t07 | Geometria analítica | Circunferência no plano | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m17.t08 | Geometria analítica | Área por coordenadas | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m18.t01 | Estatística descritiva | Leitura de distribuição de frequência | Intermediário | 1 | 7 (equacao:4, enemhub:2, enemdev:1) | 4/7 exp. | 1/7 | verified (1) | médio | 3 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m18.t02 | Estatística descritiva | Tabelas e gráficos | Intermediário | 1 | 41 (equacao:4, enemhub:29, enemdev:8) | 4/41 exp. | 8/41 | verified (1) | médio | 37 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m18.t03 | Estatística descritiva | Média simples e ponderada | Intermediário | 1 | 30 (equacao:4, enemhub:4, enemdev:22) | 4/30 exp. | 17/30 | verified (15) | médio | 26 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m18.t04 | Estatística descritiva | Mediana e moda | Intermediário | 1 | 16 (equacao:4, enemdev:12) | 4/16 exp. | 11/16 | verified (6) | médio | 12 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m18.t05 | Estatística descritiva | Amplitude | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (1) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m18.t06 | Estatística descritiva | Quartis e interpretação | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | inconclusive (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: inconclusive; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m18.t07 | Estatística descritiva | Variância e desvio padrão | Intermediário | 0 | 1 (enemdev:1) | 0/1 exp. | 0/1 | verified (2) | médio | 1 exercício(s) sem explicação armazenada; revisão humana necessária; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m18.t08 | Estatística descritiva | Identificação de gráficos enganosos | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (1) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m19.t01 | Análise combinatória | Princípio fundamental da contagem | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m19.t02 | Análise combinatória | Diagramas de árvore | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | no_match_confirmed (0) | alto | cobertura de vídeo: no_match_confirmed |
| math.m19.t03 | Análise combinatória | Permutação simples | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m19.t04 | Análise combinatória | Permutação com repetição | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (4) | médio | inventário; revisão matemática pendente |
| math.m19.t05 | Análise combinatória | Arranjo | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m19.t06 | Análise combinatória | Combinação | Intermediário | 1 | 8 (equacao:4, enemhub:1, enemdev:3) | 4/8 exp. | 3/8 | verified (5) | médio | 4 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m19.t07 | Análise combinatória | Contagem com restrições | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m19.t08 | Análise combinatória | Princípio aditivo e multiplicativo | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (5) | médio | inventário; revisão matemática pendente |
| math.m20.t01 | Probabilidade | Espaço amostral e eventos | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (2) | médio | inventário; revisão matemática pendente |
| math.m20.t02 | Probabilidade | Eventos equiprováveis | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | no_match_confirmed (0) | alto | cobertura de vídeo: no_match_confirmed |
| math.m20.t03 | Probabilidade | Complementar | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (1) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m20.t04 | Probabilidade | União e interseção | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | no_match_confirmed (0) | alto | cobertura de vídeo: no_match_confirmed |
| math.m20.t05 | Probabilidade | Eventos independentes | Intermediário | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m20.t06 | Probabilidade | Probabilidade condicional | Intermediário | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (4) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m20.t07 | Probabilidade | Contagem em probabilidades | Intermediário | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m20.t08 | Probabilidade | Probabilidade de múltiplas etapas | Intermediário | 1 | 6 (equacao:4, enemdev:2) | 4/6 exp. | 0/6 | verified (2) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m21.t01 | Matemática financeira avançada | Capitalização composta | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (12) | médio | inventário; revisão matemática pendente |
| math.m21.t02 | Matemática financeira avançada | Taxas equivalentes | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | no_match_confirmed (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: no_match_confirmed; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m21.t03 | Matemática financeira avançada | Valor presente e futuro | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | inconclusive (0) | alto | cobertura de vídeo: inconclusive |
| math.m21.t04 | Matemática financeira avançada | Parcelamentos e prestações | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | no_match_confirmed (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: no_match_confirmed; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m21.t05 | Matemática financeira avançada | Comparação de investimentos | Avançado | 1 | 7 (equacao:4, enemhub:1, enemdev:2) | 4/7 exp. | 2/7 | no_match_confirmed (0) | alto | 3 exercício(s) sem explicação armazenada; revisão humana necessária; cobertura de vídeo: no_match_confirmed |
| math.m21.t06 | Matemática financeira avançada | Inflação acumulada | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (1) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m21.t07 | Matemática financeira avançada | Análise crítica de juros nominais e reais | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | no_match_confirmed (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: no_match_confirmed; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m22.t01 | Funções e modelagem integrada | Funções definidas por partes | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | no_match_confirmed (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: no_match_confirmed; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m22.t02 | Funções e modelagem integrada | Valor absoluto e módulo | Avançado | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (8) | médio | inventário; revisão matemática pendente |
| math.m22.t03 | Funções e modelagem integrada | Relação entre gráficos e fórmulas | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m22.t04 | Funções e modelagem integrada | Otimização contextualizada | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m22.t05 | Funções e modelagem integrada | Composição de modelos | Avançado | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (2) | médio | inventário; revisão matemática pendente |
| math.m22.t06 | Funções e modelagem integrada | Modelos não lineares | Avançado | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m22.t07 | Funções e modelagem integrada | Comparação de crescimento linear e exponencial | Avançado | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (17) | médio | inventário; revisão matemática pendente |
| math.m23.t01 | Estatística e inferência | Amostragem e representatividade | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (1) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m23.t02 | Estatística e inferência | Viés amostral | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | inconclusive (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: inconclusive; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m23.t03 | Estatística e inferência | Correlação e causalidade | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | no_match_confirmed (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: no_match_confirmed; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m23.t04 | Estatística e inferência | Interpolação e extrapolação | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (1) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m23.t05 | Estatística e inferência | Séries temporais | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | no_match_confirmed (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: no_match_confirmed; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m23.t06 | Estatística e inferência | Leitura de boxplots | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | inconclusive (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: inconclusive; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m23.t07 | Estatística e inferência | Distribuição normal (intuição) | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | inconclusive (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: inconclusive; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m23.t08 | Estatística e inferência | Variabilidade e tomada de decisões | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | verified (2) | alto | sem exercícios associados no índice da trilha; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m24.t01 | Problemas integrados | Proporção + geometria | Avançado | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (8) | médio | inventário; revisão matemática pendente |
| math.m24.t02 | Problemas integrados | Probabilidade + combinatória | Avançado | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m24.t03 | Problemas integrados | Função + finanças | Avançado | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | no_match_confirmed (0) | alto | cobertura de vídeo: no_match_confirmed |
| math.m24.t04 | Problemas integrados | Geometria espacial + conversões | Avançado | 2 | 8 (equacao:8) | 8/8 exp. | 0/8 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m24.t05 | Problemas integrados | Trigonometria + topografia | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | inconclusive (0) | alto | cobertura de vídeo: inconclusive |
| math.m24.t06 | Problemas integrados | Estatística + interpretação | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m24.t07 | Problemas integrados | Estimativa e análise dimensional | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (1) | médio | inventário; revisão matemática pendente |
| math.m25.t01 | Tópicos complementares | Matrizes e determinantes básicos | Avançado | 1 | 6 (equacao:4, enemdev:2) | 4/6 exp. | 2/6 | verified (6) | médio | 2 exercício(s) sem explicação armazenada; revisão humana necessária |
| math.m25.t02 | Tópicos complementares | Sistemas lineares por matrizes | Avançado | 0 | 0 (—) | 0/0 exp. | 0/0 | no_match_confirmed (0) | alto | sem exercícios associados no índice da trilha; cobertura de vídeo: no_match_confirmed; sem apoio legado associado; guia autoral é a única teoria estruturada disponível |
| math.m25.t03 | Tópicos complementares | Números complexos noções | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (6) | médio | inventário; revisão matemática pendente |
| math.m25.t04 | Tópicos complementares | Identidades trigonométricas básicas | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (9) | médio | inventário; revisão matemática pendente |
| math.m25.t05 | Tópicos complementares | Equações modulares | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (3) | médio | inventário; revisão matemática pendente |
| math.m25.t06 | Tópicos complementares | Cônicas em nível interpretativo | Avançado | 1 | 4 (equacao:4) | 4/4 exp. | 0/4 | verified (2) | médio | inventário; revisão matemática pendente |
| math.m25.t07 | Tópicos complementares | Raciocínio lógico e conjuntos | Avançado | 3 | 12 (equacao:12) | 12/12 exp. | 0/12 | verified (10) | médio | inventário; revisão matemática pendente |

O JSON contém os IDs, títulos, ordens, níveis, pré-requisitos, origem de teoria/guias/recursos, exemplos, metadados por exercício e vídeo, associações suspeitas, referências e limites de cada aula.
