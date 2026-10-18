// Guias autorais de fundamentos por ID estável; sem geração baseada em títulos.
export const FOUNDATION_GUIDES = {
  "math.m01.t01": {
    "summary": "O sistema decimal agrupa unidades em dezenas, centenas e milhares. O valor de um algarismo depende da posição que ele ocupa.",
    "steps": [
      "Separe o número em ordens da direita para a esquerda.",
      "Compare as ordens da esquerda e reagrupe dez unidades em uma dezena quando necessário."
    ],
    "pitfall": "O zero preserva uma posição; em 4 005, os dois zeros não podem ser descartados.",
    "example": {
      "question": "Qual é o valor do algarismo 7 em 27 304?",
      "steps": [
        "O 7 está na casa dos milhares.",
        "7×1 000=7 000."
      ],
      "answer": "7 000"
    }
  },
  "math.m01.t02": {
    "summary": "Inteiros incluem positivos, negativos e zero e podem ser ordenados na reta numérica. O módulo mede a distância até zero, enquanto o sinal indica o lado.",
    "steps": [
      "Marque os números na reta para comparar posições.",
      "Some e subtraia avançando ou recuando; em produtos, sinais iguais dão positivo e diferentes dão negativo."
    ],
    "pitfall": "−8 é menor que −3, apesar de 8 ser maior que 3.",
    "example": {
      "question": "Calcule −7+12−4.",
      "steps": [
        "−7+12=5.",
        "5−4=1."
      ],
      "answer": "1"
    }
  },
  "math.m01.t03": {
    "summary": "Frações representam partes iguais de um todo; o denominador diz quantas partes existem e o numerador quantas foram tomadas. Frações impróprias podem ser escritas como número misto.",
    "steps": [
      "Reduza ao mesmo denominador para somar ou subtrair.",
      "Simplifique dividindo numerador e denominador pelo mesmo fator."
    ],
    "pitfall": "Não some denominadores: 1/3+1/3=2/3.",
    "example": {
      "question": "Calcule 3/4+1/8.",
      "steps": [
        "Converta 3/4 para 6/8.",
        "6/8+1/8=7/8."
      ],
      "answer": "7/8"
    }
  },
  "math.m01.t04": {
    "summary": "A escrita decimal usa décimos, centésimos e outras potências de dez depois da vírgula. Converter é trocar a representação sem mudar o valor.",
    "steps": [
      "Para virar fração, use 10, 100 ou 1 000 conforme o número de casas.",
      "Para virar percentual, multiplique por 100 e escreva o símbolo %."
    ],
    "pitfall": "Ao alinhar decimais, as vírgulas ficam na mesma coluna.",
    "example": {
      "question": "Converta 0,375 em fração simplificada.",
      "steps": [
        "0,375=375/1000.",
        "Divida por 125: 375/1000=3/8."
      ],
      "answer": "3/8"
    }
  },
  "math.m01.t05": {
    "summary": "Adição junta quantidades, subtração compara, multiplicação repete grupos e divisão reparte. A operação deve ser escolhida pelo sentido do enunciado.",
    "steps": [
      "Estime o resultado antes da conta.",
      "Calcule alinhando ordens e confira pela operação inversa."
    ],
    "pitfall": "Para quantidades positivas, dividir por um número maior que 1 reduz o valor. Com números negativos, interprete também o sinal.",
    "example": {
      "question": "Uma caixa tem 6 fileiras de 8 itens e 5 itens são retirados. Quantos ficam?",
      "steps": [
        "6×8=48 itens.",
        "48−5=43 itens."
      ],
      "answer": "43"
    }
  },
  "math.m01.t06": {
    "summary": "Parênteses e prioridades tornam uma expressão inequívoca. A ordem é parênteses, potências, multiplicações/divisões e adições/subtrações.",
    "steps": [
      "Resolva agrupamentos internos.",
      "Faça operações de mesma prioridade da esquerda para a direita."
    ],
    "pitfall": "2+3×4 é 14, não 20, porque a multiplicação vem antes da adição.",
    "example": {
      "question": "Calcule 18−[2×(3+4)].",
      "steps": [
        "3+4=7.",
        "2×7=14 e 18−14=4."
      ],
      "answer": "4"
    }
  },
  "math.m01.t07": {
    "summary": "Múltiplo é obtido multiplicando um número por um inteiro; divisor produz divisão exata. Essas relações organizam padrões e repartições.",
    "steps": [
      "Liste múltiplos para procurar coincidências.",
      "Teste divisores em pares cujo produto seja o número."
    ],
    "pitfall": "Zero é múltiplo de todo número, mas não pode ser divisor.",
    "example": {
      "question": "Quais são os divisores positivos de 18?",
      "steps": [
        "Pares de fatores: 1×18, 2×9 e 3×6.",
        "Reúna os fatores sem repetir."
      ],
      "answer": "1, 2, 3, 6, 9 e 18"
    }
  },
  "math.m01.t08": {
    "summary": "Critérios de divisibilidade permitem decidir sobre o resto observando poucos algarismos. Cada critério corresponde a uma estrutura de base dez.",
    "steps": [
      "Use o último algarismo para 2, 5 e 10.",
      "Some algarismos para testar 3 e 9; observe as últimas casas para 4 e 8."
    ],
    "pitfall": "Para 3 e 9, o último algarismo sozinho não basta.",
    "example": {
      "question": "4 572 é divisível por 9?",
      "steps": [
        "Some 4+5+7+2=18.",
        "18 é divisível por 9."
      ],
      "answer": "Sim"
    }
  },
  "math.m01.t09": {
    "summary": "Primos têm exatamente dois divisores positivos e formam os blocos da fatoração. A fatoração prima facilita MDC, MMC e simplificação.",
    "steps": [
      "Teste primos até a raiz quadrada do número restante.",
      "Divida repetidamente e registre os fatores encontrados."
    ],
    "pitfall": "O número 1 não é primo, pois tem apenas um divisor positivo.",
    "example": {
      "question": "Fatore 84 em primos.",
      "steps": [
        "84=2×42=2²×21.",
        "21=3×7."
      ],
      "answer": "2²×3×7"
    }
  },
  "math.m01.t10": {
    "summary": "O MDC é o maior divisor comum e serve para repartir sem sobra. O MMC é o menor múltiplo comum e serve para sincronizar ciclos.",
    "steps": [
      "Fatore os números.",
      "No MDC, use apenas primos comuns com seus menores expoentes; no MMC, use todos os primos com seus maiores expoentes."
    ],
    "pitfall": "MDC e MMC usam as mesmas fatorações, mas escolhas de expoentes opostas.",
    "example": {
      "question": "Calcule MDC(18,24) e MMC(18,24).",
      "steps": [
        "18=2×3² e 24=2³×3.",
        "MDC=2×3=6; MMC=2³×3²=72."
      ],
      "answer": "MDC=6 e MMC=72"
    }
  },
  "math.m02.t01": {
    "summary": "Razão compara duas grandezas por uma divisão, e taxa acrescenta a unidade dessa comparação. A ordem dos termos define o significado.",
    "steps": [
      "Escreva numerador e denominador na ordem pedida.",
      "Converta unidades e interprete como “por cada” unidade."
    ],
    "pitfall": "km/h e h/km são razões inversas, não duas formas da mesma taxa.",
    "example": {
      "question": "Um ciclista percorre 45 km em 3 h. Qual sua velocidade média?",
      "steps": [
        "45÷3=15.",
        "A unidade é km por hora."
      ],
      "answer": "15 km/h"
    }
  },
  "math.m02.t02": {
    "summary": "Grandezas diretamente proporcionais mantêm y/x constante; inversamente proporcionais mantêm x·y constante. A direção da variação identifica o modelo.",
    "steps": [
      "Monte uma tabela e compare razões ou produtos.",
      "Use a constante encontrada para calcular o valor desconhecido."
    ],
    "pitfall": "Se uma grandeza dobra e a outra também dobra, a relação é direta, não inversa.",
    "example": {
      "question": "Se 4 kg custam R$28, quanto custam 7 kg?",
      "steps": [
        "Preço por kg=28÷4=7.",
        "7×7=49."
      ],
      "answer": "R$49"
    }
  },
  "math.m02.t03": {
    "summary": "A regra de três simples encontra um valor quando duas grandezas variam proporcionalmente. Ela exige decidir se a relação é direta ou inversa.",
    "steps": [
      "Alinhe grandezas correspondentes em duas razões.",
      "Resolva o produto cruzado e confira a unidade."
    ],
    "pitfall": "Não monte proporção antes de verificar que a situação é proporcional.",
    "example": {
      "question": "5 cadernos custam R$40. Quanto custam 8?",
      "steps": [
        "40/5=x/8.",
        "5x=320, então x=64."
      ],
      "answer": "R$64"
    }
  },
  "math.m02.t04": {
    "summary": "A regra de três composta combina várias grandezas em etapas, respeitando se cada uma aumenta ou diminui a produção. O trabalho total deve permanecer coerente.",
    "steps": [
      "Compare cada grandeza com a situação inicial.",
      "Multiplique fatores diretos e inverta os fatores inversos."
    ],
    "pitfall": "Mais trabalhadores reduzem tempo apenas se o trabalho e a produtividade por pessoa forem os mesmos.",
    "example": {
      "question": "4 pessoas fazem um serviço em 6 dias. Com 8 pessoas, quantos dias?",
      "steps": [
        "Pessoas e dias são inversamente proporcionais.",
        "8d=4×6, logo d=3."
      ],
      "answer": "3 dias"
    }
  },
  "math.m02.t05": {
    "summary": "Dividir em partes proporcionais distribui um total conforme pesos definidos. Cada parte é o total multiplicado pelo seu peso dividido pela soma dos pesos.",
    "steps": [
      "Some os pesos das partes.",
      "Multiplique o total por cada peso e divida pela soma."
    ],
    "pitfall": "Dividir igualmente ignora os pesos informados.",
    "example": {
      "question": "Divida 120 na razão 2:3.",
      "steps": [
        "Soma dos pesos=5.",
        "Partes: 120×2/5=48 e 120×3/5=72."
      ],
      "answer": "48 e 72"
    }
  },
  "math.m02.t06": {
    "summary": "Escala é uma razão entre medida representada e medida real. O fator deve ser aplicado depois de converter as unidades.",
    "steps": [
      "Escreva desenho/realidade na escala dada.",
      "Multiplique pela escala para obter a medida real e converta a unidade."
    ],
    "pitfall": "Em 1:50 000, 1 cm representa 50 000 cm, não 50 000 m.",
    "example": {
      "question": "Em escala 1:50 000, 4 cm no mapa representam quanto?",
      "steps": [
        "4×50 000=200 000 cm.",
        "200 000 cm=2 km."
      ],
      "answer": "2 km"
    }
  },
  "math.m02.t07": {
    "summary": "Velocidade média é distância total dividida pelo tempo total, e não a média simples das velocidades parciais. O tempo deve estar em unidade compatível.",
    "steps": [
      "Some todas as distâncias e todos os tempos.",
      "Divida distância total por tempo total e escreva a unidade."
    ],
    "pitfall": "Em trechos com tempos diferentes, não faça média aritmética das velocidades.",
    "example": {
      "question": "Um carro percorre 60 km em 1 h e 40 km em 2 h. Velocidade média?",
      "steps": [
        "Distância total=100 km; tempo total=3 h.",
        "100÷3≈33,3."
      ],
      "answer": "33,3 km/h"
    }
  },
  "math.m02.t08": {
    "summary": "Densidade é massa/volume; vazão é volume/tempo. Ambas são taxas e precisam de unidades compatíveis.",
    "steps": [
      "Identifique a grandeza que está no numerador.",
      "Converta unidades antes de dividir ou multiplicar."
    ],
    "pitfall": "Densidade alta não significa necessariamente mais massa: depende também do volume.",
    "example": {
      "question": "Uma massa de 600 g ocupa 200 cm³. Qual a densidade?",
      "steps": [
        "d=m/V.",
        "d=600÷200=3."
      ],
      "answer": "3 g/cm³"
    }
  },
  "math.m03.t01": {
    "summary": "Fração, decimal e percentual são representações equivalentes de uma parte do todo. A conversão depende de escrever a fração sobre 100.",
    "steps": [
      "Divida numerador por denominador para obter decimal.",
      "Multiplique por 100 para obter percentual."
    ],
    "pitfall": "Percentual é uma razão por 100, não uma unidade absoluta.",
    "example": {
      "question": "Converta 3/8 em decimal e percentual.",
      "steps": [
        "3÷8=0,375.",
        "0,375×100=37,5%."
      ],
      "answer": "0,375 e 37,5%"
    }
  },
  "math.m03.t02": {
    "summary": "Cálculo percentual multiplica a taxa decimal pelo valor de referência. Primeiro identifique “percentual de quê”.",
    "steps": [
      "Converta a porcentagem para decimal.",
      "Multiplique pela base e interprete a unidade."
    ],
    "pitfall": "Trocar a base altera o resultado: 20% de 50 não é 20% de 100.",
    "example": {
      "question": "Quanto é 18% de R$250?",
      "steps": [
        "18%=0,18.",
        "0,18×250=45."
      ],
      "answer": "R$45"
    }
  },
  "math.m03.t03": {
    "summary": "Acréscimo usa fator 1+i e desconto usa fator 1−i. O percentual sempre incide sobre a base indicada.",
    "steps": [
      "Transforme a taxa em fator multiplicativo.",
      "Aplique o fator ao preço original e compare os valores."
    ],
    "pitfall": "Desconto de 20% e acréscimo de 20% em momentos diferentes não se anulam automaticamente.",
    "example": {
      "question": "Preço R$80 com acréscimo de 15%.",
      "steps": [
        "Fator=1,15.",
        "80×1,15=92."
      ],
      "answer": "R$92"
    }
  },
  "math.m03.t04": {
    "summary": "Variações sucessivas multiplicam fatores sucessivos, porque cada alteração usa a base já modificada. A variação total é o fator final menos 1.",
    "steps": [
      "Escreva 1+i para aumento e 1−i para desconto.",
      "Multiplique fatores na ordem dos eventos."
    ],
    "pitfall": "Somar percentuais sucessivos só funciona quando a base permanece a mesma.",
    "example": {
      "question": "Um valor sobe 20% e depois cai 10%. Variação total?",
      "steps": [
        "Fator=1,20×0,90=1,08.",
        "O fator 1,08 representa aumento de 8%."
      ],
      "answer": "Aumento de 8%"
    }
  },
  "math.m03.t05": {
    "summary": "Porcentagem reversa recupera a base dividindo o valor final pelo fator que gerou a alteração. Isso desfaz a multiplicação original.",
    "steps": [
      "Identifique o fator: 1+i ou 1−i.",
      "Divida o valor final por esse fator e confira reaplicando a taxa."
    ],
    "pitfall": "Após 20% de desconto, o preço original não é obtido acrescentando 20% ao preço final.",
    "example": {
      "question": "Após desconto de 25%, um produto custa R$90. Preço original?",
      "steps": [
        "Fator=0,75.",
        "90÷0,75=120."
      ],
      "answer": "R$120"
    }
  },
  "math.m03.t06": {
    "summary": "Lucro compara preço de venda com custo; prejuízo ocorre quando a venda fica abaixo do custo. A porcentagem pode usar custo ou venda como base.",
    "steps": [
      "Calcule venda−custo para o resultado absoluto.",
      "Divida pela base pedida e converta em percentual."
    ],
    "pitfall": "“Lucro sobre custo” e “margem sobre venda” têm denominadores diferentes.",
    "example": {
      "question": "Custo R$80 e venda R$100. Lucro e lucro sobre custo?",
      "steps": [
        "Lucro=100−80=20.",
        "20÷80=0,25=25%."
      ],
      "answer": "R$20 e 25%"
    }
  },
  "math.m03.t07": {
    "summary": "Juros simples calculam J=C·i·t sempre sobre o capital inicial. O montante é M=C+J.",
    "steps": [
      "Alinhe taxa e tempo no mesmo período.",
      "Calcule J e some ao capital."
    ],
    "pitfall": "Usar o saldo de cada mês como nova base transforma o cálculo em composto.",
    "example": {
      "question": "C=R$500, taxa 2% ao mês por 3 meses.",
      "steps": [
        "J=500×0,02×3=30.",
        "M=500+30=530."
      ],
      "answer": "R$530"
    }
  },
  "math.m03.t08": {
    "summary": "Juros compostos aplicam o fator 1+i a cada período, produzindo M=C(1+i)^t. O crescimento acumula juros sobre juros.",
    "steps": [
      "Converta a taxa para o período.",
      "Eleve o fator ao número de períodos e subtraia C se pedir juros."
    ],
    "pitfall": "10% por dois períodos dá fator 1,1², não 1,2.",
    "example": {
      "question": "C=R$1 000, 10% ao mês por 2 meses.",
      "steps": [
        "M=1000×1,1².",
        "M=1000×1,21=1210."
      ],
      "answer": "R$1 210"
    }
  },
  "math.m03.t09": {
    "summary": "Taxa de juros mede crescimento de capital; inflação mede aumento geral de preços e reduz poder de compra. Comparações precisam usar o mesmo período.",
    "steps": [
      "Converta taxas para fatores multiplicativos.",
      "Para a taxa real exata, divida o fator de rendimento pelo fator da inflação e subtraia 1."
    ],
    "pitfall": "Somar inflação mensal sem considerar capitalização pode distorcer a inflação acumulada.",
    "example": {
      "question": "Investimento rende 8% e inflação é 5% no ano. Ganho real exato?",
      "steps": [
        "Fator nominal=1,08; fator de preços=1,05.",
        "Fator real=1,08/1,05≈1,0286."
      ],
      "answer": "≈2,86%"
    }
  },
  "math.m04.t01": {
    "summary": "Potenciação representa multiplicação repetida e suas propriedades reorganizam fatores de mesma base. Expoente zero vale 1 para base não nula.",
    "steps": [
      "Reescreva bases comuns.",
      "Some expoentes em produtos, subtraia em quocientes e multiplique em potência de potência."
    ],
    "pitfall": "(a+b)² não é a²+b²; aparece também o termo 2ab.",
    "example": {
      "question": "Simplifique 2³×2⁴/2².",
      "steps": [
        "2^(3+4−2)=2⁵.",
        "2⁵=32."
      ],
      "answer": "32"
    }
  },
  "math.m04.t02": {
    "summary": "Potências de dez organizam ordens de grandeza. Para 10ⁿ, expoentes inteiros positivos dão valores maiores que 1, o zero dá 1 e os negativos dão valores entre 0 e 1.",
    "steps": [
      "Conte casas decimais deslocadas.",
      "Ajuste o sinal do expoente conforme o tamanho do número."
    ],
    "pitfall": "10⁻³=0,001, não −1 000.",
    "example": {
      "question": "Escreva 0,0006 como potência de dez.",
      "steps": [
        "6×10⁻⁴ recoloca a vírgula quatro casas."
      ],
      "answer": "6×10⁻⁴"
    }
  },
  "math.m04.t03": {
    "summary": "Notação científica escreve a×10^n com 1≤a<10. Ela facilita comparar números muito grandes ou pequenos.",
    "steps": [
      "Mova a vírgula até sobrar um algarismo não nulo antes dela.",
      "Conte deslocamentos e escolha o sinal de n."
    ],
    "pitfall": "A mantissa deve ficar entre 1 e 10; 42×10³ ainda não está normalizada.",
    "example": {
      "question": "Escreva 5 670 000 em notação científica.",
      "steps": [
        "Mova a vírgula seis casas para a esquerda.",
        "5,67×10⁶."
      ],
      "answer": "5,67×10⁶"
    }
  },
  "math.m04.t04": {
    "summary": "Ordem de grandeza aproxima um número à potência de dez mais próxima. O primeiro algarismo da mantissa decide o arredondamento.",
    "steps": [
      "Escreva em notação científica.",
      "Se a mantissa for pelo menos √10≈3,16, suba a potência; caso contrário, mantenha-a."
    ],
    "pitfall": "Ordem de grandeza não é simplesmente o expoente sem olhar a mantissa.",
    "example": {
      "question": "Ordem de grandeza de 7×10⁴.",
      "steps": [
        "7≥3,16, então aproxima para 10×10⁴.",
        "10×10⁴=10⁵."
      ],
      "answer": "10⁵"
    }
  },
  "math.m04.t05": {
    "summary": "Raiz quadrada e cúbica desfazem potências de expoente 2 e 3. A raiz quadrada real principal é não negativa.",
    "steps": [
      "Procure o número cujo quadrado ou cubo produz o radicando.",
      "Verifique o domínio, especialmente em raízes de índice par."
    ],
    "pitfall": "√25=5, não ±5; ±5 são soluções de x²=25.",
    "example": {
      "question": "Calcule ∛(−125).",
      "steps": [
        "(−5)³=−125."
      ],
      "answer": "−5"
    }
  },
  "math.m04.t06": {
    "summary": "Simplificar radicais separa fatores que são potências perfeitas do índice. Isso reduz a expressão sem aproximar o valor.",
    "steps": [
      "Fatore o radicando.",
      "Retire grupos completos do radical e mantenha o restante dentro dele."
    ],
    "pitfall": "√(a+b) não pode ser separado em √a+√b.",
    "example": {
      "question": "Simplifique √72.",
      "steps": [
        "72=36×2.",
        "√72=6√2."
      ],
      "answer": "6√2"
    }
  },
  "math.m04.t07": {
    "summary": "Racionalização remove radical do denominador multiplicando por uma forma equivalente. O valor da fração permanece igual.",
    "steps": [
      "Escolha o fator que torna o denominador racional.",
      "Multiplique numerador e denominador pelo mesmo fator e simplifique."
    ],
    "pitfall": "Multiplicar só o denominador altera a fração.",
    "example": {
      "question": "Racionalize 1/√3.",
      "steps": [
        "Multiplique por √3/√3.",
        "√3/3."
      ],
      "answer": "√3/3"
    }
  },
  "math.m04.t08": {
    "summary": "Expoente fracionário representa raiz e potência: a^(m/n)=(ⁿ√a)^m. O domínio depende do índice da raiz.",
    "steps": [
      "Use o denominador como índice da raiz.",
      "Use o numerador como expoente e confira se a base permite a operação real."
    ],
    "pitfall": "Raiz de índice par exige radicando não negativo no conjunto dos reais.",
    "example": {
      "question": "Calcule 16^(3/4).",
      "steps": [
        "⁴√16=2.",
        "2³=8."
      ],
      "answer": "8"
    }
  },
  "math.m05.t01": {
    "summary": "O Sistema Internacional define unidades-base e prefixos decimais para comunicar medidas. O prefixo altera a potência de dez da unidade.",
    "steps": [
      "Identifique a grandeza e sua unidade-base.",
      "Substitua o prefixo pelo fator correspondente e mantenha a dimensão."
    ],
    "pitfall": "kilo significa 10³, milli 10⁻³ e micro 10⁻⁶; não confunda o símbolo m de metro com o prefixo m.",
    "example": {
      "question": "Converta 3,2 km em metros.",
      "steps": [
        "1 km=1 000 m.",
        "3,2×1 000=3 200."
      ],
      "answer": "3 200 m"
    }
  },
  "math.m05.t02": {
    "summary": "Conversões mudam a unidade sem mudar a grandeza; áreas usam o fator ao quadrado e volumes o fator ao cubo. Tempo exige relações próprias, como 1 h=60 min.",
    "steps": [
      "Escreva a equivalência entre unidades.",
      "Aplique o fator correto à dimensão e confira a unidade final."
    ],
    "pitfall": "1 m²=10 000 cm², não 100 cm², porque o fator vale em duas direções.",
    "example": {
      "question": "Converta 2,5 m² em cm².",
      "steps": [
        "1 m²=100² cm²=10 000 cm².",
        "2,5×10 000=25 000."
      ],
      "answer": "25 000 cm²"
    }
  },
  "math.m05.t03": {
    "summary": "Litro mede capacidade e metro cúbico mede volume; 1 L=1 dm³ e 1 m³=1 000 L. A equivalência conecta recipientes e espaço ocupado.",
    "steps": [
      "Converta o volume para dm³ ou m³.",
      "Use o fator cúbico e escreva a capacidade na unidade solicitada."
    ],
    "pitfall": "1 m³ não é 1 L; há mil litros em um metro cúbico.",
    "example": {
      "question": "Quantos litros cabem em 0,08 m³?",
      "steps": [
        "0,08×1 000=80."
      ],
      "answer": "80 L"
    }
  },
  "math.m05.t04": {
    "summary": "Medidas angulares podem ser expressas em graus ou radianos. Uma volta é 360° ou 2π radianos.",
    "steps": [
      "Identifique a unidade usada.",
      "Converta por 180°=π rad e preserve o sentido do ângulo."
    ],
    "pitfall": "Graus e radianos não podem ser misturados na mesma fórmula trigonométrica.",
    "example": {
      "question": "Converta 60° em radianos.",
      "steps": [
        "60×π/180=π/3."
      ],
      "answer": "π/3 rad"
    }
  },
  "math.m05.t05": {
    "summary": "Estimativa produz um valor plausível rapidamente, usando arredondamentos controlados. Ela serve para conferir resultado e ordem de grandeza.",
    "steps": [
      "Arredonde números para valores fáceis.",
      "Calcule aproximadamente e compare com o resultado exato."
    ],
    "pitfall": "Arredondar cada etapa pode acumular erro; para precisão, arredonde só no final.",
    "example": {
      "question": "Estime 49,8×20,2.",
      "steps": [
        "Aproxime para 50×20.",
        "50×20=1 000."
      ],
      "answer": "Aproximadamente 1 000"
    }
  },
  "math.m05.t06": {
    "summary": "Algarismos significativos comunicam os dígitos confiáveis de uma medida. Zeros entre dígitos contam; zeros à esquerda apenas posicionam a vírgula. Zeros finais depois da vírgula, quando indicam a precisão da medida, também são significativos: 0,00450 tem três.",
    "steps": [
      "Conte dígitos não nulos e zeros internos.",
      "Em multiplicação, limite o resultado ao menor número de algarismos significativos."
    ],
    "pitfall": "Mais casas decimais não significam automaticamente mais precisão.",
    "example": {
      "question": "Quantos algarismos significativos há em 0,00450?",
      "steps": [
        "Zeros à esquerda não contam; 4, 5 e zero final contam."
      ],
      "answer": "3"
    }
  },
  "math.m05.t07": {
    "summary": "Arredondamento escolhe uma aproximação e erro mede a diferença entre valor aproximado e referência. A unidade e a precisão devem acompanhar o resultado.",
    "steps": [
      "Escolha a casa de arredondamento.",
      "Observe o algarismo seguinte e calcule erro absoluto ou relativo se pedido."
    ],
    "pitfall": "Erro relativo divide pelo valor de referência, não pelo valor arredondado.",
    "example": {
      "question": "Arredonde 12,746 para centésimos.",
      "steps": [
        "A casa dos centésimos é 4; o próximo algarismo é 6.",
        "Aumente 4 para 5."
      ],
      "answer": "12,75"
    }
  },
  "math.m06.t01": {
    "summary": "Variáveis representam valores que podem mudar; expressões combinam números, letras e operações. O valor da expressão depende da substituição.",
    "steps": [
      "Defina o significado e a unidade de cada variável.",
      "Substitua valores respeitando parênteses e prioridades."
    ],
    "pitfall": "Termos com letras diferentes não são semelhantes: 2x+3y não vira 5xy.",
    "example": {
      "question": "Calcule 3a−2b para a=4 e b=1.",
      "steps": [
        "Substitua: 3×4−2×1.",
        "12−2=10."
      ],
      "answer": "10"
    }
  },
  "math.m06.t02": {
    "summary": "A distributiva transforma a multiplicação de um fator por uma soma em dois produtos. Ela também ajuda a eliminar parênteses e fatorar.",
    "steps": [
      "Multiplique o fator por cada termo dentro do parêntese.",
      "Junte termos semelhantes depois de distribuir."
    ],
    "pitfall": "O sinal negativo também deve ser distribuído a todos os termos.",
    "example": {
      "question": "Simplifique −2(x−3).",
      "steps": [
        "−2×x=−2x e −2×(−3)=+6."
      ],
      "answer": "−2x+6"
    }
  },
  "math.m06.t03": {
    "summary": "Produtos notáveis são padrões de multiplicação que economizam passos. O quadrado da soma inclui o dobro do produto dos termos.",
    "steps": [
      "Reconheça (a+b)², (a−b)² ou (a+b)(a−b).",
      "Substitua a e b e confira expandindo."
    ],
    "pitfall": "(a+b)²=a²+2ab+b², não apenas a²+b².",
    "example": {
      "question": "Expanda (x+4)².",
      "steps": [
        "x²+2×x×4+4²."
      ],
      "answer": "x²+8x+16"
    }
  },
  "math.m06.t04": {
    "summary": "Fatoração reescreve uma soma como produto, revelando fatores comuns ou raízes. É a operação inversa da distributiva.",
    "steps": [
      "Procure fator comum ou padrão de diferença de quadrados.",
      "Multiplique os fatores para conferir a expressão original."
    ],
    "pitfall": "Só se pode cancelar um fator depois de fatorar e verificar que ele não é zero.",
    "example": {
      "question": "Fatore x²−9.",
      "steps": [
        "Reconheça diferença de quadrados.",
        "x²−3²=(x−3)(x+3)."
      ],
      "answer": "(x−3)(x+3)"
    }
  },
  "math.m06.t05": {
    "summary": "Frações algébricas são quocientes de polinômios e têm restrições nos valores que anulam o denominador. Simplificar conserva essas restrições.",
    "steps": [
      "Fatore numerador e denominador.",
      "Cancele fatores comuns, registrando os valores proibidos."
    ],
    "pitfall": "Após cancelar x−2, ainda vale x≠2 se ele estava no denominador original.",
    "example": {
      "question": "Simplifique (x²−4)/(x−2).",
      "steps": [
        "x²−4=(x−2)(x+2).",
        "Para x≠2, o resultado é x+2."
      ],
      "answer": "x+2, x≠2"
    }
  },
  "math.m06.t06": {
    "summary": "Equação do primeiro grau procura o valor que torna ax+b=c verdadeiro. Operações iguais nos dois lados preservam a igualdade.",
    "steps": [
      "Reduza termos e isole o termo com x.",
      "Divida pelo coeficiente de x e substitua para conferir."
    ],
    "pitfall": "Se o coeficiente de x for zero, o caso pode ser impossível ou ter infinitas soluções.",
    "example": {
      "question": "Resolva 5x−7=18.",
      "steps": [
        "5x=25.",
        "x=5."
      ],
      "answer": "x=5"
    }
  },
  "math.m06.t07": {
    "summary": "Inequação descreve um intervalo de soluções, não apenas um ponto. Dividir ou multiplicar por número negativo inverte o sinal.",
    "steps": [
      "Isole a variável como numa equação.",
      "Represente intervalo e teste um valor para validar o sentido."
    ],
    "pitfall": "−3x≥6 dá x≤−2, pois a divisão por −3 inverte ≥.",
    "example": {
      "question": "Resolva 2x+1<9.",
      "steps": [
        "2x<8.",
        "x<4."
      ],
      "answer": "x<4"
    }
  },
  "math.m06.t08": {
    "summary": "Sistema linear 2×2 encontra o par que satisfaz duas retas ao mesmo tempo. Eliminação e substituição são formas equivalentes.",
    "steps": [
      "Elimine uma variável somando equações ou substituindo uma expressão.",
      "Volte ao sistema e confira o par nas duas linhas."
    ],
    "pitfall": "Resolver uma equação isolada não garante que o par satisfaça a outra.",
    "example": {
      "question": "x+y=9 e x−y=1.",
      "steps": [
        "Somando: 2x=10, então x=5.",
        "y=9−5=4."
      ],
      "answer": "(5,4)"
    }
  },
  "math.m06.t09": {
    "summary": "Problemas com incógnitas traduzem palavras em equações, mantendo unidades e relações entre quantidades. A solução só vale se fizer sentido no contexto.",
    "steps": [
      "Escolha uma variável e escreva as demais em função dela.",
      "Monte a equação, resolva e interprete a unidade."
    ],
    "pitfall": "Uma idade, comprimento ou quantidade não pode ser negativa só porque a álgebra permitiu.",
    "example": {
      "question": "Dois números consecutivos somam 41. Quais?",
      "steps": [
        "Se o menor é n, o outro é n+1.",
        "2n+1=41, n=20."
      ],
      "answer": "20 e 21"
    }
  },
  "math.m07.t01": {
    "summary": "Equação quadrática tem forma ax²+bx+c=0 com a≠0 e pode ter duas, uma ou nenhuma raiz real. Fatoração e Bhaskara são caminhos equivalentes.",
    "steps": [
      "Leve todos os termos para um lado e identifique a,b,c.",
      "Calcule discriminante ou fatore e teste as raízes."
    ],
    "pitfall": "Não use fórmula quadrática se o coeficiente de x² for zero.",
    "example": {
      "question": "Resolva x²−7x+12=0.",
      "steps": [
        "Fatore: (x−3)(x−4)=0.",
        "Cada fator nulo dá uma raiz."
      ],
      "answer": "x=3 ou x=4"
    }
  },
  "math.m07.t02": {
    "summary": "A fórmula de Bhaskara usa Δ=b²−4ac para resolver qualquer quadrática real. O sinal de Δ classifica as raízes.",
    "steps": [
      "Calcule Δ preservando os sinais.",
      "Substitua em x=(−b±√Δ)/(2a) e simplifique."
    ],
    "pitfall": "O denominador é 2a, não apenas 2; os dois sinais geram as duas raízes.",
    "example": {
      "question": "Resolva 2x²−3x−2=0.",
      "steps": [
        "Δ=9+16=25.",
        "x=(3±5)/4, logo x=2 ou −1/2."
      ],
      "answer": "2 e −1/2"
    }
  },
  "math.m07.t03": {
    "summary": "Soma e produto das raízes seguem Viète: r₁+r₂=−b/a e r₁r₂=c/a. Isso permite reconhecer raízes sem resolver toda a equação.",
    "steps": [
      "Leia a,b,c na forma padrão.",
      "Calcule soma e produto e procure valores compatíveis."
    ],
    "pitfall": "O sinal da soma é oposto ao de b/a.",
    "example": {
      "question": "Na equação 3x²−12x+9=0, qual a soma e o produto?",
      "steps": [
        "Soma=−(−12)/3=4.",
        "Produto=9/3=3."
      ],
      "answer": "Soma 4; produto 3"
    }
  },
  "math.m07.t04": {
    "summary": "O discriminante Δ=b²−4ac informa a quantidade de raízes reais. Δ positivo dá duas, zero dá uma raiz dupla e negativo não dá raízes reais.",
    "steps": [
      "Calcule Δ com a,b,c identificados.",
      "Classifique antes de decidir se Bhaskara será usada."
    ],
    "pitfall": "Δ=0 significa uma raiz real repetida, não duas raízes distintas.",
    "example": {
      "question": "Classifique x²+4x+4=0.",
      "steps": [
        "Δ=16−16=0.",
        "Há uma raiz dupla x=−2."
      ],
      "answer": "Uma raiz real dupla"
    }
  },
  "math.m07.t05": {
    "summary": "Sistemas com equação quadrática combinam uma relação linear com uma curva. Substituição reduz o problema a uma equação de segundo grau.",
    "steps": [
      "Isole uma variável na equação mais simples.",
      "Substitua, resolva todas as raízes e teste os pares no sistema."
    ],
    "pitfall": "Uma raiz algébrica pode gerar par que não satisfaz a equação original.",
    "example": {
      "question": "y=x e x²+y=6.",
      "steps": [
        "Substitua y=x: x²+x−6=0.",
        "(x+3)(x−2)=0: pares (−3,−3) e (2,2)."
      ],
      "answer": "(−3,−3) e (2,2)"
    }
  },
  "math.m07.t06": {
    "summary": "Polinômios são somas de termos ordenados por grau; somar, subtrair e multiplicar exige combinar termos semelhantes. O grau do produto soma os graus. A soma de graus no produto vale para polinômios não nulos.",
    "steps": [
      "Ordene termos e reduza semelhantes.",
      "Distribua cada termo no produto e confira os coeficientes."
    ],
    "pitfall": "x² e x não são termos semelhantes, mesmo tendo a mesma letra.",
    "example": {
      "question": "Calcule (x+2)(x²−x+3).",
      "steps": [
        "Distribua x e 2.",
        "x³−x²+3x+2x²−2x+6."
      ],
      "answer": "x³+x²+x+6"
    }
  },
  "math.m07.t07": {
    "summary": "Equações biquadradas têm potências x⁴ e x² e podem ser reduzidas por u=x². Depois é necessário voltar de u para x.",
    "steps": [
      "Faça u=x² e resolva a quadrática em u.",
      "Aceite apenas u≥0 nos reais e extraia x=±√u."
    ],
    "pitfall": "Não esquecer as duas raízes de x quando u é positivo.",
    "example": {
      "question": "Resolva x⁴−5x²+4=0.",
      "steps": [
        "u²−5u+4=(u−1)(u−4).",
        "u=1 ou 4, então x=±1,±2."
      ],
      "answer": "−2, −1, 1 e 2"
    }
  },
  "math.m07.t08": {
    "summary": "Inequação quadrática usa raízes para dividir a reta em intervalos. O sinal da parábola escolhe os intervalos que satisfazem a condição.",
    "steps": [
      "Ache raízes e marque-as em ordem.",
      "Determine o sinal em cada intervalo usando a concavidade ou um ponto de teste."
    ],
    "pitfall": "As raízes entram apenas quando a desigualdade inclui igualdade.",
    "example": {
      "question": "Resolva x²−5x+6≤0.",
      "steps": [
        "Raízes 2 e 3; parábola abre para cima.",
        "O sinal é não positivo entre as raízes."
      ],
      "answer": "2≤x≤3"
    }
  },
  "math.m08.t01": {
    "summary": "Função associa cada entrada a uma única saída. A fórmula, a tabela e o gráfico são representações da mesma regra.",
    "steps": [
      "Defina variável de entrada e saída.",
      "Calcule imagens e confira que cada x tem uma única y."
    ],
    "pitfall": "Uma relação pode ter pontos, mas se uma entrada tiver duas saídas não é função.",
    "example": {
      "question": "Para f(x)=3x−1, calcule f(4).",
      "steps": [
        "Substitua x=4.",
        "3×4−1=11."
      ],
      "answer": "11"
    }
  },
  "math.m08.t02": {
    "summary": "Domínio reúne entradas permitidas; contradomínio é o conjunto de saídas declarado; imagem são as saídas realmente atingidas. Restrições vêm de denominadores e raízes.",
    "steps": [
      "Exclua denominador zero e radicando par negativo.",
      "Calcule ou descreva as saídas possíveis."
    ],
    "pitfall": "Imagem pode ser menor que o contradomínio.",
    "example": {
      "question": "Domínio de f(x)=√(x−3).",
      "steps": [
        "x−3≥0.",
        "x≥3."
      ],
      "answer": "[3,∞)"
    }
  },
  "math.m08.t03": {
    "summary": "Par ordenado (x,y) registra entrada e saída ou coordenada horizontal e vertical. A ordem é essencial para localizar o ponto.",
    "steps": [
      "Leia primeiro x e depois y.",
      "Substitua na fórmula ou marque no plano conforme o papel do par."
    ],
    "pitfall": "(2,5) e (5,2) são pontos diferentes.",
    "example": {
      "question": "Qual ponto do gráfico de f(x)=x²+1 tem abscissa x=2?",
      "steps": [
        "O par é (2,f(2)).",
        "f(2)=4+1=5."
      ],
      "answer": "(2,5)"
    }
  },
  "math.m08.t04": {
    "summary": "O plano cartesiano usa eixos perpendiculares e quadrantes definidos pelos sinais de (x,y). Ele permite ler distância e posição.",
    "steps": [
      "Desloque x horizontalmente e y verticalmente a partir da origem.",
      "Use os sinais para identificar o quadrante."
    ],
    "pitfall": "Pontos sobre os eixos não pertencem a quadrante.",
    "example": {
      "question": "Onde está o ponto (−4,−2)?",
      "steps": [
        "x<0 e y<0.",
        "Os dois sinais negativos indicam o terceiro quadrante."
      ],
      "answer": "III quadrante"
    }
  },
  "math.m08.t05": {
    "summary": "Tabela mostra pares de entrada e saída; gráfico revela padrão, crescimento e possíveis descontinuidades. A escala dos eixos também faz parte da leitura.",
    "steps": [
      "Leia cabeçalhos e unidades.",
      "Marque os pares e procure tendência coerente com a fórmula."
    ],
    "pitfall": "Distância visual no gráfico não substitui a escala numérica dos eixos.",
    "example": {
      "question": "Tabela x:0,1,2 e y:2,5,8. Regra provável?",
      "steps": [
        "A saída aumenta 3 a cada x.",
        "Com y=2 em x=0, a regra é y=3x+2."
      ],
      "answer": "y=3x+2"
    }
  },
  "math.m08.t06": {
    "summary": "Crescimento significa saídas maiores quando a entrada aumenta; decrescimento significa o contrário no intervalo estudado. A inclinação ou comparação de valores revela o comportamento.",
    "steps": [
      "Compare imagens de entradas crescentes.",
      "Declare o intervalo, pois uma função pode mudar de comportamento."
    ],
    "pitfall": "Crescer não significa necessariamente crescer a uma taxa constante.",
    "example": {
      "question": "f(x)=10−2x cresce ou decresce?",
      "steps": [
        "O coeficiente de x é −2.",
        "A cada aumento de x, f cai 2."
      ],
      "answer": "Decresce"
    }
  },
  "math.m08.t07": {
    "summary": "Taxa de variação mede saída por unidade de entrada: Δy/Δx. Ela pode ser média entre pontos ou instantânea em modelos mais avançados.",
    "steps": [
      "Escolha dois pontos e calcule diferenças com sinais.",
      "Interprete o resultado com sua unidade."
    ],
    "pitfall": "Inverter Δy e Δx troca a unidade e o significado.",
    "example": {
      "question": "Entre (1,4) e (5,16), qual a taxa média?",
      "steps": [
        "Δy=12 e Δx=4.",
        "12/4=3."
      ],
      "answer": "3 por unidade de x"
    }
  },
  "math.m08.t08": {
    "summary": "Zero de uma função é a entrada cuja saída é zero; intercepto é o ponto em que o gráfico cruza um eixo. Eles traduzem valores-limite do modelo.",
    "steps": [
      "Faça f(x)=0 para achar zeros no eixo x.",
      "Calcule f(0) para o intercepto no eixo y."
    ],
    "pitfall": "Um zero pode não existir no domínio ou pode ser uma raiz repetida.",
    "example": {
      "question": "Zeros de f(x)=x−7.",
      "steps": [
        "x−7=0.",
        "x=7, ponto (7,0)."
      ],
      "answer": "x=7"
    }
  },
  "math.m08.t09": {
    "summary": "Composição aplica uma função dentro de outra: (f∘g)(x)=f(g(x)). Função inversa desfaz a regra quando ela é bijetiva no domínio escolhido.",
    "steps": [
      "Calcule primeiro a função interna.",
      "Para inversa, troque x e y, isole y e verifique domínio e imagem."
    ],
    "pitfall": "Nem toda função possui inversa como função; ela precisa ser injetiva no domínio.",
    "example": {
      "question": "f(x)=x+2 e g(x)=3x. Calcule f(g(4)).",
      "steps": [
        "g(4)=12.",
        "f(12)=14."
      ],
      "answer": "14"
    }
  },
  "math.m09.t01": {
    "summary": "Na função afim f(x)=ax+b, o coeficiente angular a mede a variação por unidade e b é o intercepto vertical. O sinal de a indica crescimento ou queda.",
    "steps": [
      "Use dois pontos para calcular a=Δy/Δx.",
      "Ache b substituindo um ponto e interprete a unidade."
    ],
    "pitfall": "Coeficiente linear b é f(0), não a raiz da função.",
    "example": {
      "question": "Reta passa por (1,4) e (3,10). Qual a?",
      "steps": [
        "a=(10−4)/(3−1)=6/2."
      ],
      "answer": "a=3"
    }
  },
  "math.m09.t02": {
    "summary": "A equação da reta pode ser escrita y=ax+b ou y−y₀=a(x−x₀). As formas tornam explícitos inclinação e um ponto.",
    "steps": [
      "Calcule a inclinação e escolha um ponto conhecido.",
      "Substitua e isole a forma pedida."
    ],
    "pitfall": "Reta vertical x=k não tem forma y=ax+b nem coeficiente angular finito.",
    "example": {
      "question": "Reta com a=2 passando por (1,5).",
      "steps": [
        "y−5=2(x−1).",
        "y=2x+3."
      ],
      "answer": "y=2x+3"
    }
  },
  "math.m09.t03": {
    "summary": "Interpretação gráfica lê interceptos, inclinação e tendência sem perder a escala dos eixos. Cada ponto deve ser associado às grandezas do contexto.",
    "steps": [
      "Leia eixos, unidades e origem.",
      "Use dois pontos ou interceptos para confirmar a fórmula."
    ],
    "pitfall": "Uma reta visualmente inclinada pode ter pequena taxa se a escala dos eixos for diferente.",
    "example": {
      "question": "Uma reta passa por (0,6) e (2,0). Qual a inclinação?",
      "steps": [
        "a=(0−6)/(2−0)=−3."
      ],
      "answer": "−3"
    }
  },
  "math.m09.t04": {
    "summary": "O zero da função afim é o x que faz ax+b=0 e corresponde ao cruzamento com o eixo horizontal. Ele existe quando a≠0.",
    "steps": [
      "Isole x em ax+b=0.",
      "Marque o ponto (x,0) e confira na fórmula."
    ],
    "pitfall": "O intercepto vertical b e o zero horizontal são pontos diferentes.",
    "example": {
      "question": "Zero de f(x)=4x+12.",
      "steps": [
        "4x+12=0.",
        "4x=−12, x=−3."
      ],
      "answer": "−3"
    }
  },
  "math.m09.t05": {
    "summary": "O sinal da função afim muda no zero e depende da direção da reta. A tabela de sinais separa intervalos à esquerda e à direita.",
    "steps": [
      "Ache a raiz.",
      "Se a>0, a função é negativa antes e positiva depois; se a<0, inverta."
    ],
    "pitfall": "O sinal no ponto zero é exatamente zero, não positivo nem negativo.",
    "example": {
      "question": "Onde f(x)=2x−6 é positiva?",
      "steps": [
        "Zero: x=3.",
        "Como a>0, f>0 para x>3."
      ],
      "answer": "x>3"
    }
  },
  "math.m09.t06": {
    "summary": "Taxa constante significa que a mesma quantidade é acrescentada ou retirada por unidade. É a assinatura de uma relação afim.",
    "steps": [
      "Calcule diferenças de saída para intervalos iguais de entrada.",
      "Use a taxa para projetar e some o valor inicial."
    ],
    "pitfall": "Se as diferenças mudam, o modelo não é de taxa constante.",
    "example": {
      "question": "Um serviço cobra uma taxa fixa de R$10 mais R$2 por viagem. Qual o total para 7 viagens?",
      "steps": [
        "C(n)=10+2n.",
        "C(7)=10+14=24."
      ],
      "answer": "R$24"
    }
  },
  "math.m09.t07": {
    "summary": "Sistemas gráficos encontram o ponto de interseção de duas retas. Esse ponto representa valores que satisfazem os dois modelos.",
    "steps": [
      "Iguale as duas expressões ou leia o cruzamento.",
      "Substitua o ponto nas duas retas e verifique a unidade."
    ],
    "pitfall": "Retas paralelas não se cruzam e podem representar sistema sem solução.",
    "example": {
      "question": "y=2x+1 e y=−x+7.",
      "steps": [
        "2x+1=−x+7, então 3x=6.",
        "x=2 e y=5."
      ],
      "answer": "(2,5)"
    }
  },
  "math.m09.t08": {
    "summary": "Modelar tarifas e consumos separa custo fixo de custo variável. A expressão afim permite prever preço e comparar planos.",
    "steps": [
      "Identifique taxa inicial e valor por unidade consumida.",
      "Escreva C(x)=fixo+variável·x e teste um consumo conhecido."
    ],
    "pitfall": "Confundir custo fixo com preço por unidade distorce o intercepto.",
    "example": {
      "question": "Plano custa R$25 fixos e R$0,80 por GB. Custo de 10 GB?",
      "steps": [
        "C(10)=25+0,80×10.",
        "C(10)=33."
      ],
      "answer": "R$33"
    }
  },
  "math.m10.t01": {
    "summary": "A parábola de ax²+bx+c abre para cima se a>0 e para baixo se a<0. O eixo de simetria passa pelo vértice.",
    "steps": [
      "Observe o sinal de a.",
      "Use xv=−b/(2a) para localizar o eixo e desenhe pontos simétricos."
    ],
    "pitfall": "O sinal de b não determina sozinho a concavidade.",
    "example": {
      "question": "Concavidade de f(x)=−2x²+3x+1.",
      "steps": [
        "a=−2<0."
      ],
      "answer": "Para baixo"
    }
  },
  "math.m10.t02": {
    "summary": "Zeros são interseções com o eixo x e o vértice é o ponto extremo da parábola. Ambos resumem a posição do gráfico.",
    "steps": [
      "Calcule Δ para as raízes.",
      "Calcule xv e yv=f(xv) para o vértice."
    ],
    "pitfall": "Se Δ<0, não há zeros reais, embora exista vértice real.",
    "example": {
      "question": "Vértice de f=x²−6x+5.",
      "steps": [
        "xv=6/2=3.",
        "yv=9−18+5=−4."
      ],
      "answer": "(3,−4)"
    }
  },
  "math.m10.t03": {
    "summary": "Máximo ocorre quando a parábola abre para baixo; mínimo quando abre para cima. O valor extremo é a ordenada do vértice.",
    "steps": [
      "Determine a concavidade por a.",
      "Calcule o vértice e interprete a unidade do extremo."
    ],
    "pitfall": "O vértice pode estar fora do intervalo físico; nesse caso compare também as extremidades do intervalo.",
    "example": {
      "question": "Máximo de f=−x²+4x+1.",
      "steps": [
        "xv=−4/(−2)=2.",
        "f(2)=−4+8+1=5."
      ],
      "answer": "5"
    }
  },
  "math.m10.t04": {
    "summary": "Intervalos de sinal usam raízes e concavidade para dizer onde a função é positiva ou negativa. A análise acontece na reta real.",
    "steps": [
      "Marque zeros em ordem.",
      "Teste um intervalo ou use a abertura para preencher sinais."
    ],
    "pitfall": "Inclua raízes apenas em desigualdades com igualdade.",
    "example": {
      "question": "Sinal de x²−1.",
      "steps": [
        "Raízes −1 e 1; abre para cima.",
        "Positivo fora e negativo entre as raízes."
      ],
      "answer": "Negativo para −1<x<1; zero em x=−1 e x=1; positivo para x<−1 ou x>1."
    }
  },
  "math.m10.t05": {
    "summary": "Deslocamentos alteram a parábola: f(x−h)+k move h na horizontal e k na vertical. A concavidade permanece ligada a a.",
    "steps": [
      "Compare com a forma a(x−h)²+k.",
      "Leia vértice (h,k) e confira um ponto."
    ],
    "pitfall": "x−h desloca para a direita h; x+h desloca para a esquerda.",
    "example": {
      "question": "Vértice de f=(x−3)²+2.",
      "steps": [
        "A expressão já está na forma de vértice."
      ],
      "answer": "(3,2)"
    }
  },
  "math.m10.t06": {
    "summary": "Otimização quadrática procura máximo ou mínimo dentro das condições do problema. O domínio físico pode limitar a resposta.",
    "steps": [
      "Modele a grandeza por uma quadrática.",
      "Calcule o vértice e compare com limites permitidos."
    ],
    "pitfall": "Uma área, comprimento ou quantidade não pode assumir valores fora do domínio do enunciado.",
    "example": {
      "question": "Área A=x(10−x), com 0≤x≤10. Máximo?",
      "steps": [
        "A=−x²+10x; xv=5.",
        "A(5)=25."
      ],
      "answer": "25 unidades²"
    }
  },
  "math.m10.t07": {
    "summary": "Trajetórias parabólicas modelam altura ou posição em função do tempo/horizontal. O vértice indica altura máxima quando a concavidade é para baixo.",
    "steps": [
      "Identifique variável, unidades e instante inicial.",
      "Use raízes para alcance e vértice para altura máxima."
    ],
    "pitfall": "Uma raiz negativa pode representar um instante anterior e não um tempo físico permitido.",
    "example": {
      "question": "h(t)=−t²+4t. Altura máxima?",
      "steps": [
        "tv=−4/(−2)=2.",
        "h(2)=4."
      ],
      "answer": "4 unidades"
    }
  },
  "math.m11.t01": {
    "summary": "Crescimento exponencial multiplica por fator maior que 1; decaimento usa fator entre 0 e 1. A taxa incide sobre o valor atual.",
    "steps": [
      "Escreva P(t)=P₀·q^t.",
      "Identifique q=1+i ou q=1−i e alinhe o período."
    ],
    "pitfall": "Somar a mesma quantidade a cada período descreve crescimento linear, não exponencial.",
    "example": {
      "question": "Uma população 200 cresce 5% ao ano. Após 2 anos?",
      "steps": [
        "P=200×1,05².",
        "P=220,5."
      ],
      "answer": "220,5"
    }
  },
  "math.m11.t02": {
    "summary": "A função exponencial f(x)=a·b^x tem b>0 e b≠1; b>1 cresce e 0<b<1 decresce. O domínio é real e a imagem depende de a.",
    "steps": [
      "Identifique valor inicial a e fator b.",
      "Calcule pontos e interprete assíntota e unidade."
    ],
    "pitfall": "Base negativa não define uma exponencial real contínua para todo x.",
    "example": {
      "question": "Com f(x)=3·2^x, calcule f(2).",
      "steps": [
        "2²=4.",
        "3×4=12."
      ],
      "answer": "12"
    }
  },
  "math.m11.t03": {
    "summary": "Equações exponenciais procuram o expoente desconhecido. Igualar bases é o caminho mais direto quando possível.",
    "steps": [
      "Reescreva números como potências da mesma base.",
      "Iguale expoentes; se não for possível, use logaritmo preservando domínio."
    ],
    "pitfall": "Ao igualar bases, elas precisam ser positivas e diferentes de 1.",
    "example": {
      "question": "Resolva 3^(x+1)=27.",
      "steps": [
        "27=3³.",
        "x+1=3, então x=2."
      ],
      "answer": "2"
    }
  },
  "math.m11.t04": {
    "summary": "Logaritmo log_b(a) é o expoente que transforma b em a: b^x=a. Ele só existe nos reais para b>0, b≠1 e a>0.",
    "steps": [
      "Converta entre forma logarítmica e exponencial.",
      "Use a definição para encontrar o expoente."
    ],
    "pitfall": "Não há logaritmo real de zero ou número negativo.",
    "example": {
      "question": "Calcule log₂(32).",
      "steps": [
        "Procure 2^x=32.",
        "2⁵=32."
      ],
      "answer": "5"
    }
  },
  "math.m11.t05": {
    "summary": "Propriedades de logaritmos transformam produto em soma, quociente em diferença e potência em multiplicação. As condições dos argumentos continuam valendo.",
    "steps": [
      "Separe ou combine termos usando a mesma base.",
      "Verifique que cada argumento é positivo."
    ],
    "pitfall": "log(a+b) não é log a+log b.",
    "example": {
      "question": "Calcule log₁₀(1000/10).",
      "steps": [
        "1000/10=100.",
        "log₁₀(100)=2."
      ],
      "answer": "2"
    }
  },
  "math.m11.t06": {
    "summary": "A função logarítmica é inversa da exponencial e tem domínio x>0. Sua base determina crescimento ou decrescimento.",
    "steps": [
      "Identifique base e argumento.",
      "Use pontos da forma (b^y,y) e a assíntota x=0 para interpretar o gráfico."
    ],
    "pitfall": "O gráfico logarítmico não aceita x≤0 no conjunto real.",
    "example": {
      "question": "f(x)=log₃x; calcule f(9).",
      "steps": [
        "3²=9."
      ],
      "answer": "2"
    }
  },
  "math.m11.t07": {
    "summary": "Escalas logarítmicas comparam razões multiplicativas, não diferenças aditivas. Cada aumento fixo representa multiplicação por um fator.",
    "steps": [
      "Identifique a base e a razão entre grandezas.",
      "Aplique a fórmula da escala e interprete a unidade."
    ],
    "pitfall": "A diferença de 10 dB não significa apenas 10 unidades de intensidade.",
    "example": {
      "question": "Em uma escala logarítmica de amplitudes, a diferença de magnitude é ΔM=log₁₀(A₂/A₁). Se A₂/A₁=1 000, qual a diferença?",
      "steps": [
        "A razão entre amplitudes é adimensional: 1 000=10³.",
        "ΔM=log₁₀(10³)=3; não se trata de obter magnitude absoluta a partir de uma amplitude sem referência."
      ],
      "answer": "3 unidades de magnitude"
    }
  },
  "math.m11.t08": {
    "summary": "Juros compostos e populações são aplicações exponenciais porque o crescimento de cada período depende do valor atual. Logaritmos encontram tempo ou taxa desconhecida.",
    "steps": [
      "Modele M=C(1+i)^t ou P=P₀q^t.",
      "Use logaritmo para isolar t quando as bases não coincidem."
    ],
    "pitfall": "Taxa e tempo precisam usar o mesmo período de capitalização.",
    "example": {
      "question": "Quanto tempo para dobrar a 10% ao período?",
      "steps": [
        "2=1,1^t.",
        "t=log(2)/log(1,1)≈7,27."
      ],
      "answer": "Aproximadamente 7,27 períodos"
    }
  },
  "math.m12.t01": {
    "summary": "Sequências organizam termos por posição e podem seguir uma regra explícita ou recorrente. Procurar diferenças e razões ajuda a identificar o padrão.",
    "steps": [
      "Compare termos consecutivos e registre a variação.",
      "Teste a regra no primeiro termo e no termo seguinte."
    ],
    "pitfall": "Poucos termos podem admitir vários padrões; use a regra fornecida pelo contexto.",
    "example": {
      "question": "Qual o próximo termo de 2,5,8,11?",
      "steps": [
        "A diferença é sempre 3.",
        "11+3=14."
      ],
      "answer": "14"
    }
  },
  "math.m12.t02": {
    "summary": "Progressão aritmética soma uma razão r a cada termo. O termo geral é a_n=a₁+(n−1)r.",
    "steps": [
      "Calcule r subtraindo termos consecutivos.",
      "Substitua a₁, r e n no termo geral."
    ],
    "pitfall": "Usar n·r em vez de (n−1)r desloca todos os termos.",
    "example": {
      "question": "Na PA 7,10,13,..., qual a₁₀?",
      "steps": [
        "r=3.",
        "a₁₀=7+9×3=34."
      ],
      "answer": "34"
    }
  },
  "math.m12.t03": {
    "summary": "A soma dos n primeiros termos de uma PA é S_n=n(a₁+a_n)/2. Ela equivale a emparelhar primeiro e último termo.",
    "steps": [
      "Encontre a_n pelo termo geral.",
      "Aplique a fórmula e confira a quantidade de termos."
    ],
    "pitfall": "Não confunda soma de termos com o último termo.",
    "example": {
      "question": "Soma dos 5 primeiros termos de 2,5,8,...",
      "steps": [
        "a₅=14.",
        "S₅=5(2+14)/2=40."
      ],
      "answer": "40"
    }
  },
  "math.m12.t04": {
    "summary": "Progressão geométrica multiplica cada termo por uma razão q. O termo geral é a_n=a₁q^(n−1).",
    "steps": [
      "Divida um termo pelo anterior para achar q.",
      "Eleve q ao expoente n−1 e multiplique por a₁."
    ],
    "pitfall": "Razão zero ou negativa muda o comportamento e deve ser mantida no cálculo.",
    "example": {
      "question": "Na PG 3,6,12,..., qual o 6º termo?",
      "steps": [
        "q=2.",
        "a₆=3×2⁵=96."
      ],
      "answer": "96"
    }
  },
  "math.m12.t05": {
    "summary": "A soma de uma PG finita é S_n=a₁(q^n−1)/(q−1), para q≠1. A fórmula resume crescimento multiplicativo acumulado.",
    "steps": [
      "Identifique a₁, q e n.",
      "Substitua e cuide do sinal quando q<1."
    ],
    "pitfall": "Para q=1, todos os termos são iguais e S_n=n·a₁; não use divisão por zero.",
    "example": {
      "question": "Soma 1+2+4+8.",
      "steps": [
        "a₁=1,q=2,n=4.",
        "S=1(2⁴−1)/(2−1)=15."
      ],
      "answer": "15"
    }
  },
  "math.m12.t06": {
    "summary": "Crescimento geométrico aplica o mesmo fator repetidamente, como duplicação ou redução percentual. O fator determina se cresce, decresce ou alterna.",
    "steps": [
      "Escreva a quantidade inicial e o fator por período.",
      "Use P_n=P₀q^n e interprete o índice de tempo."
    ],
    "pitfall": "Aumentar 20% significa multiplicar por 1,2, não somar 0,2 unidades.",
    "example": {
      "question": "Uma cultura com 50 células dobra a cada hora. Após 4 h?",
      "steps": [
        "P=50×2⁴.",
        "P=800."
      ],
      "answer": "800 células"
    }
  },
  "math.m12.t07": {
    "summary": "Sequência recorrente define cada termo usando anteriores, permitindo simular passo a passo. A condição inicial é indispensável.",
    "steps": [
      "Escreva o termo inicial e a regra.",
      "Calcule sucessivamente sem substituir o índice errado."
    ],
    "pitfall": "Uma recorrência e seu termo inicial formam um par; sem o início há várias sequências possíveis.",
    "example": {
      "question": "a₁=2 e a_n=a_{n−1}+3. Qual a₄?",
      "steps": [
        "a₂=5, a₃=8, a₄=11."
      ],
      "answer": "11"
    }
  },
  "math.m12.t08": {
    "summary": "Modelos financeiros em progressão representam depósitos ou parcelas que crescem por fator ou por diferença fixa. Escolha PG para percentuais e PA para acréscimos constantes.",
    "steps": [
      "Identifique se a alteração é percentual ou fixa.",
      "Use termo ou soma da progressão no período solicitado."
    ],
    "pitfall": "Parcelas que aumentam R$100 formam PA, mesmo que o total pareça crescer.",
    "example": {
      "question": "Depósitos mensais formam PA: R$100, R$150, R$200. Qual o 6º?",
      "steps": [
        "a₁=100 e r=50.",
        "a₆=100+5×50=350."
      ],
      "answer": "R$350"
    }
  }
};
