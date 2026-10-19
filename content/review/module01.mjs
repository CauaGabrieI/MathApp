import {module01Alignment,INEP_NUMERIC_REFERENCE} from '../enem-alignment.mjs';
import {lessonPrerequisites,lessonDisplayOrder} from '../pedagogy-policy.mjs';
import {MODULE01_FEEDBACK} from './module01-feedback.mjs';
// Rascunho editorial do módulo 01. Não é importado pela produção.
// Portal do Inep e trecho indexado do relatório foram consultados. A matriz
// de 2009 não foi obtida integralmente; revisão humana do lote segue pendente.
const OFFICIAL_METADATA_REFERENCES = [
  {
    title: 'Matriz de Referência de Matemática e suas Tecnologias do Inep (metadado curricular; revisão pendente)',
    url: 'https://download.inep.gov.br/educacao_basica/enem/legislacao/2009/portaria_enem2009_2.pdf',
  },
  {
    title: 'Provas e gabaritos do Enem (metadado curricular; revisão pendente)',
    url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos',
  },
];

const TITLES = ['Naturais e sistema decimal', 'Inteiros e números negativos', 'Frações próprias e impróprias', 'Decimais e conversões', 'Adição, subtração, multiplicação e divisão', 'Ordem das operações e parênteses', 'Múltiplos e divisores', 'Critérios de divisibilidade', 'Números primos e fatoração', 'MMC e MDC'];

const refs = () => [...OFFICIAL_METADATA_REFERENCES.map(reference => ({...reference})), {title:'Relatório pedagógico Enem 2009–2010: trecho indexado da matriz consultado; alinhamento editorial',url:INEP_NUMERIC_REFERENCE}];

function exercise(lessonId, number, data) {
  const id = `equacao:${lessonId}:v2:${String(number).padStart(2, '0')}`;
  const distractorFeedback = MODULE01_FEEDBACK[id];
  if (!distractorFeedback) throw new Error(`Feedback de distrator ausente para ${id}`);
  const missingFeedback = data.choices
    .filter(choice => choice !== data.correctAnswer)
    .filter(choice => typeof distractorFeedback[choice] !== 'string' || !distractorFeedback[choice].trim());
  if (missingFeedback.length) throw new Error(`Feedback de distrator incompleto para ${id}: ${missingFeedback.join(', ')}`);
  return {
    id,
    skillIds: data.skillIds,
    level: data.level,
    kind: data.kind,
    statement: data.statement,
    choices: data.choices,
    correctAnswer: data.correctAnswer,
    solutionSteps: data.solutionSteps,
    distractorFeedback,
    prerequisiteIds: data.prerequisiteIds,
    reviewStatus: 'pending_human',
  };
}

function lesson(id, data) {
  return {
    id,
    title: TITLES[Number(id.split('.t')[1])-1],
    moduleId: 'math.m01', order:Number(id.split('.t')[1]),
    displayOrder:lessonDisplayOrder({id:'math.m01',order:1},{order:Number(id.split('.t')[1])}),
    contentVersion: 2,
    objective: data.objective,
    prerequisiteIds: lessonPrerequisites({order:1},{order:Number(id.split('.t')[1])}),
    diagnostic: data.diagnostic,
    introduction: data.introduction,
    concepts: data.concepts,
    procedureSteps: data.procedureSteps,
    examples: data.examples,
    mistakes: data.mistakes,
    summary: data.summary,
    checks: data.checks,
    connections: data.connections,
    references: refs(),
    enemAlignment: module01Alignment(id),
    exercises: data.exercises,
    reviewStatus: 'editorial_review_pending_human',
  };
}

export const MODULE01_LESSONS = {
  'math.m01.t01': lesson('math.m01.t01', {
    objective: 'Ler, compor, decompor, comparar e ordenar números naturais usando algarismos e o sistema de base dez.',
    prerequisiteIds: [],
    diagnostic: {
      question: 'Em 4 070, o que representa o algarismo 7?',
      answer: 'Sete dezenas, ou 70 unidades.',
      explanation: 'O algarismo 7 está na ordem das dezenas; seu valor depende dessa casa.',
    },
    introduction: 'Ao ler o número de uma casa ou o total de itens de um estoque, não basta reconhecer os algarismos: é preciso saber o valor que cada um representa. O sistema de base dez agrupa dez unidades em uma dezena, dez dezenas em uma centena e assim por diante.',
    concepts: [
      {title: 'Algarismo, número e valor posicional', text: 'Os dez algarismos são 0, 1, 2, 3, 4, 5, 6, 7, 8 e 9. Um número é formado por algarismos; a ordem de cada algarismo define seu valor. Em 5 284, 5 vale 5 000, 2 vale 200, 8 vale 80 e 4 vale 4.'},
      {title: 'Agrupamentos e base dez', text: 'Cada ordem vale dez vezes a ordem imediatamente à direita. Assim, 10 unidades formam 1 dezena, 10 dezenas formam 1 centena e 10 centenas formam 1 unidade de milhar. Acima dela vêm a dezena de milhar, a centena de milhar e a unidade de milhão; a leitura deve nomear a ordem, não apenas dizer “milhares”.'},
      {title: 'Composição, decomposição e ordenação', text: 'Compor é reunir valores posicionais: 3 000 + 400 + 20 + 6 = 3 426. Decompor é separar o número dessa maneira. O zero também é um número natural na convenção desta aula e conserva posições, como em 205. Para ordenar naturais escritos sem zeros à esquerda, compare primeiro a quantidade de algarismos e depois as ordens da esquerda para a direita.'},
    ],
    procedureSteps: [
      {step: 'Separe o número em ordens da direita para a esquerda: unidades, dezenas, centenas, unidade de milhar, dezena de milhar e centena de milhar.', why: 'A base dez atribui a cada casa um valor dez vezes maior que a casa à direita.'},
      {step: 'Multiplique cada algarismo pelo valor de sua ordem e some os resultados.', why: 'A soma dos valores posicionais reconstrói exatamente o número.'},
      {step: 'Para comparar dois naturais, observe primeiro a quantidade de ordens e, se empatar, compare a primeira ordem diferente.', why: 'Uma ordem mais à esquerda representa grupos maiores de unidades.'},
    ],
    examples: [
      {id: 'math.m01.t01.ex01', title: 'Valor de um algarismo', kind: 'direct', statement: 'Qual é o valor do algarismo 6 em 46 305?', solutionSteps: ['O 6 está na ordem das unidades de milhar.', 'Cada algarismo nessa ordem representa milhares de unidades.', '6 × 1 000 = 6 000.'], answer: '6 000'},
      {id: 'math.m01.t01.ex02', title: 'Leitura de um estoque', kind: 'context', statement: 'Uma cooperativa registrou 12 408 kg de grãos. Quais ordens aparecem nesse registro e quais são seus valores?', solutionSteps: ['Decomponha 12 408 kg = 10 000 kg + 2 000 kg + 400 kg + 8 kg.', 'Isso corresponde a 1 dezena de milhar (10 000 kg), 2 unidades de milhar (2 000 kg), 4 centenas (400 kg), 0 dezenas e 8 unidades (8 kg).', 'O zero mantém a casa das dezenas, mesmo sem acrescentar unidades.'], answer: '1 dezena de milhar (10 000 kg), 2 unidades de milhar (2 000 kg), 4 centenas (400 kg), 0 dezenas e 8 unidades (8 kg); total 12 408 kg'},
    ],
    mistakes: [
      {misconception: 'Confundir o algarismo com seu valor na casa.', correction: 'Em 7 200, o algarismo é 7, mas o valor posicional é 7 000.'},
      {misconception: 'Eliminar zeros internos ao escrever um número.', correction: 'Em 4 005, os zeros preservam as casas das centenas e dezenas.'},
      {misconception: 'Ordenar números olhando apenas o último algarismo.', correction: 'Compare as ordens da esquerda para a direita; 2 100 é maior que 1 999.'},
    ],
    summary: ['Os algarismos de 0 a 9 formam os números naturais.', 'Cada casa vale dez vezes a casa à direita.', 'Decompor um número é explicitar a soma dos seus valores posicionais.', 'Zeros internos preservam ordens e a comparação começa pela esquerda.'],
    checks: [
      {question: 'Como decompor 8 052?', answer: '8 000 + 50 + 2.'},
      {question: 'Qual é maior: 9 099 ou 9 909?', answer: '9 909, pois na ordem das centenas 9 é maior que 0.'},
      {question: 'O que vale o 3 em 3 400?', answer: '3 000.'},
    ],
    connections: [{lessonId: 'math.m01.t04', reason: 'A mesma lógica de ordens se estende aos décimos e centésimos.'}, {lessonId: 'math.m01.t05', reason: 'O alinhamento das ordens organiza as quatro operações.'}],
    exercises: [
      exercise('math.m01.t01', 1, {skillIds: ['valor-posicional'], level: 'EASY', kind: 'concept', statement: 'Em 8 305, qual é o valor do algarismo 3?', choices: ['3', '30', '300', '3 000'], correctAnswer: '300', solutionSteps: ['O 3 ocupa a casa das centenas.', '3 × 100 = 300.'], distractorFeedback: '3 é o algarismo; 30 e 3 000 correspondem a dezenas e milhares, casas diferentes.', prerequisiteIds: []}),
      exercise('math.m01.t01', 2, {skillIds: ['composicao-decomposicao'], level: 'EASY', kind: 'direct', statement: 'Qual número corresponde a 7 000 + 500 + 6?', choices: ['756', '7 056', '7 506', '7 560'], correctAnswer: '7 506', solutionSteps: ['Some milhares, centenas e unidades: 7 000 + 500 + 6 = 7 506.'], distractorFeedback: 'Os distratores trocam a ordem das dezenas ou retiram o zero que marca a casa vazia.', prerequisiteIds: []}),
      exercise('math.m01.t01', 3, {skillIds: ['ordenacao-naturais'], level: 'EASY', kind: 'interpretation', statement: 'Qual é a ordem crescente correta para 2 090, 2 009, 1 999 e 2 900?', choices: ['1 999, 2 009, 2 090, 2 900', '2 009, 1 999, 2 090, 2 900', '1 999, 2 090, 2 009, 2 900', '2 900, 2 090, 2 009, 1 999'], correctAnswer: '1 999, 2 009, 2 090, 2 900', solutionSteps: ['1 999 é o único com 1 na ordem dos milhares.', 'Entre os demais, compare centenas, dezenas e unidades.', 'Assim, 2 009 < 2 090 < 2 900.'], distractorFeedback: 'A ordenação precisa considerar a primeira ordem diferente, não apenas a última casa.', prerequisiteIds: []}),
      exercise('math.m01.t01', 4, {skillIds: ['sistema-decimal', 'interpretacao-contextual'], level: 'MEDIUM', kind: 'context', statement: 'Um painel mostra 40 702 visitantes. Quantas unidades o algarismo 7 representa?', choices: ['7', '70', '700', '7 000'], correctAnswer: '700', solutionSteps: ['O 7 está na casa das centenas.', 'Logo, representa 7 × 100 = 700 visitantes.'], distractorFeedback: 'A casa do algarismo deve ser lida da direita: unidades, dezenas, centenas, milhares.', prerequisiteIds: []}),
    ],
  }),

  'math.m01.t02': lesson('math.m01.t02', {
    objective: 'Representar, ordenar e operar com números inteiros em situações que envolvem ganhos, perdas e posições em relação ao zero.',
    prerequisiteIds: ['math.m01.t01', 'math.m01.t05'],
    diagnostic: {question: 'Na reta numérica, qual número está mais à esquerda: −2 ou −5?', answer: '−5.', explanation: 'Quanto mais à esquerda, menor o inteiro; −5 está cinco unidades abaixo de zero.'},
    introduction: 'Temperaturas abaixo de zero, saldos devedores e andares subterrâneos usam números inteiros negativos. A reta numérica ajuda a interpretar o sinal como direção e o módulo como distância até o zero.',
    concepts: [
      {title: 'Inteiros e reta numérica', text: 'O conjunto dos inteiros reúne negativos, zero e positivos. À direita do zero ficam os positivos; à esquerda, os negativos. Um número mais à direita é sempre maior.'},
      {title: 'Módulo', text: 'O módulo |a| é a distância de a até zero. Portanto |−7| = 7 e |7| = 7; o módulo não informa sozinho se a posição está acima ou abaixo de zero.'},
      {title: 'Sinais nas operações', text: 'Na adição, sinais iguais somam módulos e mantêm o sinal; sinais diferentes subtraem módulos e mantêm o sinal do maior módulo. No produto de fatores não nulos e na divisão por número não nulo, sinais iguais dão resultado positivo e sinais diferentes, negativo. Multiplicar por zero resulta em zero; não existe divisão por zero.'},
    ],
    procedureSteps: [
      {step: 'Represente cada inteiro como uma posição na reta.', why: 'A ordem espacial traduz diretamente a ordem numérica.'},
      {step: 'Na adição ou subtração, determine o sentido e a distância do deslocamento.', why: 'Somar um positivo avança; somar um negativo recua.'},
      {step: 'Em produto ou divisão, calcule os módulos e aplique a regra dos sinais.', why: 'A magnitude e o sinal são informações independentes.'},
    ],
    examples: [
      {id: 'math.m01.t02.ex01', title: 'Soma com sinais diferentes', kind: 'direct', statement: 'Calcule −14 + 9.', solutionSteps: ['Os sinais são diferentes; subtraia os módulos: 14 − 9 = 5.', 'O maior módulo é 14, que era negativo.', 'Resultado: −5.'], answer: '−5'},
      {id: 'math.m01.t02.ex02', title: 'Temperatura ao longo do dia', kind: 'context', statement: 'À meia-noite, a temperatura era −3 °C. Ela subiu 8 °C pela manhã e caiu 5 °C à noite. Qual foi a temperatura final?', solutionSteps: ['Subida: −3 + 8 = 5 °C.', 'Queda: 5 − 5 = 0 °C.', 'A temperatura final foi 0 °C.'], answer: '0 °C'},
    ],
    mistakes: [{misconception: 'Achar que −8 é maior que −3 porque 8 é maior que 3.', correction: 'Na reta, −8 fica mais à esquerda; portanto −8 < −3.'}, {misconception: 'Confundir módulo com o número.', correction: '|−6| = 6, mas o inteiro continua sendo −6.'}, {misconception: 'Aplicar a regra de sinais à soma como se fosse multiplicação.', correction: 'Na soma, analise módulos e sinais; “menos com menos dá mais” não vale para todos os casos.'}],
    summary: ['Inteiros negativos ficam à esquerda do zero.', 'O módulo é uma distância e nunca é negativo.', 'Sinais diferentes na soma produzem a diferença dos módulos.', 'No produto e na divisão, sinais iguais dão positivo e sinais diferentes dão negativo.'],
    checks: [{question: 'Qual é maior: −1 ou −4?', answer: '−1.'}, {question: 'Quanto vale |−12|?', answer: '12.'}, {question: 'Qual é o resultado de (−3) × (−4)?', answer: '12.'}],
    connections: [{lessonId: 'math.m01.t05', reason: 'As quatro operações com inteiros usam as regras de sinal desta aula.'}, {lessonId: 'math.m01.t06', reason: 'Expressões com parênteses exigem preservar sinais e prioridades.'}],
    exercises: [
      exercise('math.m01.t02', 1, {skillIds: ['reta-numerica', 'ordenacao-inteiros'], level: 'EASY', kind: 'concept', statement: 'Qual afirmação é verdadeira?', choices: ['−6 > −2', '−2 > −6', '0 < −1', '−4 = 4'], correctAnswer: '−2 > −6', solutionSteps: ['Na reta, −2 está à direita de −6.', 'Logo, −2 é maior que −6.'], distractorFeedback: 'Compare posições na reta; o maior módulo de um negativo não o torna maior.', prerequisiteIds: ['math.m01.t01', 'math.m01.t05']}),
      exercise('math.m01.t02', 2, {skillIds: ['operacoes-inteiros'], level: 'EASY', kind: 'direct', statement: 'Calcule −18 + 7 − 4.', choices: ['−29', '−15', '−7', '15'], correctAnswer: '−15', solutionSteps: ['−18 + 7 = −11.', '−11 − 4 = −15.'], distractorFeedback: 'Os sinais devem acompanhar cada parcela; não some os módulos como se fossem todos positivos.', prerequisiteIds: ['math.m01.t01', 'math.m01.t05']}),
      exercise('math.m01.t02', 3, {skillIds: ['deslocamento-inteiros'], level: 'EASY', kind: 'interpretation', statement: 'Um elevador está no andar −2 e sobe 5 andares. Em que andar chega?', choices: ['−7', '−3', '3', '7'], correctAnswer: '3', solutionSteps: ['Subir 5 significa adicionar 5: −2 + 5.', '−2 + 5 = 3.'], distractorFeedback: 'Subir é deslocar para a direita; não aumente a distância negativa.', prerequisiteIds: ['math.m01.t01', 'math.m01.t05']}),
      exercise('math.m01.t02', 4, {skillIds: ['adicao-subtracao-inteiros', 'interpretacao-contextual'], level: 'MEDIUM', kind: 'context', statement: 'Um saldo de −R$ 35 recebe um crédito de R$ 50 e depois uma taxa de R$ 12. Qual é o saldo final?', choices: ['−R$ 97', '−R$ 47', 'R$ 3', 'R$ 27'], correctAnswer: 'R$ 3', solutionSteps: ['Crédito: −35 + 50 = 15.', 'Taxa: 15 − 12 = 3.', 'O saldo final é R$ 3.'], distractorFeedback: 'Crédito aumenta o saldo e taxa o reduz; mantenha a unidade monetária e a ordem das etapas.', prerequisiteIds: ['math.m01.t01', 'math.m01.t05']}),
    ],
  }),

  'math.m01.t03': lesson('math.m01.t03', {
    objective: 'Interpretar frações próprias e impróprias, obter frações equivalentes e calcular operações básicas com denominadores não nulos.',
    prerequisiteIds: ['math.m01.t01', 'math.m01.t05', 'math.m01.t10'],
    diagnostic: {question: 'Por que 2/3 e 4/6 representam a mesma quantidade?', answer: 'Porque numerador e denominador foram multiplicados pelo mesmo número não nulo.', explanation: 'Multiplicar os dois termos por 2 preserva a razão.'},
    introduction: 'Uma barra de chocolate dividida em partes iguais mostra o sentido de uma fração: o denominador informa em quantas partes iguais o todo foi dividido, e o numerador informa quantas partes foram tomadas.',
    concepts: [{title: 'Termos da fração', text: 'Nesta aula usamos frações não negativas: em a/b, com a ≥ 0 e b > 0, a é o numerador e b é o denominador. Fração própria tem 0 ≤ a < b; fração imprópria tem a ≥ b.'}, {title: 'Equivalência e simplificação', text: 'Multiplicar ou dividir numerador e denominador pelo mesmo fator positivo gera uma fração equivalente. Simplificar reduz os termos sem alterar o valor.'}, {title: 'Operações', text: 'Para somar ou subtrair, use denominador comum. Para multiplicar, multiplique termos correspondentes. Para dividir por uma fração não nula, multiplique pelo inverso.'}],
    procedureSteps: [{step: 'Identifique o denominador comum quando somar ou subtrair.', why: 'Só é possível reunir partes quando elas têm o mesmo tamanho.'}, {step: 'Converta cada fração para uma equivalente com esse denominador.', why: 'A quantidade representada não muda, apenas a unidade de partição.'}, {step: 'Opere os numeradores e simplifique, se possível.', why: 'Com as partes alinhadas, a soma ou diferença conta quantas partes foram reunidas.'}],
    examples: [{id: 'math.m01.t03.ex01', title: 'Soma de frações', kind: 'direct', statement: 'Calcule 3/4 + 5/6.', solutionSteps: ['MMC(4,6) = 12.', '3/4 = 9/12 e 5/6 = 10/12.', '9/12 + 10/12 = 19/12 = 1 7/12.'], answer: '19/12 ou 1 7/12'}, {id: 'math.m01.t03.ex02', title: 'Porções de uma receita', kind: 'context', statement: 'Uma receita usa 3/4 de xícara de farinha por bolo. Para 2 bolos, quantas xícaras são necessárias?', solutionSteps: ['Multiplique a quantidade por 2: 2 × 3/4.', '2 × 3/4 = 6/4 = 3/2.', '3/2 = 1 1/2 xícara.'], answer: '1 1/2 xícara'}],
    mistakes: [{misconception: 'Somar numeradores e denominadores diretamente.', correction: 'Em 1/3 + 1/3 = 2/3, o denominador continua 3 porque as partes já têm o mesmo tamanho; ele não é somado.'}, {misconception: 'Inverter a primeira fração ao dividir.', correction: 'Na divisão a/b ÷ c/d, mantenha a/b e multiplique pelo inverso de c/d.'}, {misconception: 'Cancelar termos que não são fatores.', correction: 'Simplifique fatores comuns no numerador e denominador, não parcelas de uma soma.'}],
    summary: ['O denominador define o tamanho das partes e não pode ser zero.', 'Frações equivalentes têm o mesmo valor.', 'Somas e subtrações exigem partes de mesmo tamanho.', 'Dividir por uma fração é multiplicar pelo seu inverso.'],
    checks: [{question: 'Qual é uma fração equivalente a 2/5?', answer: '4/10, por exemplo.'}, {question: 'Quanto vale 1/2 + 1/4?', answer: '3/4.'}, {question: 'Uma fração imprópria sempre é maior que 1?', answer: 'Se o numerador e o denominador forem positivos e o numerador for maior ou igual ao denominador, sim.'}],
    connections: [{lessonId: 'math.m01.t04', reason: 'Frações com denominador potência de dez podem ser escritas como decimais.'}, {lessonId: 'math.m01.t10', reason: 'MMC auxilia a encontrar denominadores comuns.'}],
    exercises: [
      exercise('math.m01.t03', 1, {skillIds: ['equivalencia-fracoes'], level: 'EASY', kind: 'concept', statement: 'Qual fração é equivalente a 3/5?', choices: ['3/10', '6/10', '5/3', '8/10'], correctAnswer: '6/10', solutionSteps: ['Multiplique numerador e denominador por 2: 3/5 = 6/10.'], distractorFeedback: 'A equivalência exige multiplicar os dois termos pelo mesmo fator.', prerequisiteIds: ['math.m01.t01']}),
      exercise('math.m01.t03', 2, {skillIds: ['soma-fracoes'], level: 'EASY', kind: 'direct', statement: 'Calcule 2/3 + 1/6.', choices: ['3/9', '1/2', '5/6', '3/4'], correctAnswer: '5/6', solutionSteps: ['2/3 = 4/6.', '4/6 + 1/6 = 5/6.'], distractorFeedback: 'O denominador comum é 6; não some 3 com 6.', prerequisiteIds: ['math.m01.t01', 'math.m01.t05', 'math.m01.t10']}),
      exercise('math.m01.t03', 3, {skillIds: ['multiplicacao-fracoes'], level: 'EASY', kind: 'direct', statement: 'Calcule 3/5 × 10/9 e escreva o resultado na forma irredutível.', choices: ['2/3', '1/3', '13/14', '45/30'], correctAnswer: '2/3', solutionSteps: ['Multiplique: 30/45.', 'Simplifique por 15: 30/45 = 2/3.'], distractorFeedback: '30/45 é uma etapa correta, mas a resposta deve estar simplificada.', prerequisiteIds: ['math.m01.t01']}),
      exercise('math.m01.t03', 4, {skillIds: ['fracao-de-quantidade', 'interpretacao-contextual'], level: 'MEDIUM', kind: 'context', statement: 'Uma caixa tem 24 lápis. Dois terços são azuis. Quantos lápis azuis há?', choices: ['8', '12', '16', '18'], correctAnswer: '16', solutionSteps: ['Calcule 2/3 de 24: 24 ÷ 3 = 8.', 'Multiplique por 2: 2 × 8 = 16.'], distractorFeedback: 'Dividir por 3 encontra uma parte; ainda é necessário tomar duas partes.', prerequisiteIds: ['math.m01.t01', 'math.m01.t05']}),
    ],
  }),

  'math.m01.t04': lesson('math.m01.t04', {
    objective: 'Ler e converter números decimais, comparar suas ordens e realizar cálculos monetários com vírgula decimal.',
    prerequisiteIds: ['math.m01.t01', 'math.m01.t03', 'math.m01.t05'],
    diagnostic: {question: 'Qual é maior: 0,7 ou 0,65?', answer: '0,7, pois 0,70 > 0,65.', explanation: 'Acrescente um zero à direita para comparar casas equivalentes.'},
    introduction: 'Preços, medidas e resultados de medições usam partes da unidade. A vírgula separa unidades inteiras das partes: 2,35 significa 2 unidades, 3 décimos e 5 centésimos.',
    concepts: [{title: 'Ordens decimais', text: 'À direita da vírgula aparecem décimos, centésimos e milésimos. Zeros à direita podem ser acrescentados sem alterar o valor: 0,5 = 0,50.'}, {title: 'Conversões entre fração e decimal', text: 'Um decimal finito pode virar fração com denominador 10, 100, 1 000 etc. Para fazer o caminho inverso, divida o numerador pelo denominador: 3/8 = 0,375. Nesta aula, a conversão percentual fica para a aula de porcentagem.'}, {title: 'Operações com vírgula', text: 'Em adições e subtrações, alinhe as vírgulas. Na multiplicação, conte as casas decimais no produto; na divisão por um número diferente de zero, torne o divisor inteiro multiplicando dividendo e divisor pela mesma potência de dez. A divisão por zero não é definida.'}],
    procedureSteps: [{step: 'Iguale a quantidade de casas decimais acrescentando zeros à direita.', why: 'Zeros finais não alteram o valor e facilitam a leitura das mesmas ordens.'}, {step: 'Alinhe as vírgulas nas adições e subtrações.', why: 'Unidades devem ser somadas com unidades, décimos com décimos e assim por diante.'}, {step: 'Confira a ordem de grandeza e a unidade.', why: 'Uma estimativa detecta erros como deslocar a vírgula uma casa.'}],
    examples: [{id: 'math.m01.t04.ex01', title: 'Conversão para fração', kind: 'direct', statement: 'Converta 0,375 para uma fração simplificada.', solutionSteps: ['Há três casas decimais: 0,375 = 375/1 000.', 'Divida numerador e denominador por 125.', '375/1 000 = 3/8.'], answer: '3/8'}, {id: 'math.m01.t04.ex02', title: 'Compra no mercado', kind: 'context', statement: 'Uma pessoa compra 1,5 kg de arroz a R$ 6,40 por kg. Qual é o preço?', solutionSteps: ['Multiplique 6,40 por 1,5.', '6,40 × 1 = 6,40 e 6,40 × 0,5 = 3,20.', 'Some: 6,40 + 3,20 = R$ 9,60.'], answer: 'R$ 9,60'}],
    mistakes: [{misconception: 'Interpretar 0,8 como menor que 0,75 porque 8 é menor que 75.', correction: 'Compare casas iguais: 0,80 > 0,75.'}, {misconception: 'Alinhar os números pela borda ao somar.', correction: 'Alinhe as vírgulas, não o primeiro algarismo.'}, {misconception: 'Usar ponto como separador decimal sem esclarecer a convenção.', correction: 'No texto em português brasileiro, use vírgula decimal e mantenha a unidade.'}],
    summary: ['A vírgula separa unidades inteiras e partes da unidade.', 'Zeros finais à direita não mudam o valor.', 'Alinhe vírgulas para somar ou subtrair.', 'Converta decimais finitos em frações com denominadores 10, 100, 1 000 e simplifique quando possível.'],
    checks: [{question: 'Quanto vale 2,05 em centésimos?', answer: '205 centésimos.'}, {question: 'Qual é a fração de 0,4?', answer: '2/5, ou 4/10 antes de simplificar.'}, {question: 'Como comparar 1,2 e 1,20?', answer: 'São iguais.'}],
    connections: [{lessonId: 'math.m01.t03', reason: 'Decimais finitos são frações com denominadores potência de dez.'}, {lessonId: 'math.m01.t05', reason: 'Operações monetárias dependem do alinhamento das ordens.'}],
    exercises: [
      exercise('math.m01.t04', 1, {skillIds: ['leitura-decimal'], level: 'EASY', kind: 'concept', statement: 'Qual número representa 4 unidades e 7 centésimos?', choices: ['4,7', '4,07', '4,007', '0,47'], correctAnswer: '4,07', solutionSteps: ['Sete centésimos ocupam a segunda casa após a vírgula.', 'Logo, o número é 4,07.'], distractorFeedback: '4,7 representa sete décimos; a posição da casa decimal importa.', prerequisiteIds: ['math.m01.t01']}),
      exercise('math.m01.t04', 2, {skillIds: ['operacoes-decimais'], level: 'EASY', kind: 'direct', statement: 'Calcule 12,50 − 3,78.', choices: ['8,22', '8,72', '9,28', '16,28'], correctAnswer: '8,72', solutionSteps: ['Alinhe vírgulas: 12,50 − 3,78.', 'Reagrupe 12,50 como 11 unidades, 14 décimos e 10 centésimos.', 'Subtraia cada ordem: 11 − 3 = 8 unidades; 14 − 7 = 7 décimos; 10 − 8 = 2 centésimos.', 'O resultado é 8,72.'], distractorFeedback: 'A diferença deve respeitar as casas decimais; 8,22 resulta de uma subtração de algarismos mal alinhada.', prerequisiteIds: ['math.m01.t01']}),
      exercise('math.m01.t04', 3, {skillIds: ['conversao-fracao-decimal'], level: 'EASY', kind: 'direct', statement: 'Converta 3/8 para número decimal.', choices: ['0,0375', '0,375', '3,8', '0,83'], correctAnswer: '0,375', solutionSteps: ['Escreva uma fração equivalente com denominador 1 000: 3/8 = 375/1 000.', '375/1 000 = 0,375.'], distractorFeedback: 'A conversão deve preservar o valor; 3/8 não é 3,8 e a vírgula deve marcar três casas em 375/1 000.', prerequisiteIds: ['math.m01.t01', 'math.m01.t03', 'math.m01.t05']}),
      exercise('math.m01.t04', 4, {skillIds: ['multiplicacao-decimal', 'unidades'], level: 'MEDIUM', kind: 'context', statement: 'Uma torneira libera 2,5 litros por minuto. Quantos litros libera em 8 minutos?', choices: ['10 L', '16 L', '20 L', '25 L'], correctAnswer: '20 L', solutionSteps: ['Multiplique a vazão pelo tempo: 2,5 × 8.', '2,5 × 8 = 20.', 'A unidade é litro.'], distractorFeedback: 'Não some a vazão ao longo dos minutos; uma taxa constante é multiplicada pelo tempo.', prerequisiteIds: ['math.m01.t01', 'math.m01.t05']}),
    ],
  }),

  'math.m01.t05': lesson('math.m01.t05', {
    objective: 'Escolher e executar adição, subtração, multiplicação ou divisão em problemas com números naturais e unidades coerentes.',
    prerequisiteIds: ['math.m01.t01'],
    diagnostic: {question: 'Qual operação representa 4 grupos de 7 objetos?', answer: 'Multiplicação: 4 × 7.', explanation: 'Grupos iguais podem ser somados repetidamente ou multiplicados.'},
    introduction: 'Resolver uma situação começa por entender a ação: juntar, retirar, comparar, repetir grupos ou repartir. A conta é consequência do significado do enunciado.',
    concepts: [{title: 'Sentido das operações', text: 'Adição junta ou aumenta; subtração retira ou encontra uma diferença; multiplicação reúne grupos iguais; divisão reparte em partes iguais ou mede quantos grupos cabem.'}, {title: 'Relações inversas', text: 'Adição e subtração se desfazem; multiplicação e divisão se desfazem quando o divisor é diferente de zero. A verificação pela operação inversa ajuda a detectar erros.'}, {title: 'Estimativa e unidade', text: 'Antes da conta, estime a ordem de grandeza. Ao final, escreva a unidade e verifique se o resultado faz sentido no contexto.'}],
    procedureSteps: [{step: 'Identifique a quantidade desconhecida e a relação entre as quantidades.', why: 'A relação semântica determina a operação adequada.'}, {step: 'Monte a conta preservando as ordens e unidades.', why: 'O alinhamento evita misturar unidades ou casas diferentes.'}, {step: 'Calcule, estime e confira pela operação inversa.', why: 'A estimativa e a inversa funcionam como verificações independentes.'}],
    examples: [{id: 'math.m01.t05.ex01', title: 'Divisão exata', kind: 'direct', statement: 'Calcule 936 ÷ 12.', solutionSteps: ['12 × 70 = 840; resta 96.', '12 × 8 = 96.', 'Logo, 936 ÷ 12 = 78.'], answer: '78'}, {id: 'math.m01.t05.ex02', title: 'Caixas e unidades', kind: 'context', statement: 'Uma escola recebeu 7 caixas com 24 cadernos cada e distribuiu 35 cadernos. Quantos cadernos sobraram?', solutionSteps: ['Total recebido: 7 × 24 = 168.', 'Subtraia os distribuídos: 168 − 35 = 133.', 'Sobraram 133 cadernos.'], answer: '133 cadernos'}],
    mistakes: [{misconception: 'Escolher a operação apenas por uma palavra do enunciado.', correction: 'Leia a relação inteira; “a mais” pode pedir comparação, e “por” pode indicar multiplicação ou taxa.'}, {misconception: 'Dividir sem verificar se o divisor é zero.', correction: 'A divisão por zero não é definida.'}, {misconception: 'Dar resposta sem unidade em um problema contextual.', correction: 'A unidade comunica o que foi contado ou medido.'}],
    summary: ['A operação deve refletir a ação do problema.', 'Multiplicação é uma forma de reunir grupos iguais.', 'Divisão pode repartir ou medir grupos.', 'Estimativa, unidade e operação inversa ajudam a conferir o resultado.'],
    checks: [{question: 'Que operação desfaz 8 × 6?', answer: 'Divisão por 8 ou por 6, conforme o fator procurado.'}, {question: 'Qual operação encontra quanto falta para chegar a um total?', answer: 'Subtração.'}, {question: 'O que não pode ser divisor?', answer: 'Zero.'}],
    connections: [{lessonId: 'math.m01.t06', reason: 'Expressões combinam as quatro operações com prioridades.'}, {lessonId: 'math.m01.t07', reason: 'Divisores e múltiplos descrevem divisões exatas.'}],
    exercises: [
      exercise('math.m01.t05', 1, {skillIds: ['sentido-operacoes'], level: 'EASY', kind: 'concept', statement: 'Adotando o registro “número de grupos × quantidade em cada grupo”, como escrever 5 grupos com 9 elementos em cada um?', choices: ['5 + 9', '9 − 5', '5 × 9', '9 ÷ 5'], correctAnswer: '5 × 9', solutionSteps: ['O primeiro fator conta os 5 grupos.', 'O segundo fator informa que cada grupo tem 9 elementos.', 'A expressão é 5 × 9.'], distractorFeedback: 'A multiplicação representa a repetição de grupos iguais; a ordem pedida no enunciado identifica 5 como número de grupos e 9 como quantidade por grupo.', prerequisiteIds: ['math.m01.t01']}),
      exercise('math.m01.t05', 2, {skillIds: ['algoritmo-divisao'], level: 'EASY', kind: 'direct', statement: 'Calcule 864 ÷ 8.', choices: ['98', '108', '112', '128'], correctAnswer: '108', solutionSteps: ['8 × 100 = 800 e resta 64.', '8 × 8 = 64.', 'Portanto, o quociente é 108.'], distractorFeedback: 'Use a operação inversa: 108 × 8 deve reconstruir 864.', prerequisiteIds: ['math.m01.t01']}),
      exercise('math.m01.t05', 3, {skillIds: ['problema-aditivo'], level: 'EASY', kind: 'context', statement: 'Uma biblioteca tinha 428 livros e recebeu mais 175. Quantos livros passou a ter?', choices: ['253', '503', '603', '703'], correctAnswer: '603', solutionSteps: ['Receber mais indica adição.', '428 + 175 = 603.'], distractorFeedback: 'O total aumenta; subtração ou troca de centenas produz resultados incompatíveis.', prerequisiteIds: ['math.m01.t01']}),
      exercise('math.m01.t05', 4, {skillIds: ['problema-multi-etapas', 'estimativa'], level: 'MEDIUM', kind: 'multi-step', statement: 'Uma feira vende 4 caixas com 18 maçãs cada. Dez maçãs são descartadas e as restantes são repartidas igualmente entre 2 bancas. Quantas maçãs recebe cada banca?', choices: ['26', '31', '36', '41'], correctAnswer: '31', solutionSteps: ['Total: 4 × 18 = 72.', 'Restantes: 72 − 10 = 62.', 'Repartição: 62 ÷ 2 = 31.'], distractorFeedback: 'Respeite as etapas: primeiro reúna as caixas, depois retire e só então reparta.', prerequisiteIds: ['math.m01.t01']}),
    ],
  }),

  'math.m01.t06': lesson('math.m01.t06', {
    objective: 'Resolver expressões numéricas respeitando parênteses, potências simples e a prioridade entre multiplicação, divisão, adição e subtração.',
    prerequisiteIds: ['math.m01.t05', 'math.m01.t02'],
    diagnostic: {question: 'Em 8 + 3 × 2, qual operação vem primeiro?', answer: 'A multiplicação: 3 × 2.', explanation: 'Multiplicação e divisão têm prioridade sobre adição e subtração.'},
    introduction: 'Uma expressão escrita sem prioridade pode gerar respostas diferentes. As convenções de cálculo funcionam como uma regra de leitura comum, preservando a estrutura da situação representada.',
    concepts: [{title: 'Hierarquia', text: 'Uma potência indica multiplicação repetida: 2³ significa 2 × 2 × 2 = 8. Resolva primeiro agrupamentos entre parênteses, colchetes ou chaves; depois potências; em seguida multiplicações e divisões; por fim adições e subtrações. As raízes e demais propriedades de potências serão estudadas no módulo Potências e radicais.'}, {title: 'Mesma prioridade', text: 'Operações na mesma camada são realizadas da esquerda para a direita. 24 ÷ 6 × 2 = 4 × 2 = 8.'}, {title: 'Sinal e agrupamento', text: '−(3 + 2) é o oposto de toda a soma, enquanto −3 + 2 é uma soma de parcelas. Parênteses tornam essa diferença explícita.'}],
    procedureSteps: [{step: 'Resolva os agrupamentos internos, do mais interno para o mais externo.', why: 'O agrupamento determina quais valores formam uma parte única da expressão.'}, {step: 'Calcule potências e raízes quando aparecerem.', why: 'Essas operações definem um número antes das operações de multiplicação ou divisão.'}, {step: 'Faça multiplicações e divisões da esquerda para a direita; depois adições e subtrações.', why: 'Essa ordem evita que uma operação de menor prioridade altere um fator antes da hora.'}],
    examples: [{id: 'math.m01.t06.ex01', title: 'Expressão com agrupamento', kind: 'direct', statement: 'Calcule 18 − 2 × (3 + 4).', solutionSteps: ['Parênteses: 3 + 4 = 7.', 'Multiplicação: 2 × 7 = 14.', 'Subtração: 18 − 14 = 4.'], answer: '4'}, {id: 'math.m01.t06.ex02', title: 'Tarifa de transporte', kind: 'context', statement: 'Uma corrida cobra R$ 6 de bandeirada e R$ 3 por quilômetro. Para 8 km, qual expressão e qual total representam a corrida?', solutionSteps: ['Modele: 6 + 3 × 8.', 'Multiplique antes de somar: 3 × 8 = 24.', 'Total: 6 + 24 = R$ 30.'], answer: '6 + 3 × 8 = R$ 30'}],
    mistakes: [{misconception: 'Resolver sempre da esquerda para a direita ignorando prioridades.', correction: 'Só operações de mesma prioridade seguem da esquerda para a direita.'}, {misconception: 'Distribuir um sinal negativo apenas ao primeiro termo.', correction: '−(a + b) = −a − b; o sinal afeta todos os termos dentro do agrupamento.'}, {misconception: 'Confundir 2³ com 2 × 3.', correction: '2³ significa 2 × 2 × 2 = 8.'}],
    summary: ['Agrupamentos internos vêm primeiro.', 'Potências precedem multiplicações e divisões.', 'Multiplicação e divisão têm prioridade sobre adição e subtração.', 'Operações de mesma prioridade seguem da esquerda para a direita.'],
    checks: [{question: 'Quanto vale 4 + 2 × 5?', answer: '14.'}, {question: 'Quanto vale (4 + 2) × 5?', answer: '30.'}, {question: 'Em 20 ÷ 5 × 2, qual é o resultado?', answer: '8.'}],
    connections: [{lessonId: 'math.m01.t02', reason: 'Parênteses e sinais organizam expressões com inteiros.'}, {lessonId: 'math.m01.t05', reason: 'A escolha das operações vem antes da execução da expressão.'}],
    exercises: [
      exercise('math.m01.t06', 1, {skillIds: ['prioridade-operacoes'], level: 'EASY', kind: 'concept', statement: 'Qual é o resultado de 7 + 2 × 4?', choices: ['36', '15', '16', '9'], correctAnswer: '15', solutionSteps: ['Faça a multiplicação: 2 × 4 = 8.', 'Some 7 + 8 = 15.'], distractorFeedback: 'Somar antes de multiplicar produz 36, mas viola a prioridade.', prerequisiteIds: ['math.m01.t05']}),
      exercise('math.m01.t06', 2, {skillIds: ['parenteses'], level: 'EASY', kind: 'direct', statement: 'Calcule 30 − [4 × (2 + 3)].', choices: ['5', '10', '14', '130'], correctAnswer: '10', solutionSteps: ['2 + 3 = 5.', '4 × 5 = 20.', '30 − 20 = 10.'], distractorFeedback: 'Resolva o parêntese antes da multiplicação e da subtração.', prerequisiteIds: ['math.m01.t05']}),
      exercise('math.m01.t06', 3, {skillIds: ['expressao-com-unidade'], level: 'EASY', kind: 'context', statement: 'Um estacionamento cobra R$ 5 fixos e R$ 4 por hora. Qual é o preço por 3 horas?', choices: ['R$ 12', 'R$ 17', 'R$ 20', 'R$ 27'], correctAnswer: 'R$ 17', solutionSteps: ['Preço = 5 + 4 × 3.', '4 × 3 = 12; 5 + 12 = 17.'], distractorFeedback: 'A taxa por hora é multiplicada pelo número de horas antes de somar a tarifa fixa.', prerequisiteIds: ['math.m01.t05']}),
      exercise('math.m01.t06', 4, {skillIds: ['multi-etapas', 'potenciacao-basica'], level: 'MEDIUM', kind: 'multi-step', statement: 'Calcule 2³ + 18 ÷ (3 + 3) × 4.', choices: ['14', '20', '32', '40'], correctAnswer: '20', solutionSteps: ['2³ = 8 e 3 + 3 = 6.', '18 ÷ 6 = 3; 3 × 4 = 12.', '8 + 12 = 20.'], distractorFeedback: 'Potência e parênteses devem ser resolvidos antes de divisão, multiplicação e soma.', prerequisiteIds: ['math.m01.t05']}),
    ],
  }),

  'math.m01.t07': lesson('math.m01.t07', {
    objective: 'Identificar múltiplos e divisores, testar divisões exatas e representar repartições em grupos iguais.',
    prerequisiteIds: ['math.m01.t01', 'math.m01.t05'],
    diagnostic: {question: '4 é divisor de 28?', answer: 'Sim, pois 28 ÷ 4 = 7.', explanation: 'A divisão é exata, sem resto.'},
    introduction: 'Organizar pessoas em equipes ou itens em caixas exige saber quais tamanhos de grupo dividem o total sem sobras. Múltiplos e divisores descrevem essa relação de forma geral.',
    concepts: [{title: 'Múltiplo', text: 'Um número m é múltiplo de n quando m = n × k para algum inteiro k. Os múltiplos positivos de 6 começam por 6, 12, 18, 24.'}, {title: 'Divisor e resto', text: 'Nesta aula, N é natural e os divisores são positivos: d divide N quando N ÷ d é inteiro. Em uma divisão com resto, N = d × q + r, com 0 ≤ r < d e d > 0. Zero é múltiplo de todo número não nulo; a divisão por zero não é definida. Um divisor próprio positivo de N é um divisor menor que N.'}, {title: 'Pares de fatores', text: 'Para listar divisores positivos de N, procure pares cujo produto seja N. Cada fator encontrado pode gerar uma repartição exata.'}],
    procedureSteps: [{step: 'Escreva a divisão ou produto que representa a relação.', why: 'Divisor e múltiplo são duas leituras da mesma igualdade N = d × q.'}, {step: 'Verifique se o resto é zero.', why: 'Divisão exata é o critério que caracteriza um divisor.'}, {step: 'Em um problema, interprete o quociente e a unidade.', why: 'O resultado precisa responder ao que está sendo agrupado ou repartido.'}],
    examples: [{id: 'math.m01.t07.ex01', title: 'Divisores de 36', kind: 'direct', statement: 'Liste os divisores positivos de 36.', solutionSteps: ['Pares: 1 × 36, 2 × 18, 3 × 12, 4 × 9 e 6 × 6.', 'Inclua os dois fatores de cada par.', 'Divisores: 1, 2, 3, 4, 6, 9, 12, 18 e 36.'], answer: '1, 2, 3, 4, 6, 9, 12, 18 e 36'}, {id: 'math.m01.t07.ex02', title: 'Equipes sem sobra', kind: 'context', statement: 'Uma escola tem 48 estudantes e quer formar equipes de 6. Quantas equipes completas consegue formar?', solutionSteps: ['A situação pede uma divisão: 48 ÷ 6.', 'Como 6 × 8 = 48, a divisão é exata.', 'Formam-se 8 equipes.'], answer: '8 equipes'}],
    mistakes: [{misconception: 'Dizer que 5 é divisor de 22 porque aparece perto de 22 na contagem.', correction: '22 ÷ 5 deixa resto 2; portanto 5 não é divisor de 22.'}, {misconception: 'Considerar zero um divisor.', correction: 'Divisão por zero não existe; zero pode ser múltiplo, mas não divisor.'}, {misconception: 'Listar apenas fatores menores que a raiz sem completar os pares.', correction: 'Se 3 é divisor de 36, 12 também é; liste o par completo.'}],
    summary: ['Múltiplos são resultados de uma multiplicação.', 'Divisor produz divisão exata.', 'A igualdade N = d × q conecta divisor, quociente e múltiplo.', 'Zero é múltiplo de todo número não nulo e nunca divisor.'],
    checks: [{question: '12 é múltiplo de 3?', answer: 'Sim, 12 = 3 × 4.'}, {question: '7 é divisor de 30?', answer: 'Não, pois sobra 2.'}, {question: 'Qual é um divisor de 1?', answer: 'Apenas 1.'}],
    connections: [{lessonId: 'math.m01.t08', reason: 'Critérios de divisibilidade aceleram testes de divisores.'}, {lessonId: 'math.m01.t10', reason: 'MDC e MMC usam as relações de múltiplos e divisores.'}],
    exercises: [
      exercise('math.m01.t07', 1, {skillIds: ['multiplos'], level: 'EASY', kind: 'concept', statement: 'Qual número é múltiplo de 8?', choices: ['14', '24', '30', '42'], correctAnswer: '24', solutionSteps: ['24 = 8 × 3.', 'Logo, 24 é múltiplo de 8.'], distractorFeedback: 'Procure uma multiplicação inteira por 8; os demais deixam resto.', prerequisiteIds: ['math.m01.t05']}),
      exercise('math.m01.t07', 2, {skillIds: ['divisores'], level: 'EASY', kind: 'direct', statement: 'Qual é o maior divisor próprio de 24?', choices: ['4', '8', '12', '24'], correctAnswer: '12', solutionSteps: ['Divisores de 24 incluem 1, 2, 3, 4, 6, 8, 12 e 24.', 'O divisor próprio exclui o próprio 24; o maior é 12.'], distractorFeedback: 'O próprio número é divisor, mas não é divisor próprio.', prerequisiteIds: ['math.m01.t05']}),
      exercise('math.m01.t07', 3, {skillIds: ['divisao-exata'], level: 'EASY', kind: 'context', statement: 'Uma fábrica embala 72 peças em caixas de 9. Quantas caixas completas são necessárias?', choices: ['6', '8', '9', '18'], correctAnswer: '8', solutionSteps: ['Calcule 72 ÷ 9.', 'Como 9 × 8 = 72, são 8 caixas.'], distractorFeedback: 'O número de caixas é o quociente, não o divisor nem o produto.', prerequisiteIds: ['math.m01.t05']}),
      exercise('math.m01.t07', 4, {skillIds: ['pares-de-fatores', 'interpretacao'], level: 'MEDIUM', kind: 'multi-step', statement: 'Um retângulo tem 30 quadradinhos em uma malha. Qual conjunto contém todas as quantidades possíveis de quadradinhos por linha, supondo linhas de mesmo tamanho?', choices: ['2, 3 e 5', '1, 2, 3, 5, 6, 10, 15 e 30', '1, 30 e 60', '4, 6 e 8'], correctAnswer: '1, 2, 3, 5, 6, 10, 15 e 30', solutionSteps: ['As quantidades por linha devem dividir 30.', 'Liste os divisores positivos de 30: 1, 2, 3, 5, 6, 10, 15 e 30.'], distractorFeedback: 'A lista precisa incluir também 1, o próprio número e os pares completos.', prerequisiteIds: ['math.m01.t05']}),
    ],
  }),

  'math.m01.t08': lesson('math.m01.t08', {
    objective: 'Aplicar critérios de divisibilidade por 2, 3, 4, 5, 6, 8, 9 e 10 sem efetuar a divisão completa.',
    prerequisiteIds: ['math.m01.t07'],
    diagnostic: {question: 'Por que 4 572 é divisível por 9?', answer: 'Porque 4 + 5 + 7 + 2 = 18, múltiplo de 9.', explanation: 'Para 9, a soma dos algarismos preserva o resto da divisão.'},
    introduction: 'Em uma conferência de caixas, pode ser mais rápido observar alguns algarismos do que realizar a divisão. Os critérios aproveitam a estrutura da escrita em base dez.',
    concepts: [{title: 'Critérios básicos', text: 'Por 2: último algarismo par. Por 5: termina em 0 ou 5. Por 10: termina em 0. Por 3 e 9: soma dos algarismos divisível por 3 ou 9.'}, {title: 'Últimas casas', text: 'Por 4: as duas últimas casas formam múltiplo de 4. Por 8: as três últimas casas formam múltiplo de 8. Por 6: o número é divisível por 2 e por 3.'}, {title: 'Resto e soma de algarismos', text: 'Como 10 deixa resto 1 na divisão por 3 ou por 9, cada potência de dez pode ser substituída por 1; por isso a soma dos algarismos conserva o teste.'}],
    procedureSteps: [{step: 'Escolha o critério correspondente ao divisor.', why: 'Cada divisor usa uma parte diferente da representação decimal.'}, {step: 'Observe a última casa, as últimas duas ou três casas, ou some os algarismos.', why: 'Essas observações permitem decidir o resto sem a divisão completa.'}, {step: 'Combine critérios quando necessário, como 2 e 3 para testar 6.', why: 'Ser múltiplo de 6 exige satisfazer simultaneamente os fatores 2 e 3.'}],
    examples: [{id: 'math.m01.t08.ex01', title: 'Teste por 8', kind: 'direct', statement: '6 184 é divisível por 8?', solutionSteps: ['Observe as três últimas casas: 184.', '184 ÷ 8 = 23, sem resto.', 'Logo, 6 184 é divisível por 8.'], answer: 'Sim'}, {id: 'math.m01.t08.ex02', title: 'Pacotes de materiais', kind: 'context', statement: 'Uma escola tem 1 350 folhas e quer formar pacotes de 10 folhas. É possível usar todas sem sobra?', solutionSteps: ['Para 10, observe o último algarismo.', '1 350 termina em 0.', 'Logo, a divisão por 10 é exata e são 135 pacotes.'], answer: 'Sim, 135 pacotes'}],
    mistakes: [{misconception: 'Usar apenas o último algarismo para testar 3 ou 9.', correction: 'Para 3 e 9, some todos os algarismos.'}, {misconception: 'Confundir o critério de 4 com o de 8.', correction: '4 usa as duas últimas casas; 8 usa as três últimas.'}, {misconception: 'Concluir divisibilidade por 6 olhando somente para 3.', correction: 'O número precisa ser divisível por 2 e por 3 ao mesmo tempo.'}],
    summary: ['Último algarismo testa 2, 5 e 10.', 'Soma dos algarismos testa 3 e 9.', 'Duas ou três últimas casas testam 4 e 8.', 'Divisibilidade por 6 combina os critérios de 2 e 3.'],
    checks: [{question: 'Um número terminado em 5 é divisível por 5?', answer: 'Sim.'}, {question: '1 248 é divisível por 4?', answer: 'Sim, pois 48 é múltiplo de 4.'}, {question: '36 é divisível por 6?', answer: 'Sim, é par e 3 + 6 = 9.'}],
    connections: [{lessonId: 'math.m01.t07', reason: 'Os critérios identificam divisores com rapidez.'}, {lessonId: 'math.m01.t09', reason: 'Testar divisibilidade por primos ajuda na fatoração.'}],
    exercises: [
      exercise('math.m01.t08', 1, {skillIds: ['criterio-2-5-10'], level: 'EASY', kind: 'concept', statement: 'Qual número é divisível por 10?', choices: ['235', '420', '1 234', '7 891'], correctAnswer: '420', solutionSteps: ['Um número divisível por 10 termina em 0.', '420 termina em 0.'], distractorFeedback: 'Observe a última casa; terminar em 5 basta para 5, não para 10.', prerequisiteIds: ['math.m01.t07']}),
      exercise('math.m01.t08', 2, {skillIds: ['criterio-3-9'], level: 'EASY', kind: 'direct', statement: 'Qual é divisível por 9?', choices: ['2 341', '3 456', '5 002', '7 111'], correctAnswer: '3 456', solutionSteps: ['Some os algarismos de 3 456: 3 + 4 + 5 + 6 = 18.', '18 é múltiplo de 9.'], distractorFeedback: 'A soma dos algarismos dos demais não é múltipla de 9.', prerequisiteIds: ['math.m01.t07']}),
      exercise('math.m01.t08', 3, {skillIds: ['criterio-4-8'], level: 'EASY', kind: 'direct', statement: 'Qual número é divisível por 8?', choices: ['1 214', '2 136', '3 122', '4 250'], correctAnswer: '2 136', solutionSteps: ['Observe 136, as três últimas casas.', '136 ÷ 8 = 17, então 2 136 é divisível por 8.'], distractorFeedback: 'Para 8, as três últimas casas precisam formar um múltiplo de 8.', prerequisiteIds: ['math.m01.t07']}),
      exercise('math.m01.t08', 4, {skillIds: ['criterio-6', 'interpretacao-contextual'], level: 'MEDIUM', kind: 'context', statement: 'Uma gráfica produziu 2 418 cartões e quer empacotá-los em grupos de 6. A divisão será exata?', choices: ['Não, porque termina em 8.', 'Sim, porque é par e 2 + 4 + 1 + 8 = 15.', 'Não, porque 15 não é múltiplo de 3.', 'Não, porque é ímpar.'], correctAnswer: 'Sim, porque é par e 2 + 4 + 1 + 8 = 15.', solutionSteps: ['Para 6, o número deve ser divisível por 2 e por 3.', '2 418 é par e 2 + 4 + 1 + 8 = 15, múltiplo de 3.', 'Logo, 2 418 é divisível por 6 e 2 418 ÷ 6 = 403.'], distractorFeedback: 'Verifique ambos os critérios; terminar em 8 demonstra apenas divisibilidade por 2, mas a soma 15 confirma também a divisibilidade por 3.', prerequisiteIds: ['math.m01.t07']}),
    ],
  }),

  'math.m01.t09': lesson('math.m01.t09', {
    objective: 'Reconhecer números primos e fatorar números naturais em produtos de fatores primos.',
    prerequisiteIds: ['math.m01.t07', 'math.m01.t08'],
    diagnostic: {question: 'O número 1 é primo?', answer: 'Não; ele tem apenas um divisor positivo.', explanation: 'Por definição, primo tem exatamente dois divisores positivos distintos: 1 e ele mesmo.'},
    introduction: 'Fatores primos funcionam como blocos básicos dos números naturais. Ao decompor um número em primos, tornamos visíveis seus divisores e preparamos cálculos de MDC, MMC e simplificação.',
    concepts: [{title: 'Primo e composto', text: 'Um número primo maior que 1 tem exatamente dois divisores positivos. Um composto tem mais de dois. O número 1 não é primo nem composto.'}, {title: 'Fatoração prima', text: 'Todo natural maior que 1 pode ser escrito como produto de primos, e essa escrita é única salvo a ordem dos fatores.'}, {title: 'Teste por pares de fatores', text: 'Para um número pequeno n, procure pares de fatores a × b = n começando pelos menores divisores. Se nenhum primo até 5 dividir 29, por exemplo, qualquer par com fator 6 ou maior teria o outro fator entre 1 e 4; esses pares não produzem 29. Assim, o teste pode ser explicado sem introduzir raiz quadrada.'}],
    procedureSteps: [{step: 'Divida pelo menor primo possível, repetindo enquanto a divisão for exata.', why: 'Cada divisão retira um fator primo do número restante.'}, {step: 'Continue com o quociente até chegar a 1.', why: 'O produto de todos os fatores encontrados reconstrói o número original.'}, {step: 'Agrupe fatores iguais usando expoentes.', why: 'A notação compacta mostra quantas vezes cada primo aparece.'}],
    examples: [{id: 'math.m01.t09.ex01', title: 'Fatoração de 84', kind: 'direct', statement: 'Fatore 84 em números primos.', solutionSteps: ['84 = 2 × 42 = 2² × 21.', '21 = 3 × 7.', 'Logo, 84 = 2² × 3 × 7.'], answer: '2² × 3 × 7'}, {id: 'math.m01.t09.ex02', title: 'Fileiras de azulejos', kind: 'context', statement: 'Uma placa retangular tem 90 azulejos iguais. A fatoração prima ajuda a identificar seus fatores. Qual é a fatoração de 90?', solutionSteps: ['90 = 2 × 45.', '45 = 3 × 15 = 3² × 5.', 'Logo, 90 = 2 × 3² × 5.'], answer: '2 × 3² × 5'}],
    mistakes: [{misconception: 'Considerar 1 como primo.', correction: '1 tem apenas um divisor positivo; primo precisa ter exatamente dois.'}, {misconception: 'Parar a fatoração em um fator composto.', correction: 'Continue até que todos os fatores restantes sejam primos.'}, {misconception: 'Esquecer expoente de fator repetido.', correction: 'Em 72 = 2³ × 3², as repetições ficam explícitas nos expoentes.'}],
    summary: ['Primos maiores que 1 têm exatamente dois divisores positivos.', 'A fatoração prima é única salvo a ordem.', 'Divisões sucessivas por primos produzem a fatoração.', 'O número 1 não é primo.'],
    checks: [{question: '29 é primo?', answer: 'Sim.'}, {question: 'Qual é a fatoração de 18?', answer: '2 × 3².'}, {question: 'O que significa 5² na fatoração?', answer: 'Dois fatores iguais a 5.'}],
    connections: [{lessonId: 'math.m01.t08', reason: 'Critérios de divisibilidade ajudam a escolher fatores primos.'}, {lessonId: 'math.m01.t10', reason: 'MDC e MMC podem ser calculados pelos expoentes das fatorações.'}],
    exercises: [
      exercise('math.m01.t09', 1, {skillIds: ['numeros-primos'], level: 'EASY', kind: 'concept', statement: 'Qual número é primo?', choices: ['1', '21', '29', '35'], correctAnswer: '29', solutionSteps: ['29 não é divisível por 2, 3 ou 5.', 'Se 29 tivesse um fator inteiro de 6 a 28, o outro fator positivo teria de estar entre 1 e 4; nenhum desses pares produz 29.', 'Logo, os únicos divisores positivos de 29 são 1 e 29, e 29 é primo.'], distractorFeedback: '1 não tem dois divisores; 21 e 35 têm fatoração além de 1 e deles mesmos.', prerequisiteIds: ['math.m01.t07', 'math.m01.t08']}),
      exercise('math.m01.t09', 2, {skillIds: ['fatoracao-prima'], level: 'EASY', kind: 'direct', statement: 'Qual é a fatoração prima de 60?', choices: ['2 × 3 × 10', '2² × 3 × 5', '3² × 5', '2 × 30'], correctAnswer: '2² × 3 × 5', solutionSteps: ['60 = 2 × 30 = 2² × 15.', '15 = 3 × 5.', 'Logo, 60 = 2² × 3 × 5.'], distractorFeedback: 'Toda parcela da fatoração final deve ser prima; 10 e 30 ainda são compostos.', prerequisiteIds: ['math.m01.t07', 'math.m01.t08']}),
      exercise('math.m01.t09', 3, {skillIds: ['divisores-por-fatoracao'], level: 'EASY', kind: 'interpretation', statement: 'A fatoração 2³ × 5 representa qual número?', choices: ['40', '80', '160', '320'], correctAnswer: '40', solutionSteps: ['2³ = 8.', '8 × 5 = 40.'], distractorFeedback: 'Calcule o expoente como multiplicação repetida: 2³ = 2 × 2 × 2.', prerequisiteIds: ['math.m01.t07']}),
      exercise('math.m01.t09', 4, {skillIds: ['fatoracao-contextual', 'estimativa'], level: 'MEDIUM', kind: 'context', statement: 'Um organizador tem 126 cartões e quer conhecer seus blocos primos para planejar arranjos. Qual é a fatoração de 126?', choices: ['2 × 3² × 7', '2² × 3 × 7', '3 × 42', '6 × 21'], correctAnswer: '2 × 3² × 7', solutionSteps: ['126 = 2 × 63.', '63 = 3 × 21 = 3² × 7.', 'Logo, 126 = 2 × 3² × 7.'], distractorFeedback: '3 × 42 e 6 × 21 são decomposições, mas ainda contêm fatores compostos.', prerequisiteIds: ['math.m01.t07', 'math.m01.t08']}),
    ],
  }),

  'math.m01.t10': lesson('math.m01.t10', {
    objective: 'Calcular MDC e MMC e escolher cada conceito para repartir quantidades ou sincronizar ciclos.',
    prerequisiteIds: ['math.m01.t07', 'math.m01.t09'],
    diagnostic: {question: 'Para descobrir quando dois alarmes voltam a tocar juntos, é mais adequado procurar um divisor comum ou um múltiplo comum?', answer: 'Um múltiplo comum, especialmente o MMC.', explanation: 'Os tempos avançam em múltiplos dos períodos; o primeiro encontro é o menor múltiplo comum.'},
    introduction: 'Duas situações parecem parecidas, mas pedem perguntas opostas: “qual é o maior tamanho que divide tudo sem sobra?” usa MDC; “quando os ciclos coincidem novamente?” usa MMC.',
    concepts: [{title: 'MDC', text: 'Nesta aula trabalhamos com números inteiros positivos. O máximo divisor comum é o maior divisor positivo comum aos números dados. Ele serve para formar grupos iguais tão grandes quanto possível.'}, {title: 'MMC', text: 'O mínimo múltiplo comum é o menor múltiplo positivo comum aos números. Ele serve para sincronizar períodos e encontrar denominadores comuns.'}, {title: 'Fatoração', text: 'Nas fatorações primas, o MDC usa apenas primos comuns com menores expoentes; o MMC usa todos os primos presentes com maiores expoentes.'}],
    procedureSteps: [{step: 'Identifique o sentido do problema: repartir ou sincronizar.', why: 'Essa leitura decide entre divisor comum e múltiplo comum.'}, {step: 'Fatore os números em primos.', why: 'A fatoração revela quais blocos são compartilhados e suas repetições.'}, {step: 'Para MDC, escolha menores expoentes comuns; para MMC, maiores expoentes de todos os fatores.', why: 'Essas escolhas produzem, respectivamente, o maior divisor e o menor múltiplo.'}],
    examples: [{id: 'math.m01.t10.ex01', title: 'MDC e MMC por fatoração', kind: 'direct', statement: 'Calcule MDC(18, 24) e MMC(18, 24).', solutionSteps: ['18 = 2 × 3² e 24 = 2³ × 3.', 'MDC = 2¹ × 3¹ = 6.', 'MMC = 2³ × 3² = 72.'], answer: 'MDC = 6 e MMC = 72'}, {id: 'math.m01.t10.ex02', title: 'Dois ciclos de luz', kind: 'context', statement: 'Duas luzes piscam a cada 12 s e 18 s. Se piscam juntas agora, em quantos segundos voltarão a coincidir?', solutionSteps: ['O encontro ocorre em um múltiplo comum dos períodos.', '12 = 2² × 3 e 18 = 2 × 3²; MMC = 2² × 3² = 36.', 'Elas voltarão a coincidir em 36 s.'], answer: '36 s'}],
    mistakes: [{misconception: 'Usar MDC para sincronizar eventos.', correction: 'Sincronização procura um múltiplo comum; use MMC.'}, {misconception: 'Usar maiores expoentes no MDC.', correction: 'No MDC ficam os menores expoentes dos primos comuns.'}, {misconception: 'Aceitar zero como MMC positivo.', correction: 'MMC é o menor múltiplo comum positivo; em problemas usuais, não é zero.'}],
    summary: ['MDC responde a repartições sem sobra.', 'MMC responde a encontros de ciclos.', 'MDC usa fatores comuns com menores expoentes.', 'MMC usa todos os fatores com maiores expoentes.'],
    checks: [{question: 'Qual ferramenta divide 36 e 48 em grupos iguais máximos?', answer: 'MDC(36,48).'}, {question: 'Qual ferramenta encontra o primeiro encontro de ciclos?', answer: 'MMC.'}, {question: 'Qual é o MDC de 12 e 18?', answer: '6.'}],
    connections: [{lessonId: 'math.m01.t03', reason: 'MMC ajuda a encontrar denominadores comuns em frações.'}, {lessonId: 'math.m01.t09', reason: 'A fatoração prima fornece o método sistemático de MDC e MMC.'}],
    exercises: [
      exercise('math.m01.t10', 1, {skillIds: ['identificacao-mdc-mmc'], level: 'EASY', kind: 'concept', statement: 'Uma equipe quer cortar fitas de 24 cm e 36 cm em pedaços iguais, o maior possível, sem sobras. Deve calcular:', choices: ['MMC(24,36)', 'MDC(24,36)', '24 + 36', '24 × 36'], correctAnswer: 'MDC(24,36)', solutionSteps: ['O tamanho do pedaço deve dividir os dois comprimentos.', 'O maior divisor comum atende ao “maior possível”.'], distractorFeedback: 'MMC é usado para sincronizar ou encontrar um múltiplo comum, não para cortar em partes máximas.', prerequisiteIds: ['math.m01.t07', 'math.m01.t09']}),
      exercise('math.m01.t10', 2, {skillIds: ['calculo-mdc'], level: 'EASY', kind: 'direct', statement: 'Calcule MDC(28, 42).', choices: ['7', '14', '21', '84'], correctAnswer: '14', solutionSteps: ['28 = 2² × 7 e 42 = 2 × 3 × 7.', 'MDC = 2 × 7 = 14.'], distractorFeedback: 'Use apenas fatores comuns e os menores expoentes; 21 não divide 28.', prerequisiteIds: ['math.m01.t09']}),
      exercise('math.m01.t10', 3, {skillIds: ['calculo-mmc'], level: 'EASY', kind: 'direct', statement: 'Calcule MMC(8, 12).', choices: ['12', '20', '24', '96'], correctAnswer: '24', solutionSteps: ['8 = 2³ e 12 = 2² × 3.', 'MMC = 2³ × 3 = 24.'], distractorFeedback: 'O MMC precisa ser múltiplo de 8 e de 12; 12 não é múltiplo de 8.', prerequisiteIds: ['math.m01.t09']}),
      exercise('math.m01.t10', 4, {skillIds: ['problema-ciclos', 'interpretacao-contextual'], level: 'MEDIUM', kind: 'context', statement: 'Um ônibus passa a cada 15 minutos e outro a cada 20 minutos. Se passaram juntos às 8h, quando voltarão a passar juntos?', choices: ['8h15', '8h20', '8h35', '9h00'], correctAnswer: '9h00', solutionSteps: ['Calcule MMC(15,20): 15 = 3 × 5 e 20 = 2² × 5.', 'MMC = 2² × 3 × 5 = 60 minutos.', '8h + 60 min = 9h.'], distractorFeedback: 'O encontro usa MMC; some o intervalo de 60 minutos ao horário inicial.', prerequisiteIds: ['math.m01.t07', 'math.m01.t09']}),
    ],
  }),
};

export default MODULE01_LESSONS;
