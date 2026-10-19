// Feedback editorial por alternativa incorreta. Cada entrada foi escrita para
// avaliar a alternativa concreta; não presume a causa da resposta do aluno.
// O lote continua pending_human e este arquivo não representa validação humana.
// Registro de falso negativo da leitura independente anterior: ela conferiu
// cálculos e unicidade textual, mas não detectou alternativas equivalentes
// (t03 Q3 e t04 Q1) nem feedback genérico por alternativa. Esta segunda leitura
// exige avaliação numérica de cada escolha e uma explicação específica por mapa.
export const MODULE01_FEEDBACK = {
  'equacao:math.m01.t01:v2:01': {
    '3': '3 é apenas o algarismo; na casa das centenas, seu valor posicional é 3 × 100 = 300.',
    '30': '30 corresponde a 3 dezenas. O algarismo 3 está nas centenas de 8 305, portanto vale 300.',
    '3 000': '3 000 corresponde a 3 unidades de milhar. Em 8 305, o 3 ocupa a casa das centenas e vale 300.',
  },
  'equacao:math.m01.t01:v2:02': {
    '756': '756 = 700 + 50 + 6; essa decomposição não contém as 7 unidades de milhar pedidas.',
    '7 056': '7 056 = 7 000 + 50 + 6; o termo das centenas deveria ser 500, e não 50.',
    '7 560': '7 560 = 7 000 + 500 + 60; o 6 foi colocado nas dezenas, mas deve representar 6 unidades.',
  },
  'equacao:math.m01.t01:v2:03': {
    '2 009, 1 999, 2 090, 2 900': '1 999 é menor que 2 009 porque tem 1 unidade de milhar, então deve aparecer antes.',
    '1 999, 2 090, 2 009, 2 900': '2 009 é menor que 2 090: depois dos milhares e centenas iguais, 0 dezenas vem antes de 9 dezenas.',
    '2 900, 2 090, 2 009, 1 999': 'Esta sequência está decrescente; a questão pede ordem crescente, do menor para o maior.',
  },
  'equacao:math.m01.t01:v2:04': {
    '7': '7 é o algarismo, mas o 7 está nas centenas de 40 702; seu valor é 700.',
    '70': '70 corresponde à casa das dezenas. O 7 aparece na casa das centenas e representa 700.',
    '7 000': '7 000 corresponderia a 7 unidades de milhar; em 40 702, o 7 está nas centenas.',
  },
  'equacao:math.m01.t02:v2:01': {
    '−6 > −2': 'Na reta numérica, −6 fica à esquerda de −2; portanto −6 < −2.',
    '0 < −1': 'Zero fica à direita de −1; logo 0 > −1, e não 0 < −1.',
    '−4 = 4': '−4 e 4 têm sinais opostos e posições diferentes na reta; não são iguais.',
  },
  'equacao:math.m01.t02:v2:02': {
    '−29': '−18 + 7 − 4 = −11 − 4 = −15; −29 resulta de tratar o 7 como uma parcela negativa.',
    '−7': 'Após −18 + 7 = −11, ainda é preciso subtrair 4, chegando a −15, não −7.',
    '15': 'O valor absoluto é 15, mas a soma termina no lado negativo da reta: −18 + 7 − 4 = −15.',
  },
  'equacao:math.m01.t02:v2:03': {
    '−7': 'Descer 5 andares a partir de −2 seria −7; o enunciado diz subir 5, então calculamos −2 + 5 = 3.',
    '−3': '−3 fica um andar abaixo de −2; subir cinco andares leva de −2 a 3.',
    '7': 'O ponto inicial é −2, não 2; somar 5 a −2 produz 3, e não 7.',
  },
  'equacao:math.m01.t02:v2:04': {
    '−R$ 97': 'O crédito de R$ 50 soma ao saldo: −35 + 50 = 15; não se deve subtrair o crédito.',
    '−R$ 47': 'Esse valor corresponde a −35 − 12 e ignora o crédito de R$ 50 recebido antes da taxa.',
    'R$ 27': 'Depois do crédito, o saldo é R$ 15; descontando R$ 12, sobra R$ 3, não R$ 27.',
  },
  'equacao:math.m01.t03:v2:01': {
    '3/10': 'Para manter 3/5 equivalente, numerador e denominador devem ser multiplicados pelo mesmo fator; 3/10 altera só o denominador.',
    '5/3': '5/3 é a fração invertida de 3/5 e tem valor diferente; equivalência não troca numerador e denominador.',
    '8/10': '8/10 não resulta de multiplicar os dois termos de 3/5 pelo mesmo número; o par equivalente esperado é 6/10.',
  },
  'equacao:math.m01.t03:v2:02': {
    '3/9': 'Somar numeradores e denominadores separadamente não é a regra: 2/3 = 4/6 e 4/6 + 1/6 = 5/6.',
    '1/2': '1/2 = 3/6, mas 2/3 + 1/6 = 4/6 + 1/6 = 5/6; a soma não pode perder uma parte.',
    '3/4': 'O denominador comum é 6, não 4: convertendo 2/3 para 4/6, o resultado é 5/6.',
  },
  'equacao:math.m01.t03:v2:03': {
    '1/3': 'Ao multiplicar 3/5 por 10/9, o numerador também deve receber o fator 10; 3/5 × 10/9 = 30/45 = 2/3.',
    '13/14': '13/14 vem de somar numeradores e denominadores; em multiplicação de frações, multiplicamos numerador por numerador e denominador por denominador.',
    '45/30': '30/45 é o produto intermediário correto; 45/30 inverte essa fração e não é a forma irredutível do resultado.',
  },
  'equacao:math.m01.t03:v2:04': {
    '8': '24 ÷ 3 = 8 representa apenas um terço; para dois terços, é preciso calcular 2 × 8 = 16.',
    '12': '12 é metade de 24; dois terços de 24 são 2 × (24 ÷ 3) = 16.',
    '18': '18 corresponde a três quartos de 24, não a dois terços; dividir 24 por 3 e multiplicar por 2 dá 16.',
  },
  'equacao:math.m01.t04:v2:01': {
    '4,7': '4,7 representa 4 unidades e 7 décimos; sete centésimos ocupam a segunda casa decimal: 4,07.',
    '4,007': '4,007 tem 7 milésimos; o enunciado pede 7 centésimos, então o número é 4,07.',
    '0,47': '0,47 representa 47 centésimos e não contém as 4 unidades inteiras do enunciado.',
  },
  'equacao:math.m01.t04:v2:02': {
    '8,22': 'Alinhando as vírgulas, 12,50 − 3,78 = 8,72; 8,22 não corresponde à subtração das duas casas decimais.',
    '9,28': '9,28 não é a diferença de 12,50 e 3,78; a subtração com empréstimo nos centésimos resulta em 8,72.',
    '16,28': '16,28 é maior que 12,50, portanto não pode ser o resultado de subtrair 3,78.',
  },
  'equacao:math.m01.t04:v2:03': {
    '0,0375': '3/8 = 375/1 000 = 0,375; 0,0375 desloca a vírgula uma casa a mais e representa valor dez vezes menor.',
    '3,8': 'A fração 3/8 não significa escrever 3,8; a divisão 3 ÷ 8 produz 0,375.',
    '0,83': '0,83 troca a ordem dos algarismos e vale 83/100; 3/8 vale 375/1 000.',
  },
  'equacao:math.m01.t04:v2:04': {
    '10 L': 'Em 8 minutos, a vazão de 2,5 L por minuto produz 2,5 × 8 = 20 L, não 10 L.',
    '16 L': '16 L seria 2 L por minuto durante 8 minutos; com 2,5 L por minuto, o total é 20 L.',
    '25 L': '25 L não resulta de 2,5 × 8; multiplicar por 8 desloca o cálculo para 20 L.',
  },
  'equacao:math.m01.t05:v2:01': {
    '5 + 9': 'A expressão representa juntar 5 e 9, mas grupos iguais são modelados por 5 × 9.',
    '9 − 5': 'Subtração não representa cinco grupos de nove elementos; a quantidade total é 5 × 9.',
    '9 ÷ 5': 'Divisão de 9 por 5 não conta cinco grupos iguais de nove; o registro pedido é 5 × 9.',
  },
  'equacao:math.m01.t05:v2:02': {
    '98': '98 × 8 = 784, que não reconstrói 864; a divisão exata é 864 ÷ 8 = 108.',
    '112': '112 × 8 = 896, acima de 864; o quociente 108 verifica porque 108 × 8 = 864.',
    '128': '128 × 8 = 1 024, portanto não pode ser o quociente de 864 por 8.',
  },
  'equacao:math.m01.t05:v2:03': {
    '253': '253 = 428 − 175; como a biblioteca recebeu livros, a operação correta é adição: 428 + 175 = 603.',
    '503': '503 não é o total de 428 + 175; somando centenas, dezenas e unidades, obtemos 603.',
    '703': '703 excede 428 + 175 = 603; a adição não cria 100 livros extras.',
  },
  'equacao:math.m01.t05:v2:04': {
    '26': 'Primeiro 4 × 18 = 72, depois 72 − 10 = 62 e 62 ÷ 2 = 31; 26 não segue essas três etapas.',
    '36': '36 = 72 ÷ 2 e ignora o descarte de 10 maçãs; após o descarte, devem ser repartidas 62.',
    '41': 'O total disponível para as bancas é 62, e 62 ÷ 2 = 31; 41 não é uma divisão da quantidade restante.',
  },
  'equacao:math.m01.t06:v2:01': {
    '36': 'Resolver 7 + 2 antes de multiplicar dá 36, mas a multiplicação tem prioridade: 7 + (2 × 4) = 15.',
    '16': '2 × 4 = 8 e 7 + 8 = 15; 16 não resulta das operações da expressão.',
    '9': '7 + 2 = 9 ignora o fator 4; é preciso calcular 2 × 4 antes da adição.',
  },
  'equacao:math.m01.t06:v2:02': {
    '5': 'O parêntese dá 2 + 3 = 5, mas ainda falta calcular 4 × 5 e então 30 − 20 = 10.',
    '14': 'Depois de 4 × (2 + 3) = 20, a expressão fica 30 − 20 = 10, não 14.',
    '130': 'A subtração não vira uma soma: 30 − [4 × 5] = 30 − 20 = 10.',
  },
  'equacao:math.m01.t06:v2:03': {
    'R$ 12': 'R$ 12 é apenas 4 × 3; é preciso acrescentar a tarifa fixa de R$ 5, totalizando R$ 17.',
    'R$ 20': 'R$ 20 não é a soma da tarifa fixa de R$ 5 com 3 × R$ 4 = R$ 12; o valor total é R$ 17.',
    'R$ 27': 'R$ 27 é o resultado de (5 + 4) × 3, que cobra a tarifa fixa três vezes. Ela é cobrada só uma vez: 5 + 12 = 17.',
  },
  'equacao:math.m01.t06:v2:04': {
    '14': 'Após os parênteses, 18 ÷ 6 × 4 = 3 × 4 = 12; somando 2³ = 8, o resultado é 20.',
    '32': 'A sequência correta é 2³ + (18 ÷ 6 × 4) = 8 + 12 = 20; 32 não corresponde a ela.',
    '40': '2³ vale 8, não 20; com a segunda parcela igual a 12, a soma total é 20.',
  },
  'equacao:math.m01.t07:v2:01': {
    '14': '14 ÷ 8 deixa resto 6, portanto 14 não é múltiplo de 8.',
    '30': '30 ÷ 8 deixa resto 6; um múltiplo de 8 precisa resultar de uma multiplicação inteira por 8.',
    '42': '42 ÷ 8 deixa resto 2; 24 = 8 × 3 é a alternativa divisível por 8.',
  },
  'equacao:math.m01.t07:v2:02': {
    '4': '4 é divisor próprio de 24, mas 12 também divide 24 e é maior.',
    '8': '8 é divisor próprio de 24, porém 12 é maior e ainda divide 24.',
    '24': '24 divide a si mesmo, mas divisor próprio exclui o próprio número; o maior próprio é 12.',
  },
  'equacao:math.m01.t07:v2:03': {
    '6': '6 × 9 = 54, não 72; o quociente de 72 ÷ 9 é 8.',
    '9': '9 é o tamanho de cada caixa, isto é, o divisor; o número de caixas é 72 ÷ 9 = 8.',
    '18': '18 × 9 = 162, acima de 72; 9 × 8 = 72, portanto são 8 caixas.',
  },
  'equacao:math.m01.t07:v2:04': {
    '2, 3 e 5': 'São alguns divisores de 30, mas a lista completa também inclui 1, 6, 10, 15 e 30.',
    '1, 30 e 60': '60 não divide 30; a lista correta contém apenas divisores positivos de 30 e inclui 2, 3, 5, 6, 10 e 15.',
    '4, 6 e 8': '4 e 8 não dividem 30 exatamente; além disso, a alternativa não lista todos os divisores.',
  },
  'equacao:math.m01.t08:v2:01': {
    '235': '235 termina em 5; terminar em 0 é o critério usado para divisibilidade por 10.',
    '1 234': '1 234 termina em 4, não em 0; portanto não é divisível por 10.',
    '7 891': '7 891 termina em 1, então não pode ser divisível por 10.',
  },
  'equacao:math.m01.t08:v2:02': {
    '2 341': '2 + 3 + 4 + 1 = 10, que não é múltiplo de 9.',
    '5 002': '5 + 0 + 0 + 2 = 7, que não é múltiplo de 9.',
    '7 111': '7 + 1 + 1 + 1 = 10, que não é múltiplo de 9.',
  },
  'equacao:math.m01.t08:v2:03': {
    '1 214': 'As três últimas casas são 214; 214 ÷ 8 deixa resto 6, então o número não é divisível por 8.',
    '3 122': 'As três últimas casas são 122; 122 ÷ 8 deixa resto 2.',
    '4 250': 'As três últimas casas são 250; 250 ÷ 8 deixa resto 2.',
  },
  'equacao:math.m01.t08:v2:04': {
    'Não, porque termina em 8.': 'Terminar em 8 confirma divisibilidade por 2, não impede a divisão por 6; a soma 15 confirma divisibilidade por 3.',
    'Não, porque 15 não é múltiplo de 3.': '15 = 3 × 5 é múltiplo de 3; como 2 418 também é par, ele é divisível por 6.',
    'Não, porque é ímpar.': '2 418 é par porque termina em 8; a justificativa de que é ímpar está incorreta.',
  },
  'equacao:math.m01.t09:v2:01': {
    '1': '1 tem apenas um divisor positivo, ele mesmo; número primo tem exatamente dois divisores positivos.',
    '21': '21 = 3 × 7, portanto tem divisores além de 1 e dele mesmo.',
    '35': '35 = 5 × 7, portanto é composto e não primo.',
  },
  'equacao:math.m01.t09:v2:02': {
    '2 × 3 × 10': '10 é composto; a fatoração prima deve continuar 10 = 2 × 5, resultando em 2² × 3 × 5.',
    '3² × 5': '3² × 5 = 45, não 60; a fatoração de 60 precisa incluir 2².',
    '2 × 30': '30 é composto; decompondo 30 = 2 × 3 × 5, obtemos 2² × 3 × 5.',
  },
  'equacao:math.m01.t09:v2:03': {
    '80': '2³ × 5 = 8 × 5 = 40; 80 teria quatro fatores 2, isto é, 2⁴ × 5.',
    '160': '2³ × 5 = 40; 160 = 2⁵ × 5, com expoente diferente.',
    '320': '320 = 2⁶ × 5; a potência indicada é 2³, então o valor é 8 × 5 = 40.',
  },
  'equacao:math.m01.t09:v2:04': {
    '2² × 3 × 7': '2² × 3 × 7 = 84, não 126; 126 contém 2 × 3² × 7.',
    '3 × 42': '3 × 42 é uma decomposição, mas 42 é composto; a fatoração deve continuar até 2 × 3² × 7.',
    '6 × 21': '6 e 21 são compostos; decompondo ambos, 126 = 2 × 3² × 7.',
  },
  'equacao:math.m01.t10:v2:01': {
    'MMC(24,36)': 'Para cortar no maior tamanho sem sobras, buscamos um divisor comum máximo; isso é MDC, não MMC.',
    '24 + 36': 'Somar os comprimentos não produz um tamanho que divida os dois; a condição pede o MDC(24,36).',
    '24 × 36': 'O produto é um múltiplo, não o maior divisor comum; o corte deve usar MDC(24,36).',
  },
  'equacao:math.m01.t10:v2:02': {
    '7': '7 é divisor comum de 28 e 42, mas 14 também é comum e é maior.',
    '21': '21 não divide 28 sem resto; portanto não é divisor comum dos dois números.',
    '84': '84 é múltiplo de 28 e 42, não divisor deles; o MDC é 14.',
  },
  'equacao:math.m01.t10:v2:03': {
    '12': '12 é múltiplo de 12, mas não de 8; por isso não pode ser MMC(8,12).',
    '20': '20 não é divisível por 12; logo não é múltiplo comum de 8 e 12.',
    '96': '96 é múltiplo comum, mas 24 já é múltiplo de 8 e de 12 e é menor.',
  },
  'equacao:math.m01.t10:v2:04': {
    '8h15': '15 minutos depois do início, apenas o primeiro ônibus coincide; o segundo encontro exige 60 minutos.',
    '8h20': '20 minutos é o intervalo do segundo ônibus, mas não é múltiplo de 15; os ciclos não coincidem nesse horário.',
    '8h35': '35 não é múltiplo comum de 15 e 20; o primeiro múltiplo comum é 60 minutos, às 9h00.',
  },
};

export default MODULE01_FEEDBACK;
