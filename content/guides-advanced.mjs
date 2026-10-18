// Guias autorais por aula; IDs e associações de exercícios permanecem independentes.
export const ADVANCED_GUIDES = {
  "math.m13.t01": {
    "summary": "Pontos representam posições, retas se estendem sem extremos e segmentos ligam dois extremos. Um ângulo mede a abertura entre duas semirretas de mesma origem.",
    "steps": [
      "Identifique origens, extremos e alinhamentos indicados no desenho.",
      "Use as relações dadas para somar segmentos ou comparar aberturas."
    ],
    "pitfall": "Três pontos alinhados não informam qual está entre os outros; confira a ordem antes de somar comprimentos.",
    "example": {
      "question": "Os pontos A, B e C são colineares, com B entre A e C. Se AB=7 cm e BC=4 cm, quanto mede AC?",
      "steps": [
        "B está entre A e C, então AC=AB+BC.",
        "AC=7+4=11 cm."
      ],
      "answer": "11 cm"
    }
  },
  "math.m13.t02": {
    "summary": "Uma transversal corta duas ou mais retas e forma pares de ângulos. Se as retas são paralelas, correspondentes e alternos são iguais, enquanto colaterais internos somam 180°.",
    "steps": [
      "Marque as duas paralelas e a transversal antes de escolher os pares.",
      "Use igualdade para correspondentes e alternos, ou suplemento para colaterais internos."
    ],
    "pitfall": "As igualdades entre alternos e correspondentes dependem do paralelismo; um desenho parecido não basta.",
    "example": {
      "question": "Uma transversal forma 65° com uma paralela. Qual o ângulo colateral interno?",
      "steps": [
        "Ângulos colaterais internos são suplementares: 180−65."
      ],
      "answer": "115°"
    }
  },
  "math.m13.t03": {
    "summary": "Triângulos se classificam por lados e por ângulos: equiláteros, isósceles ou escalenos; acutângulos, retângulos ou obtusângulos. A soma de dois lados deve ser maior que o terceiro.",
    "steps": [
      "Compare os lados e identifique o maior ângulo.",
      "Confira desigualdade triangular e soma interna de 180° para validar as medidas."
    ],
    "pitfall": "Um triângulo pode ser isósceles e retângulo ao mesmo tempo, pois são classificações por critérios diferentes.",
    "example": {
      "question": "Lados 5,5 e8 cm formam qual classificação?",
      "steps": [
        "Dois lados têm a mesma medida."
      ],
      "answer": "Isósceles"
    }
  },
  "math.m13.t04": {
    "summary": "A soma dos ângulos internos de um triângulo é 180°. Um polígono simples de n lados pode ser triangulado em n−2 triângulos, dando soma interna (n−2)180°.",
    "steps": [
      "Conte os lados e escolha a soma interna correspondente.",
      "Subtraia os ângulos conhecidos; só divida por n se os ângulos forem todos iguais."
    ],
    "pitfall": "Conhecer o número de lados determina a soma, mas não o valor de cada ângulo de um polígono irregular.",
    "example": {
      "question": "Ângulo interno de um hexágono regular?",
      "steps": [
        "(6−2)180/6=120."
      ],
      "answer": "120°"
    }
  },
  "math.m13.t05": {
    "summary": "Figuras congruentes têm mesma forma e tamanho; figuras semelhantes mantêm ângulos correspondentes e lados proporcionais. Nos triângulos, critérios como LAL ou AA evitam comparar todas as medidas.",
    "steps": [
      "Escolha o critério aplicável e identifique vértices correspondentes.",
      "Para semelhança, monte razões na mesma ordem e procure o fator comum."
    ],
    "pitfall": "Dois triângulos com apenas um ângulo igual não são necessariamente semelhantes.",
    "example": {
      "question": "Triângulos semelhantes têm lados6 e9. Razão menor/maior?",
      "steps": [
        "6/9=2/3."
      ],
      "answer": "2/3"
    }
  },
  "math.m13.t06": {
    "summary": "No teorema de Tales, um feixe de paralelas intercepta segmentos proporcionais em transversais. A correspondência correta entre os segmentos transforma a figura em uma proporção.",
    "steps": [
      "Identifique quais segmentos estão entre o mesmo par de paralelas.",
      "Escreva razões correspondentes e resolva a proporção."
    ],
    "pitfall": "Inverter apenas uma razão troca os segmentos correspondentes e altera a igualdade.",
    "example": {
      "question": "Paralelas determinam 4/6=x/9. x?",
      "steps": [
        "4/6=x/9;6x=36."
      ],
      "answer": "6"
    }
  },
  "math.m13.t07": {
    "summary": "Em um triângulo retângulo, o quadrado da hipotenusa é a soma dos quadrados dos catetos. A hipotenusa fica oposta ao ângulo de 90° e é o maior lado.",
    "steps": [
      "Localize o ângulo reto e nomeie os lados antes de substituir.",
      "Use c²=a²+b² e extraia a raiz positiva do comprimento procurado."
    ],
    "pitfall": "Pitágoras exige triângulo retângulo; a aparência do desenho não garante um ângulo de 90°.",
    "example": {
      "question": "Catetos6 e8: hipotenusa?",
      "steps": [
        "h²=36+64=100;h=10."
      ],
      "answer": "10 cm"
    }
  },
  "math.m13.t08": {
    "summary": "A altura relativa à hipotenusa divide o triângulo retângulo em dois triângulos semelhantes ao original. Se a hipotenusa c se divide em projeções m e n, valem h²=mn e cada cateto ao quadrado é c vezes sua projeção.",
    "steps": [
      "Identifique a hipotenusa, a altura e as projeções de cada cateto.",
      "Escolha a relação que contém os dados conhecidos e confira que c=m+n."
    ],
    "pitfall": "Não confunda a projeção de um cateto com o próprio cateto; eles ocupam segmentos diferentes.",
    "example": {
      "question": "Projeções4 e9: altura relativa?",
      "steps": [
        "h²=4·9=36;h=6."
      ],
      "answer": "6 cm"
    }
  },
  "math.m14.t01": {
    "summary": "Polígonos são figuras planas delimitadas por segmentos. Nos quadriláteros, paralelismo, igualdade de lados e diagonais permitem distinguir retângulos, losangos, paralelogramos e trapézios.",
    "steps": [
      "Liste as propriedades fornecidas sem pressupor que a figura está em escala.",
      "Use soma interna de 360° nos quadriláteros e propriedades da classe identificada."
    ],
    "pitfall": "Um losango não precisa ter ângulos retos; um retângulo não precisa ter os quatro lados iguais.",
    "example": {
      "question": "Soma dos ângulos internos de um pentágono?",
      "steps": [
        "(5−2)180=540."
      ],
      "answer": "540°"
    }
  },
  "math.m14.t02": {
    "summary": "Um polígono regular tem todos os lados e todos os ângulos internos iguais. Cada ângulo interno vale (n−2)180°/n, e cada externo suplementar vale 360°/n.",
    "steps": [
      "Determine o número de lados e a medida solicitada: interna, externa ou central.",
      "Use a fórmula apropriada e confira se interno mais externo soma 180°."
    ],
    "pitfall": "Regular exige igualdade de lados e ângulos; apenas uma dessas condições não é suficiente em geral.",
    "example": {
      "question": "Ângulo interno do octógono regular?",
      "steps": [
        "(8−2)180/8=135."
      ],
      "answer": "135°"
    }
  },
  "math.m14.t03": {
    "summary": "Perímetro soma o comprimento do contorno; área mede a região interior. Decompor uma figura em retângulos, triângulos ou outras partes conhecidas permite calcular áreas compostas.",
    "steps": [
      "Marque as partes que serão somadas ou subtraídas e converta todas as medidas.",
      "Use unidades lineares no perímetro e quadradas na área, evitando contar bordas internas."
    ],
    "pitfall": "Bordas entre duas partes de uma figura composta não pertencem necessariamente ao seu perímetro externo.",
    "example": {
      "question": "Retângulo8×3: área e perímetro?",
      "steps": [
        "A=24;P=22."
      ],
      "answer": "24 m² e22 m"
    }
  },
  "math.m14.t04": {
    "summary": "Heron fornece a área de um triângulo pelos três lados: A=√(s(s−a)(s−b)(s−c)). O semiperímetro s=(a+b+c)/2 deve ser calculado primeiro e os lados precisam formar um triângulo.",
    "steps": [
      "Verifique que a soma dos dois lados menores supera o maior.",
      "Calcule s e substitua os quatro fatores antes de extrair a raiz."
    ],
    "pitfall": "Usar o perímetro completo no lugar de s produz uma área errada.",
    "example": {
      "question": "Área de triângulo3,4,5?",
      "steps": [
        "s=6;A=√(6·3·2·1)=6."
      ],
      "answer": "6"
    }
  },
  "math.m14.t05": {
    "summary": "Circunferência é a curva a distância r de um centro; círculo inclui a região interior. O comprimento é 2πr, a área é πr² e o diâmetro mede 2r.",
    "steps": [
      "Decida se a questão pede contorno ou superfície.",
      "Converta diâmetro em raio quando necessário e use a unidade correspondente."
    ],
    "pitfall": "O raio aparece ao quadrado na área, mas não no comprimento da circunferência.",
    "example": {
      "question": "Área de círculo raio5?",
      "steps": [
        "A=π·25."
      ],
      "answer": "25π cm²"
    }
  },
  "math.m14.t06": {
    "summary": "Arcos e setores correspondem a uma fração da volta completa: θ/360° em graus. A coroa circular é a região entre círculos concêntricos, com área π(R²−r²).",
    "steps": [
      "Converta o ângulo central na fração da volta ou em radianos.",
      "Aplique essa fração ao comprimento ou à área; na coroa, subtraia as duas áreas."
    ],
    "pitfall": "A área da coroa é π(R²−r²), e não π(R−r)².",
    "example": {
      "question": "Setor raio6 e ângulo60: área?",
      "steps": [
        "60/360·π·36=6π."
      ],
      "answer": "6π cm²"
    }
  },
  "math.m14.t07": {
    "summary": "Um ângulo central tem vértice no centro; um inscrito tem vértice sobre a circunferência. Quando interceptam o mesmo arco, o inscrito mede metade do central.",
    "steps": [
      "Identifique o arco interceptado e a posição do vértice de cada ângulo.",
      "Compare apenas os ângulos associados ao mesmo arco."
    ],
    "pitfall": "Ângulos com vértices em posições diferentes não obedecem à mesma fórmula só por estarem no mesmo círculo.",
    "example": {
      "question": "Central100: inscrito no mesmo arco?",
      "steps": [
        "100/2=50."
      ],
      "answer": "50°"
    }
  },
  "math.m14.t08": {
    "summary": "A reta tangente toca a circunferência em um ponto e é perpendicular ao raio nesse contato. De um mesmo ponto externo, os dois segmentos tangentes possuem comprimentos iguais.",
    "steps": [
      "Trace os raios até os contatos e marque os ângulos retos.",
      "Use igualdade de tangentes ou Pitágoras no triângulo com o centro."
    ],
    "pitfall": "Um segmento secante cruza a circunferência em dois pontos e não pode ser tratado como tangente.",
    "example": {
      "question": "Tangentes PA ePB do mesmo ponto; PA=7. PB?",
      "steps": [
        "Tangentes são iguais."
      ],
      "answer": "7 cm"
    }
  },
  "math.m15.t01": {
    "summary": "Num triângulo retângulo, seno é cateto oposto sobre hipotenusa, cosseno é adjacente sobre hipotenusa e tangente é oposto sobre adjacente. O ângulo escolhido determina quais catetos são oposto e adjacente.",
    "steps": [
      "Marque o ângulo e identifique os três lados em relação a ele.",
      "Escolha a razão que envolve o dado conhecido e a incógnita, e resolva a igualdade."
    ],
    "pitfall": "Ao trocar o ângulo agudo de referência, oposto e adjacente trocam de papel.",
    "example": {
      "question": "Triângulo3,4,5: seno do ângulo oposto ao cateto3?",
      "steps": [
        "sen=3/5."
      ],
      "answer": "3/5"
    }
  },
  "math.m15.t02": {
    "summary": "Os valores de seno e cosseno de 30°, 45° e 60° vêm de triângulos especiais. No triângulo retângulo isósceles, catetos iguais explicam sen45°=cos45°=√2/2.",
    "steps": [
      "Reconheça o ângulo e escolha seno, cosseno ou tangente conforme os lados.",
      "Recupere os valores pelo triângulo especial ou use uma tabela, preservando as raízes exatas."
    ],
    "pitfall": "Sen30° é 1/2 e cos30° é √3/2; os valores se invertem em 60°.",
    "example": {
      "question": "Quanto vale cos60°?",
      "steps": [
        "No triângulo equilátero dividido, é metade da hipotenusa."
      ],
      "answer": "1/2"
    }
  },
  "math.m15.t03": {
    "summary": "A lei dos senos relaciona cada lado ao seno do ângulo oposto: a/sen A=b/sen B=c/sen C. Ela vale em qualquer triângulo, mas alguns dados podem permitir duas soluções geométricas.",
    "steps": [
      "Associe cada lado ao seu ângulo oposto e escolha um par completo.",
      "Monte a proporção e verifique se os ângulos encontrados formam um triângulo válido."
    ],
    "pitfall": "Resolver sen x=k pode dar x e 180°−x; confira qual ou quais cabem nas condições do triângulo.",
    "example": {
      "question": "a=10,A=30°,B=90°: b?",
      "steps": [
        "10/sen30=b/sen90; b=20."
      ],
      "answer": "20"
    }
  },
  "math.m15.t04": {
    "summary": "A lei dos cossenos generaliza Pitágoras: c²=a²+b²−2ab cos C. O ângulo C é o incluído entre os lados a e b; se C=90°, o termo com cosseno é zero.",
    "steps": [
      "Identifique os dois lados e o ângulo entre eles, ou os três lados conhecidos.",
      "Substitua na fórmula para encontrar c ou isole cos C para achar o ângulo."
    ],
    "pitfall": "Na fórmula de c, C é o ângulo oposto a c e situado entre a e b; usar outro ângulo muda a conta.",
    "example": {
      "question": "a=3,b=4,C=90°: c?",
      "steps": [
        "c²=9+16−0; c=5."
      ],
      "answer": "5"
    }
  },
  "math.m15.t05": {
    "summary": "No ciclo unitário, o ponto associado a θ tem coordenadas (cos θ, sen θ). Os quadrantes definem os sinais e uma volta de 2π rad repete o mesmo ponto.",
    "steps": [
      "Localize o ângulo no ciclo e identifique o quadrante.",
      "Leia o cosseno no eixo horizontal e o seno no vertical; tangente é sen/cos quando cos≠0."
    ],
    "pitfall": "A tangente não está definida onde cos θ=0; nesses pontos, não faça a divisão.",
    "example": {
      "question": "Sinal do seno no terceiro quadrante?",
      "steps": [
        "A coordenada y é negativa."
      ],
      "answer": "Negativo"
    }
  },
  "math.m15.t06": {
    "summary": "Seno e cosseno oscilam entre −1 e 1. Em y=a·sen(bx+c)+d, para b≠0, a amplitude é a distância entre a linha média e um extremo, isto é, valor absoluto de a, e o período é 2π/valor absoluto de b.",
    "steps": [
      "Identifique amplitude, período, fase e linha média na fórmula.",
      "Calcule extremos d mais ou menos a amplitude e interprete o intervalo de entrada."
    ],
    "pitfall": "Com deslocamento vertical, amplitude não é igual ao valor máximo da função.",
    "example": {
      "question": "Período de cos(3x)?",
      "steps": [
        "T=2π/3."
      ],
      "answer": "2π/3"
    }
  },
  "math.m15.t07": {
    "summary": "Graus e radianos são formas de medir ângulos: 360° corresponde a 2π rad. O radiano relaciona comprimento do arco ao raio, permitindo fórmulas como s=rθ quando θ está em radianos.",
    "steps": [
      "Para converter graus em radianos, multiplique por π/180.",
      "Para voltar a graus, multiplique por 180/π e simplifique."
    ],
    "pitfall": "Uma fórmula que exige radianos não pode receber diretamente o número de graus.",
    "example": {
      "question": "150° em radianos?",
      "steps": [
        "150π/180=5π/6."
      ],
      "answer": "5π/6"
    }
  },
  "math.m15.t08": {
    "summary": "Fenômenos periódicos repetem um padrão em intervalos regulares. Em modelos senoidais, máximos e mínimos determinam amplitude e linha média, e a distância entre dois picos determina o período.",
    "steps": [
      "Calcule linha média=(máximo+mínimo)/2 e amplitude=(máximo−mínimo)/2.",
      "Meça a repetição horizontal e ajuste o período à unidade de tempo do fenômeno."
    ],
    "pitfall": "O tempo entre um pico e o vale seguinte é metade do período num modelo senoidal simples.",
    "example": {
      "question": "Maré varia2–8m e repete12h: amplitude e média?",
      "steps": [
        "(8−2)/2=3;(8+2)/2=5."
      ],
      "answer": "3m e5m"
    }
  },
  "math.m16.t01": {
    "summary": "Um prisma possui duas bases congruentes e paralelas; uma pirâmide tem uma base e faces que se encontram no vértice. Para a mesma base e altura, o volume da pirâmide é um terço do volume do prisma.",
    "steps": [
      "Identifique a área da base e a altura perpendicular ao plano da base.",
      "Escolha V=Ab·h para prisma ou V=Ab·h/3 para pirâmide e confira a unidade cúbica."
    ],
    "pitfall": "Use a altura perpendicular à base; uma aresta inclinada não representa essa altura.",
    "example": {
      "question": "Um prisma tem área da base 12 cm² e altura 5 cm. Qual o volume?",
      "steps": [
        "V=Ab·h=12·5."
      ],
      "answer": "60 cm³"
    }
  },
  "math.m16.t02": {
    "summary": "Um paralelepípedo retângulo tem três dimensões perpendiculares: comprimento, largura e altura. Seu volume é abc; no cubo, todas as arestas são iguais e o volume é a³.",
    "steps": [
      "Liste comprimento, largura e altura e mantenha todas na mesma unidade.",
      "Multiplique as três dimensões; no cubo, use a³ e, se necessário, calcule diagonal por Pitágoras."
    ],
    "pitfall": "As fórmulas abc e √(a²+b²+c²) pressupõem um paralelepípedo retângulo.",
    "example": {
      "question": "Um paralelepípedo mede 2,3 e 4 cm. Qual o volume?",
      "steps": [
        "V=2·3·4."
      ],
      "answer": "24 cm³"
    }
  },
  "math.m16.t03": {
    "summary": "Cilindros e cones possuem bases circulares: seus volumes são πr²h e πr²h/3. A esfera tem volume 4πr³/3 e superfície 4πr²; identificar o sólido vem antes de escolher a fórmula.",
    "steps": [
      "Separe raio, altura e o fator geométrico da figura.",
      "Use πr²h, πr²h/3 ou 4πr³/3 conforme o sólido e confira o raio."
    ],
    "pitfall": "Raio e diâmetro não são intercambiáveis; se o dado for o diâmetro, divida-o por dois.",
    "example": {
      "question": "Qual é o volume de um cilindro de raio 2 e altura 5?",
      "steps": [
        "V=πr²h=π·4·5."
      ],
      "answer": "20π"
    }
  },
  "math.m16.t04": {
    "summary": "Planificar é abrir a superfície de um sólido no plano sem alterar as medidas de suas faces. A planificação ajuda a identificar faces vizinhas e calcular a quantidade de material necessária para revestir o sólido.",
    "steps": [
      "Associe cada face plana à superfície que ela representa no sólido.",
      "Some as áreas das faces sem sobrepor bordas nem esquecer faces ocultas."
    ],
    "pitfall": "Desenhos com o número correto de faces ainda podem não fechar o sólido sem sobreposição.",
    "example": {
      "question": "Ao planificar um cubo de aresta 3 cm, qual área aparece?",
      "steps": [
        "São 6 quadrados; A=6·3²."
      ],
      "answer": "54 cm²"
    }
  },
  "math.m16.t05": {
    "summary": "Área lateral reúne as superfícies fora das bases; área total inclui também todas as bases. Em um prisma reto, a área lateral é o perímetro da base vezes a altura; no cilindro reto, é 2πrh.",
    "steps": [
      "Identifique o sólido e se a pergunta inclui as bases.",
      "Em prismas retos, use perímetro da base vezes altura; para outros sólidos, some as áreas das faces ou use a fórmula específica."
    ],
    "pitfall": "A fórmula perímetro vezes altura não serve para toda pirâmide ou cone: considere suas faces ou geratrizes.",
    "example": {
      "question": "Um cilindro tem r=2,h=5. Qual sua área lateral?",
      "steps": [
        "Al=2πrh=2π·2·5."
      ],
      "answer": "20π"
    }
  },
  "math.m16.t06": {
    "summary": "Volume mede o espaço ocupado e é expresso em unidades cúbicas. Prismas e cilindros usam área da base vezes altura; pirâmides e cones usam um terço desse produto.",
    "steps": [
      "Escolha a fórmula que corresponde à base e à altura do sólido.",
      "Substitua medidas lineares coerentes e escreva o resultado em unidade cúbica."
    ],
    "pitfall": "Não use unidades de área para volume: 1 cm³ equivale a um cubo com aresta de 1 cm.",
    "example": {
      "question": "Uma caixa 4×3×2 cm tem qual volume?",
      "steps": [
        "Multiplique as três dimensões."
      ],
      "answer": "24 cm³"
    }
  },
  "math.m16.t07": {
    "summary": "Uma seção é a figura produzida ao cortar um sólido por um plano. Em sólidos semelhantes, multiplicar comprimentos por k multiplica áreas por k² e volumes por k³.",
    "steps": [
      "Determine o fator linear entre figura real, seção ou maquete.",
      "Aplique k a comprimentos, k² a áreas e k³ a volumes, sem misturar as potências."
    ],
    "pitfall": "A regra de escala exige semelhança; um corte qualquer não produz automaticamente uma cópia da base.",
    "example": {
      "question": "Uma maquete usa escala 1:10. Uma aresta real de 4 m mede quanto?",
      "steps": [
        "Converta 4 m para 400 cm; divida por 10."
      ],
      "answer": "40 cm"
    }
  },
  "math.m16.t08": {
    "summary": "Um tronco de cone ou de pirâmide resulta de um corte paralelo à base. Se B e b são as áreas das bases e h a altura perpendicular, seu volume é h(B+b+√(Bb))/3.",
    "steps": [
      "Identifique as duas bases paralelas e a altura perpendicular.",
      "Use V=h(B+b+√Bb)/3 e interprete B e b como áreas, não como lados."
    ],
    "pitfall": "B e b são áreas, não raios nem comprimentos de lados; a fórmula requer bases paralelas semelhantes.",
    "example": {
      "question": "Um tronco de pirâmide tem bases 9 e 4 cm² e altura 3. Qual volume?",
      "steps": [
        "V=h(B+b+√(Bb))/3=3(9+4+6)/3."
      ],
      "answer": "19 cm³"
    }
  },
  "math.m17.t01": {
    "summary": "A distância entre dois pontos é o comprimento do segmento que os liga. No plano cartesiano, Pitágoras fornece d=√((x₂−x₁)²+(y₂−y₁)²).",
    "steps": [
      "Calcule as diferenças horizontal e vertical entre as coordenadas.",
      "Aplique d=√(Δx²+Δy²), preservando o sinal até elevar ao quadrado."
    ],
    "pitfall": "Mantenha a mesma ordem nas duas diferenças e lembre que distância nunca é negativa.",
    "example": {
      "question": "Distância entre (1,2) e (4,6)?",
      "steps": [
        "Δx=3,Δy=4; d=√(9+16)."
      ],
      "answer": "5"
    }
  },
  "math.m17.t02": {
    "summary": "O ponto médio divide um segmento em duas partes iguais. Suas coordenadas são as médias das coordenadas correspondentes: M=((x₁+x₂)/2,(y₁+y₂)/2).",
    "steps": [
      "Some coordenadas correspondentes dos extremos.",
      "Divida cada soma por dois e verifique que o ponto fica equidistante dos extremos."
    ],
    "pitfall": "Calcule as duas médias separadamente; não misture a coordenada x de um ponto com a y do outro.",
    "example": {
      "question": "Ponto médio de (2,1) e (6,5)?",
      "steps": [
        "M=((2+6)/2,(1+5)/2)."
      ],
      "answer": "(4,3)"
    }
  },
  "math.m17.t03": {
    "summary": "O coeficiente angular mede quanto y varia por unidade de x em uma reta: m=(y₂−y₁)/(x₂−x₁). Seu sinal informa a direção da reta e sua unidade depende dos eixos.",
    "steps": [
      "Subtraia y e x na mesma ordem para os dois pontos.",
      "Use m=Δy/Δx e reconheça que retas verticais não têm coeficiente angular finito."
    ],
    "pitfall": "Quando x₂=x₁, a reta é vertical e a divisão por zero impede um coeficiente angular finito.",
    "example": {
      "question": "Inclinação entre (1,2) e (3,8)?",
      "steps": [
        "m=(8−2)/(3−1)."
      ],
      "answer": "3"
    }
  },
  "math.m17.t04": {
    "summary": "Uma reta não vertical pode ser escrita como y=mx+b ou y−y₀=m(x−x₀). A forma geral Ax+By+C=0 também representa retas verticais, como x=3.",
    "steps": [
      "Escolha forma ponto-inclinação ou y=mx+b conforme os dados.",
      "Substitua um ponto para determinar o termo independente e teste na equação original."
    ],
    "pitfall": "Nem toda reta admite y=mx+b; trate x constante como um caso vertical.",
    "example": {
      "question": "Reta com m=2 passando por (1,3)?",
      "steps": [
        "y−3=2(x−1); expanda."
      ],
      "answer": "y=2x+1"
    }
  },
  "math.m17.t05": {
    "summary": "Retas não verticais paralelas têm o mesmo coeficiente angular; retas perpendiculares têm produto dos coeficientes igual a −1. Uma reta horizontal e uma vertical também são perpendiculares.",
    "steps": [
      "Compare coeficientes angulares quando as retas não são verticais.",
      "Para perpendicularidade, use m1·m2=−1 e trate separadamente retas verticais e horizontais."
    ],
    "pitfall": "Coeficientes iguais podem indicar retas coincidentes; compare também seus interceptos.",
    "example": {
      "question": "Qual inclinação é perpendicular a m=2?",
      "steps": [
        "Produto das inclinações deve ser −1."
      ],
      "answer": "−1/2"
    }
  },
  "math.m17.t06": {
    "summary": "A interseção de duas retas é o ponto que satisfaz suas duas equações. Resolver o sistema revela um ponto, nenhuma interseção ou infinitos pontos quando as retas coincidem.",
    "steps": [
      "Iguale as expressões de y ou resolva o sistema das duas equações.",
      "Substitua a coordenada encontrada na outra reta e escreva o ponto ordenado."
    ],
    "pitfall": "Uma equação que vira 0=0 indica dependência, não que qualquer ponto do plano serve.",
    "example": {
      "question": "Interseção y=x+1 e y=3x−3?",
      "steps": [
        "Iguale: x+1=3x−3; 2x=4."
      ],
      "answer": "(2,3)"
    }
  },
  "math.m17.t07": {
    "summary": "A circunferência reúne os pontos a distância r de um centro (a,b). Sua equação é (x−a)²+(y−b)²=r²; completar quadrados ajuda a identificar centro e raio em uma equação expandida.",
    "steps": [
      "Leia centro e raio na forma (x−a)²+(y−b)²=r².",
      "Substitua um ponto para testar pertencimento ou desenvolva a equação preservando os sinais do centro."
    ],
    "pitfall": "O centro aparece com sinais invertidos dentro dos quadrados: (y+1)² corresponde a b=−1.",
    "example": {
      "question": "Centro (2,−1), raio 3: equação?",
      "steps": [
        "Use (x−a)²+(y−b)²=r²."
      ],
      "answer": "(x−2)²+(y+1)²=9"
    }
  },
  "math.m17.t08": {
    "summary": "Coordenadas permitem calcular áreas sem medir alturas diretamente. Para um triângulo, use metade do valor absoluto do determinante das coordenadas; bases e alturas visíveis também podem simplificar a conta.",
    "steps": [
      "Organize os vértices na ordem em que percorrem o contorno.",
      "Use a fórmula do determinante (shoelace) e tome o valor absoluto dividido por dois."
    ],
    "pitfall": "O determinante pode ser negativo por causa da ordem dos vértices; a área usa seu valor absoluto.",
    "example": {
      "question": "Área do triângulo (0,0),(4,0),(0,3)?",
      "steps": [
        "Base 4 e altura 3; A=bh/2."
      ],
      "answer": "6"
    }
  },
  "math.m18.t01": {
    "summary": "Uma distribuição de frequência registra quantas vezes cada valor ou classe aparece. A soma das frequências absolutas fornece o total; dividir cada frequência pelo total fornece a frequência relativa.",
    "steps": [
      "Distinga valor observado, frequência absoluta e frequência acumulada.",
      "Some frequências para o total e use a coluna acumulada para localizar posições."
    ],
    "pitfall": "Frequência relativa e absoluta são grandezas diferentes; confira se a tabela apresenta contagens ou percentuais.",
    "example": {
      "question": "Valores 1,2,3 têm frequências 2,3,1. Total?",
      "steps": [
        "Some as frequências."
      ],
      "answer": "6"
    }
  },
  "math.m18.t02": {
    "summary": "Tabelas organizam valores e unidades; gráficos tornam comparações visuais. Barras, linhas e setores respondem a perguntas diferentes, por isso leia título, legenda, escalas e período antes de concluir.",
    "steps": [
      "Leia título, eixos, unidades e escala antes de comparar alturas.",
      "Converta frequência em percentual dividindo pelo total e multiplique por 100."
    ],
    "pitfall": "Uma barra duas vezes mais alta só representa o dobro quando a escala e a origem permitem essa comparação.",
    "example": {
      "question": "Em gráfico, 20 de 50 alunos preferem A. Percentual?",
      "steps": [
        "20/50·100."
      ],
      "answer": "40%"
    }
  },
  "math.m18.t03": {
    "summary": "A média simples é a soma dividida pelo número de observações. Na média ponderada, cada valor é multiplicado por seu peso e a soma é dividida pela soma dos pesos.",
    "steps": [
      "Decida se todos os valores têm o mesmo peso ou se há frequências/pesos.",
      "Some x ou x·p e divida por n ou pela soma dos pesos, respectivamente."
    ],
    "pitfall": "Não divida uma soma ponderada pela quantidade de notas quando os pesos são diferentes.",
    "example": {
      "question": "Notas 6 peso1 e 8 peso2. Média?",
      "steps": [
        "(6·1+8·2)/(1+2)."
      ],
      "answer": "22/3"
    }
  },
  "math.m18.t04": {
    "summary": "Mediana é o centro da lista ordenada; em listas pares, é a média dos dois valores centrais. Moda é o valor mais frequente, podendo haver mais de uma moda ou nenhuma moda única.",
    "steps": [
      "Ordene os dados antes de procurar a posição central.",
      "Para n par, faça a média dos dois centrais; conte frequências para encontrar a moda."
    ],
    "pitfall": "Escolher o elemento do meio antes de ordenar a lista pode produzir uma mediana errada.",
    "example": {
      "question": "Mediana de 2,5,5,8,10?",
      "steps": [
        "Lista ordenada; termo central."
      ],
      "answer": "5"
    }
  },
  "math.m18.t05": {
    "summary": "Amplitude é a diferença entre o maior e o menor valor de um conjunto. É uma medida simples de dispersão, mas não revela como os valores intermediários se distribuem.",
    "steps": [
      "Localize o maior e o menor valor observados.",
      "Subtraia mínimo de máximo e mantenha a mesma unidade da variável."
    ],
    "pitfall": "Uma única observação extrema pode aumentar muito a amplitude sem mudar a maioria dos dados.",
    "example": {
      "question": "Amplitude de 4,9,12,3?",
      "steps": [
        "Máximo−mínimo=12−3."
      ],
      "answer": "9"
    }
  },
  "math.m18.t06": {
    "summary": "Quartis dividem dados ordenados em quatro partes: Q2 é a mediana, e Q1 e Q3 delimitam os 50% centrais. Existem convenções diferentes de cálculo; siga a informada no problema.",
    "steps": [
      "Ordene a amostra e divida-a nas metades inferior e superior.",
      "Calcule Q1 e Q3 pelas posições adotadas e interprete IQR=Q3−Q1 como dispersão central."
    ],
    "pitfall": "Métodos diferentes podem dar quartis distintos em amostras pequenas; declare a convenção usada.",
    "example": {
      "question": "Para os dados 1, 2, 3, 4, 5, 6, 7, calcule Q1 pela convenção das metades sem incluir a mediana.",
      "steps": [
        "Mediana da metade inferior 1,2,3."
      ],
      "answer": "2"
    }
  },
  "math.m18.t07": {
    "summary": "A variância descreve a média dos quadrados das distâncias até a média. O desvio padrão é sua raiz quadrada e volta à unidade original dos dados; variância populacional divide por N e a amostral usual divide por n−1.",
    "steps": [
      "Calcule a média e os desvios de cada observação em relação a ela.",
      "Eleve desvios ao quadrado, faça a média apropriada e extraia a raiz para o desvio padrão."
    ],
    "pitfall": "Diferencie a fórmula populacional da estimativa amostral antes de escolher o denominador.",
    "example": {
      "question": "Dados 2,4 têm média 3. Variância populacional?",
      "steps": [
        "Desvios −1,+1; quadrados somam2; divida por2."
      ],
      "answer": "1"
    }
  },
  "math.m18.t08": {
    "summary": "Um gráfico pode usar números corretos e ainda exagerar diferenças ao truncar eixos, alterar intervalos ou ampliar desenhos em várias dimensões. Conferir os valores originais permite avaliar a impressão visual.",
    "steps": [
      "Verifique se o eixo começa em zero, usa intervalos iguais e mantém unidade constante.",
      "Compare proporções e escalas, pois barras visualmente maiores não provam diferenças grandes."
    ],
    "pitfall": "Em gráficos de barras, uma origem truncada pode transformar uma diferença pequena em aparente grande salto.",
    "example": {
      "question": "Eixo vertical começa em 90 e vai a100. Por que comparar barras é arriscado?",
      "steps": [
        "A escala truncada amplia diferenças visuais."
      ],
      "answer": "A escala truncada distorce a percepção."
    }
  },
  "math.m19.t01": {
    "summary": "O princípio fundamental da contagem multiplica o número de escolhas disponíveis em etapas sucessivas. As opções podem diminuir após cada escolha, como ao selecionar objetos sem repetição.",
    "steps": [
      "Separe as decisões em etapas e conte quantas opções válidas restam em cada uma.",
      "Multiplique as contagens das etapas; se as opções variarem conforme a escolha anterior, separe em casos."
    ],
    "pitfall": "Multiplicar contagens de escolhas não exige independência probabilística, mas exige contar as opções válidas em cada etapa.",
    "example": {
      "question": "3 camisas e 2 calças: combinações?",
      "steps": [
        "Multiplique escolhas independentes."
      ],
      "answer": "6"
    }
  },
  "math.m19.t02": {
    "summary": "Um diagrama de árvore representa cada sequência de escolhas como um caminho de ramos. Contar as folhas válidas organiza possibilidades e ajuda a visualizar restrições e probabilidades por etapas.",
    "steps": [
      "Desenhe um ramo para cada escolha e repita a estrutura em cada etapa.",
      "Conte folhas ou some probabilidades nos caminhos desejados, sem duplicar trajetórias."
    ],
    "pitfall": "Dois caminhos diferentes podem gerar o mesmo resultado final; confira o que o enunciado considera distinto.",
    "example": {
      "question": "Moeda e dado: resultados possíveis?",
      "steps": [
        "2 ramos para cada um dos 6 resultados."
      ],
      "answer": "12"
    }
  },
  "math.m19.t03": {
    "summary": "Permutação simples conta as ordens possíveis de todos os n objetos distintos. Há n escolhas para a primeira posição, n−1 para a segunda, e assim por diante: n! maneiras.",
    "steps": [
      "Verifique que todos os elementos distintos serão usados e que a ordem importa.",
      "Calcule n!=n·(n−1)·…·1 e interprete cada fator como uma posição preenchida."
    ],
    "pitfall": "n! pressupõe objetos distintos e uso de todos eles; escolher apenas parte exige outra contagem.",
    "example": {
      "question": "Quantas ordens para 4 livros?",
      "steps": [
        "4!=4·3·2·1."
      ],
      "answer": "24"
    }
  },
  "math.m19.t04": {
    "summary": "Quando há objetos indistinguíveis, trocar suas posições não gera uma nova ordem. Divida n! pelo produto dos fatoriais das quantidades repetidas para evitar contar essas trocas novamente.",
    "steps": [
      "Conte o total de posições e as multiplicidades de cada elemento repetido.",
      "Use n!/(a!b!…) para retirar trocas que não produzem nova ordem."
    ],
    "pitfall": "Não divida apenas pela quantidade de objetos repetidos: cada grupo exige seu fatorial.",
    "example": {
      "question": "Anagramas de ANA?",
      "steps": [
        "3!/2! porque A repete."
      ],
      "answer": "3"
    }
  },
  "math.m19.t05": {
    "summary": "Arranjo escolhe k objetos distintos entre n e atribui uma ordem a eles. Sem repetição, A(n,k)=n!/(n−k)!; cargos diferentes ou posições de senha tornam a ordem relevante.",
    "steps": [
      "Escolha p posições entre n e mantenha a ordem como informação relevante.",
      "Calcule A(n,p)=n!/(n−p)! ou multiplique p fatores decrescentes."
    ],
    "pitfall": "Se trocar as posições não muda o resultado, o problema pede uma combinação, não um arranjo.",
    "example": {
      "question": "Pódio de 3 entre 5 atletas?",
      "steps": [
        "A(5,3)=5·4·3."
      ],
      "answer": "60"
    }
  },
  "math.m19.t06": {
    "summary": "Combinação escolhe um grupo de k objetos entre n sem considerar sua ordem. C(n,k)=n!/(k!(n−k)!), pois cada grupo foi contado k! vezes nos arranjos.",
    "steps": [
      "Confirme que trocar a ordem não cria um grupo diferente.",
      "Calcule C(n,p)=n!/[p!(n−p)!] e elimine a contagem repetida das permutações."
    ],
    "pitfall": "Distinguir presidente de vice torna a ordem relevante e impede usar combinação para a dupla de cargos.",
    "example": {
      "question": "Escolher 2 de 5?",
      "steps": [
        "C(5,2)=5·4/2."
      ],
      "answer": "10"
    }
  },
  "math.m19.t07": {
    "summary": "Restrições reduzem as escolhas permitidas: não repetir dígitos, manter pessoas juntas ou separar casos. Conte diretamente os caminhos válidos ou subtraia do total os casos proibidos.",
    "steps": [
      "Conte primeiro o universo e identifique a condição que elimina ou fixa posições.",
      "Separe casos disjuntos ou use complemento e evite contar uma configuração duas vezes."
    ],
    "pitfall": "Ao separar em casos, eles precisam ser disjuntos ou você deverá corrigir as sobreposições.",
    "example": {
      "question": "Senhas de 2 dígitos distintos usando 1,2,3?",
      "steps": [
        "3 escolhas e depois2."
      ],
      "answer": "6"
    }
  },
  "math.m19.t08": {
    "summary": "Use soma para alternativas que não podem ocorrer juntas e produto para etapas sucessivas. Quando os casos se sobrepõem, a soma precisa descontar a interseção para não repetir resultados.",
    "steps": [
      "Use soma para alternativas mutuamente exclusivas e produto para etapas combinadas.",
      "Teste se os casos se sobrepõem; se houver interseção, ajuste a contagem."
    ],
    "pitfall": "A palavra 'ou' não garante casos disjuntos; verifique se um resultado pode pertencer às duas alternativas.",
    "example": {
      "question": "Você pode escolher uma sobremesa entre 3 opções ou uma bebida entre 4 opções, mas apenas um item. Quantas escolhas existem?",
      "steps": [
        "As duas alternativas são disjuntas: o item escolhido é sobremesa ou bebida.",
        "Some 3+4=7 escolhas."
      ],
      "answer": "7 opções"
    }
  },
  "math.m20.t01": {
    "summary": "O espaço amostral reúne todos os resultados do experimento; um evento é um subconjunto desses resultados. Definir o resultado elementar evita confundir uma sequência ordenada com um conjunto.",
    "steps": [
      "Liste resultados elementares compatíveis com o experimento.",
      "Represente o evento como subconjunto de Ω antes de calcular ou contar."
    ],
    "pitfall": "Em dois lançamentos, (1,2) e (2,1) são resultados distintos quando a ordem dos lançamentos é registrada.",
    "example": {
      "question": "Lançar dado: evento par?",
      "steps": [
        "Ω={1..6}; E={2,4,6}."
      ],
      "answer": "E={2,4,6}"
    }
  },
  "math.m20.t02": {
    "summary": "Resultados equiprováveis têm a mesma chance de ocorrer. Somente nesse caso a probabilidade de um evento é o número de resultados favoráveis dividido pelo total do espaço amostral.",
    "steps": [
      "Confirme que cada resultado elementar tem a mesma probabilidade.",
      "Divida casos favoráveis por casos possíveis e simplifique a fração."
    ],
    "pitfall": "A soma de dois dados não tem resultados equiprováveis: 7 aparece em mais pares que 2.",
    "example": {
      "question": "Probabilidade de sair 5 num dado justo?",
      "steps": [
        "1 caso favorável/6 possíveis."
      ],
      "answer": "1/6"
    }
  },
  "math.m20.t03": {
    "summary": "O evento complementar contém todos os resultados fora de A e tem probabilidade 1−P(A). É útil quando calcular nenhum sucesso é mais simples que somar todos os casos com algum sucesso.",
    "steps": [
      "Defina claramente o evento contrário, incluindo todos os resultados que faltam.",
      "Use P(Ac)=1−P(A), sobretudo quando “ao menos um” for mais fácil pelo nenhum."
    ],
    "pitfall": "'Ao menos um' inclui um, dois ou mais; seu complemento é nenhum, não apenas exatamente um fracasso.",
    "example": {
      "question": "Probabilidade de ao menos um 6 em dois dados?",
      "steps": [
        "P(nenhum6)=(5/6)²; subtraia de1."
      ],
      "answer": "11/36"
    }
  },
  "math.m20.t04": {
    "summary": "União significa ocorrer A ou B; interseção significa ocorrer A e B. A regra P(A∪B)=P(A)+P(B)−P(A∩B) corrige a dupla contagem dos resultados comuns.",
    "steps": [
      "Identifique se a pergunta pede A ou B, ou A e B.",
      "Use P(A∪B)=P(A)+P(B)−P(A∩B) para não somar a interseção duas vezes."
    ],
    "pitfall": "Eventos mutuamente exclusivos têm interseção vazia; isso não é o mesmo que independência.",
    "example": {
      "question": "P(A)=0,5,P(B)=0,4,P(A∩B)=0,2. P(A∪B)?",
      "steps": [
        "Some e subtraia interseção."
      ],
      "answer": "0,7"
    }
  },
  "math.m20.t05": {
    "summary": "Eventos independentes não alteram as chances um do outro. Para eles, P(A∩B)=P(A)P(B); retiradas sem reposição geralmente exigem probabilidades condicionais.",
    "steps": [
      "Verifique se conhecer um evento não altera a chance do outro.",
      "Use P(A∩B)=P(A)P(B) apenas após confirmar independência."
    ],
    "pitfall": "Não assuma independência só porque os eventos têm nomes diferentes ou acontecem em momentos diferentes.",
    "example": {
      "question": "Duas moedas: duas caras?",
      "steps": [
        "Multiplique 1/2·1/2."
      ],
      "answer": "1/4"
    }
  },
  "math.m20.t06": {
    "summary": "Probabilidade condicional considera B como o novo universo: P(A|B)=P(A∩B)/P(B), com P(B)>0. A informação recebida muda quais resultados ainda são possíveis.",
    "steps": [
      "Restrinja o espaço amostral à informação já ocorrida.",
      "Calcule P(A|B)=P(A∩B)/P(B), exigindo P(B)>0."
    ],
    "pitfall": "P(A|B) e P(B|A) não são iguais em geral, porque o conjunto usado como denominador muda.",
    "example": {
      "question": "Urna 3 azuis,2 vermelhas; após azul sem reposição, chance azul?",
      "steps": [
        "Restam2 azuis de4 bolas."
      ],
      "answer": "1/2"
    }
  },
  "math.m20.t07": {
    "summary": "Combinatória ajuda a contar casos favoráveis e possíveis em experimentos equiprováveis. Use a mesma convenção de ordem nos dois conjuntos para formar uma razão coerente.",
    "steps": [
      "Conte resultados favoráveis e totais no mesmo modelo de seleção.",
      "Use arranjos quando a ordem importa e combinações quando o grupo não tem ordem."
    ],
    "pitfall": "Não conte grupos sem ordem no numerador e sequências ordenadas no denominador sem ajustar a contagem.",
    "example": {
      "question": "Escolhendo 2 pessoas entre 5 ao acaso, qual a probabilidade de sair uma dupla específica?",
      "steps": [
        "O total de duplas é C(5,2)=10.",
        "Há 1 dupla favorável, então P=1/10."
      ],
      "answer": "1/10"
    }
  },
  "math.m20.t08": {
    "summary": "Em várias etapas, multiplique as probabilidades condicionais ao longo de cada caminho. Some as probabilidades de caminhos disjuntos que realizam o evento pedido.",
    "steps": [
      "Represente cada etapa e atualize as chances quando houver dependência.",
      "Multiplique probabilidades condicionais ao longo do caminho e some caminhos alternativos."
    ],
    "pitfall": "Sem reposição, atualize numerador e denominador após cada retirada; as chances não permanecem fixas.",
    "example": {
      "question": "Duas retiradas sem reposição, ambas vermelhas em 3V2A?",
      "steps": [
        "3/5·2/4."
      ],
      "answer": "3/10"
    }
  },
  "math.m21.t01": {
    "summary": "Capitalização composta aplica juros ao saldo acumulado: M=C(1+i)^n. Cada período multiplica o anterior pelo mesmo fator, enquanto os juros simples usam sempre o capital inicial.",
    "steps": [
      "Identifique capital, taxa por período e número de períodos compatíveis.",
      "Use M=C(1+i)^n e calcule juros como M−C, sem somar taxas de períodos diferentes."
    ],
    "pitfall": "Não use a fórmula composta com taxa e número de períodos expressos em unidades diferentes.",
    "example": {
      "question": "R$1000 a10% por2 períodos?",
      "steps": [
        "M=1000·1,1²."
      ],
      "answer": "R$1210"
    }
  },
  "math.m21.t02": {
    "summary": "Taxas equivalentes produzem o mesmo fator de crescimento no mesmo intervalo. No regime composto, uma taxa mensal i corresponde à anual (1+i)^12−1, e não simplesmente 12i.",
    "steps": [
      "Converta taxas para o mesmo horizonte de comparação.",
      "Iguale fatores (1+i)^n e extraia a raiz correspondente ao novo período."
    ],
    "pitfall": "Dividir uma taxa efetiva anual por 12 não fornece, em geral, sua taxa efetiva mensal equivalente.",
    "example": {
      "question": "Taxa mensal de1% por12 meses, fator?",
      "steps": [
        "Fator=(1,01)^12."
      ],
      "answer": "≈1,1268"
    }
  },
  "math.m21.t03": {
    "summary": "Valor futuro leva uma quantia para uma data posterior por capitalização. Valor presente desfaz esse processo: VP=VF/(1+i)^n; comparar pagamentos exige trazê-los à mesma data.",
    "steps": [
      "Defina a data de referência e o fluxo que será descontado ou capitalizado.",
      "Use VF=VP(1+i)^n ou VP=VF/(1+i)^n para trazer valores à mesma data."
    ],
    "pitfall": "Somar um pagamento de hoje com outro futuro sem escolher uma taxa de comparação ignora o valor do dinheiro no tempo.",
    "example": {
      "question": "Valor presente de R$1100 em1 ano a10%?",
      "steps": [
        "VP=1100/1,1."
      ],
      "answer": "R$1000"
    }
  },
  "math.m21.t04": {
    "summary": "Parcelamentos distribuem pagamentos por várias datas. Com juros, o valor financiado deve igualar a soma dos valores presentes das prestações; sem juros e com parcelas iguais, basta dividir o total.",
    "steps": [
      "Liste entrada, prestações, prazo e taxa da operação.",
      "Compare o valor presente das parcelas ou some pagamentos com seus encargos no mesmo instante."
    ],
    "pitfall": "Somar parcelas nominais informa o desembolso total, mas não basta para comparar opções pagas em datas diferentes.",
    "example": {
      "question": "Dívida R$1200 em 3 parcelas sem juros?",
      "steps": [
        "Divida principal por3."
      ],
      "answer": "R$400"
    }
  },
  "math.m21.t05": {
    "summary": "A comparação matemática entre aplicações exige o mesmo capital, horizonte e regras de taxa, incluindo custos informados. Converta os valores para uma data comum antes de comparar os montantes.",
    "steps": [
      "Fixe capital, prazo e unidade de taxa para todas as opções.",
      "Calcule o fator final e compare valores líquidos, custos e risco, não apenas a taxa anunciada."
    ],
    "pitfall": "Maior taxa anunciada não garante maior valor líquido; confira período, tributos, custos e hipóteses do problema.",
    "example": {
      "question": "Investimento A rende 10% simples e B 10% composto em2 anos. Qual cresce mais?",
      "steps": [
        "A fator1,2; B fator1,21."
      ],
      "answer": "B"
    }
  },
  "math.m21.t06": {
    "summary": "Inflação acumulada multiplica fatores de variação dos preços: (1+i₁)(1+i₂)…−1. O poder de compra depende desse fator acumulado, não da soma simples das taxas.",
    "steps": [
      "Converta cada inflação em fator multiplicativo, não em soma automática.",
      "Multiplique fatores de cada período e subtraia um para obter a inflação acumulada."
    ],
    "pitfall": "Uma alta de 10% seguida de queda de 10% resulta em queda acumulada de 1%, pois as bases mudam.",
    "example": {
      "question": "Inflações 5% e 10% acumuladas?",
      "steps": [
        "Fator1,05·1,10−1."
      ],
      "answer": "15,5%"
    }
  },
  "math.m21.t07": {
    "summary": "O juro real desconta a variação de preços do ganho nominal: 1+r=(1+i)/(1+π), no mesmo período. 'Nominal' também pode indicar taxa anunciada com capitalização em outro intervalo; identifique o uso no enunciado.",
    "steps": [
      "Distinga taxa nominal, inflação e taxa real no mesmo período.",
      "Use (1+nominal)/(1+inflação)−1 e explique o poder de compra resultante."
    ],
    "pitfall": "Subtrair inflação do rendimento é apenas uma aproximação; a razão dos fatores fornece a taxa real exata.",
    "example": {
      "question": "Juro nominal10%, inflação4%: real aproximado?",
      "steps": [
        "Fator real=1,10/1,04−1."
      ],
      "answer": "≈5,77%"
    }
  },
  "math.m22.t01": {
    "summary": "Funções por partes usam regras diferentes conforme o intervalo da entrada. Para calcular um valor, escolha primeiro a condição que o contém; os pontos de fronteira exigem atenção aos sinais de igualdade.",
    "steps": [
      "Leia as condições dos intervalos antes de escolher uma expressão.",
      "Selecione o ramo correto, calcule o valor e verifique o limite nos pontos de troca."
    ],
    "pitfall": "Aplicar todas as fórmulas ao mesmo x ou ignorar quem inclui a fronteira cria resultados ambíguos.",
    "example": {
      "question": "f(x)=x se x≥0 e −x se x<0; f(−3)?",
      "steps": [
        "Escolha o ramo x<0."
      ],
      "answer": "3"
    }
  },
  "math.m22.t02": {
    "summary": "O módulo |x| é a distância de x até zero, portanto nunca é negativo. Pode ser escrito como x para x≥0 e −x para x<0, permitindo resolver situações por casos.",
    "steps": [
      "Interprete |x−a| como distância de x a a na reta.",
      "Resolva os dois casos x−a=k e x−a=−k quando k≥0 e rejeite k<0."
    ],
    "pitfall": "Em |u|=a, há dois casos u=±a quando a>0, apenas u=0 quando a=0 e nenhuma solução quando a<0.",
    "example": {
      "question": "|x−2|=5: soluções?",
      "steps": [
        "x−2=5 ou x−2=−5."
      ],
      "answer": "x=7 ou −3"
    }
  },
  "math.m22.t03": {
    "summary": "Uma fórmula impõe padrões ao gráfico: interceptos, simetrias e comportamento em intervalos. Use pontos conhecidos e restrições de domínio para testar qual representação corresponde à outra.",
    "steps": [
      "Use interceptos, inclinação, raízes e domínio para ligar fórmula e desenho.",
      "Substitua pontos do gráfico na expressão e confira se todos os sinais coincidem."
    ],
    "pitfall": "Dois ou três pontos podem pertencer a várias curvas; confirme também o formato e as hipóteses do modelo.",
    "example": {
      "question": "f(x)=2x+1 cruza y em?",
      "steps": [
        "Substitua x=0."
      ],
      "answer": "1"
    }
  },
  "math.m22.t04": {
    "summary": "Otimizar é escolher o maior ou menor valor permitido pelas restrições do contexto. Monte uma expressão para a grandeza, determine o domínio e compare candidatos interiores e extremos do intervalo.",
    "steps": [
      "Escreva a grandeza a otimizar em uma variável usando as restrições.",
      "Encontre vértice, extremos ou compare fronteiras e interprete a solução no contexto."
    ],
    "pitfall": "O vértice de uma parábola pode estar fora do domínio físico; ele não é automaticamente a resposta do problema.",
    "example": {
      "question": "Retângulo perímetro20, maior área?",
      "steps": [
        "Lados somam10; produto máximo quando iguais."
      ],
      "answer": "25"
    }
  },
  "math.m22.t05": {
    "summary": "Na composição de modelos, a saída de uma regra vira entrada da seguinte: (f∘g)(x)=f(g(x)). Unidades e domínios precisam ser compatíveis nessa passagem.",
    "steps": [
      "Identifique qual modelo recebe a saída do outro.",
      "Calcule primeiro a função interna e só então aplique a externa, respeitando domínios."
    ],
    "pitfall": "A ordem importa: f(g(x)) geralmente é diferente de g(f(x)); confira também se g(x) pertence ao domínio de f.",
    "example": {
      "question": "f(x)=2x+1,g(x)=x²; f(g(3))?",
      "steps": [
        "g(3)=9; f(9)=19."
      ],
      "answer": "19"
    }
  },
  "math.m22.t06": {
    "summary": "Modelos não lineares incluem relações quadráticas, exponenciais e inversas. Neles, a variação por unidade de entrada não é constante; o padrão dos dados ajuda a escolher uma família de funções.",
    "steps": [
      "Reconheça crescimento por potência, exponencial ou outra curva pela variação dos dados.",
      "Escolha parâmetros com dados conhecidos e teste o modelo em um ponto não usado."
    ],
    "pitfall": "Uma curva ajustada a poucos pontos não deve ser tratada como lei válida em qualquer intervalo.",
    "example": {
      "question": "Crescimento P=100·2^t após3 períodos?",
      "steps": [
        "Substitua t=3."
      ],
      "answer": "800"
    }
  },
  "math.m22.t07": {
    "summary": "Crescimento linear soma uma quantidade fixa; exponencial multiplica por um fator fixo. Com fator maior que 1 e horizonte suficiente, a exponencial supera um crescimento linear, mas pode começar abaixo dele.",
    "steps": [
      "Compare taxas absolutas constantes com fatores multiplicativos por período.",
      "Calcule os dois modelos no mesmo horizonte e procure o ponto em que a exponencial supera a linear."
    ],
    "pitfall": "Comparar só o primeiro ou o último valor mostrado pode esconder o ponto em que os modelos trocam de ordem.",
    "example": {
      "question": "Em t=5, 10t ou 2^t é maior?",
      "steps": [
        "Calcule50 e32."
      ],
      "answer": "10t"
    }
  },
  "math.m23.t01": {
    "summary": "Amostragem observa parte de uma população para estimar suas características. Representatividade depende do método de seleção, cobertura dos grupos e não resposta; tamanho sozinho não resolve esses problemas.",
    "steps": [
      "Defina população-alvo e unidade de seleção antes de coletar dados.",
      "Use seleção aleatória e tamanho adequado, comparando a amostra com subgrupos relevantes."
    ],
    "pitfall": "Uma amostra grande de voluntários ainda pode excluir sistematicamente pessoas com características importantes.",
    "example": {
      "question": "Pesquisa com 100 pessoas sorteadas de 10 mil é representativa?",
      "steps": [
        "Amostra aleatória cobre perfis; avalie método."
      ],
      "answer": "Pode ser, se sorteio for adequado"
    }
  },
  "math.m23.t02": {
    "summary": "Viés amostral é uma distorção sistemática causada pela seleção ou pela ausência de parte da população. Ouvir apenas clientes satisfeitos tende a superestimar a satisfação geral.",
    "steps": [
      "Pergunte quem teve chance de ser selecionado e quem ficou excluído.",
      "Identifique seleção, não resposta ou pergunta tendenciosa e descreva a direção do erro."
    ],
    "pitfall": "Aumentar a quantidade de respostas dentro do mesmo grupo enviesado não elimina o viés de seleção.",
    "example": {
      "question": "Uma pesquisa entrevista apenas clientes satisfeitos. Ela mede a satisfação geral?",
      "steps": [
        "Clientes insatisfeitos não tiveram a mesma chance de participar.",
        "A amostra sofre viés de seleção e não representa necessariamente todos os clientes."
      ],
      "answer": "Não. Há viés de seleção, pois os insatisfeitos foram excluídos."
    }
  },
  "math.m23.t03": {
    "summary": "Correlação indica que variáveis tendem a variar juntas; causalidade afirma que uma mudança produz a outra. Uma terceira variável, seleção ou coincidência pode explicar a associação observada.",
    "steps": [
      "Observe associação e possíveis variáveis de confusão antes de atribuir causa.",
      "Procure temporalidade, mecanismo e desenho experimental; correlação isolada não basta."
    ],
    "pitfall": "Um gráfico com tendência forte não prova causa; é preciso investigar mecanismos e fatores de confusão.",
    "example": {
      "question": "Vendas de sorvete e afogamentos sobem no verão. Sorvete causa afogamento?",
      "steps": [
        "Identifique variável comum: temperatura."
      ],
      "answer": "Não; correlação não prova causa"
    }
  },
  "math.m23.t04": {
    "summary": "Interpolação estima valores dentro do intervalo observado; extrapolação projeta para fora dele. Quanto mais distante dos dados, maior o risco de o padrão usado deixar de valer.",
    "steps": [
      "Localize o intervalo coberto pelas observações.",
      "Interpole dentro dele com cautela; extrapolar exige justificar que o padrão continua fora da amostra."
    ],
    "pitfall": "Mesmo uma interpolação exige um modelo coerente; ligar dois pontos não demonstra que a relação é linear.",
    "example": {
      "question": "Estimar valor entre dois anos observados é o quê?",
      "steps": [
        "Está dentro do intervalo de dados."
      ],
      "answer": "Interpolação"
    }
  },
  "math.m23.t05": {
    "summary": "Séries temporais registram uma variável ao longo do tempo e podem conter tendência, sazonalidade e ruído. Comparar os mesmos períodos ajuda a distinguir crescimento de oscilações sazonais.",
    "steps": [
      "Ordene observações no tempo e procure tendência, sazonalidade e ruído.",
      "Compare variações entre períodos e não trate dependência temporal como amostras independentes."
    ],
    "pitfall": "Três meses de aumento não bastam para garantir uma tendência duradoura ou descartar sazonalidade.",
    "example": {
      "question": "Vendas 10,12,15 em três meses: tendência?",
      "steps": [
        "Compare sucessivos valores."
      ],
      "answer": "Crescente"
    }
  },
  "math.m23.t06": {
    "summary": "Um boxplot mostra mediana e quartis; a caixa vai de Q1 a Q3 e contém os 50% centrais dos dados. Os bigodes seguem a convenção adotada, muitas vezes até os extremos não discrepantes, com pontos isolados para discrepantes.",
    "steps": [
      "Leia Q1, mediana, Q3 e a convenção dos bigodes na escala do gráfico.",
      "Calcule IQR=Q3−Q1 e compare centros, dispersão e possíveis discrepantes."
    ],
    "pitfall": "Os bigodes nem sempre são mínimo e máximo; leia a convenção antes de interpretar valores extremos.",
    "example": {
      "question": "Boxplot Q1=10,Q3=18: intervalo interquartil?",
      "steps": [
        "IQR=Q3−Q1."
      ],
      "answer": "8"
    }
  },
  "math.m23.t07": {
    "summary": "A distribuição normal tem uma curva simétrica em sino, centrada na média. A média fixa a posição e o desvio padrão controla a dispersão; numa normal, cerca de 68% ficam até um desvio padrão da média.",
    "steps": [
      "Use a curva simétrica centrada na média e reconheça a concentração ao redor dela.",
      "Interprete distância em desvios padrão sem confundir regra aproximada com certeza."
    ],
    "pitfall": "Dados simétricos não são necessariamente normais; não aplique a regra de 68% a qualquer distribuição.",
    "example": {
      "question": "Na normal, onde se concentram mais observações?",
      "steps": [
        "A densidade é maior perto da média."
      ],
      "answer": "Próximo da média"
    }
  },
  "math.m23.t08": {
    "summary": "Duas séries podem ter a mesma média e dispersões muito diferentes. Considerar desvio padrão, extremos e contexto ajuda a avaliar regularidade e incerteza de uma decisão.",
    "steps": [
      "Compare centro, dispersão e custo de errar para cada alternativa.",
      "Escolha uma medida de risco adequada e justifique a decisão com mais de uma estatística."
    ],
    "pitfall": "Menor dispersão indica mais regularidade, mas não torna uma opção automaticamente melhor para todo objetivo.",
    "example": {
      "question": "Duas opções têm média10; uma desvio1 e outra desvio5. Qual é mais previsível?",
      "steps": [
        "Menor dispersão indica maior previsibilidade."
      ],
      "answer": "A de desvio1"
    }
  },
  "math.m24.t01": {
    "summary": "Problemas de escala e semelhança conectam proporções com comprimentos, áreas e volumes. Encontre primeiro o fator linear e depois eleve-o à potência adequada à grandeza pedida.",
    "steps": [
      "Traduza a escala ou razão em uma proporção entre grandezas correspondentes.",
      "Resolva a proporção e só depois aplique perímetro, área ou semelhança conforme a figura."
    ],
    "pitfall": "Uma escala linear 1:100 produz escala de áreas 1:10 000; não use o mesmo fator para todas as dimensões.",
    "example": {
      "question": "Escala1:100, lado no desenho3cm. Real?",
      "steps": [
        "Multiplique por100."
      ],
      "answer": "3m"
    }
  },
  "math.m24.t02": {
    "summary": "Combinações e arranjos organizam os resultados possíveis de um experimento. Após definir o que conta como resultado e verificar equiprobabilidade, forme a razão entre casos favoráveis e totais.",
    "steps": [
      "Defina o espaço de grupos possíveis antes de escolher casos favoráveis.",
      "Conte ambos com a mesma técnica e forme a razão favoráveis/totais."
    ],
    "pitfall": "Uma dupla sem cargos é um grupo; uma dupla com funções diferentes tem ordem e exige outra contagem.",
    "example": {
      "question": "Escolher2 de5 ao acaso: chance de dupla específica?",
      "steps": [
        "Há C(5,2)=10 duplas."
      ],
      "answer": "1/10"
    }
  },
  "math.m24.t03": {
    "summary": "Funções representam custos, receitas ou saldos em função de quantidade e tempo. Interceptos podem representar custos fixos, enquanto coeficientes ou fatores representam consumo e crescimento.",
    "steps": [
      "Identifique variável de entrada, custo fixo, taxa e horizonte.",
      "Substitua a quantidade na função e interprete unidade monetária e domínio econômico."
    ],
    "pitfall": "O modelo algébrico pode admitir quantidades negativas ou fracionárias que não fazem sentido no contexto.",
    "example": {
      "question": "Custo C(x)=50+3x para x=10?",
      "steps": [
        "Substitua x."
      ],
      "answer": "80"
    }
  },
  "math.m24.t04": {
    "summary": "Calcular capacidade exige combinar a fórmula do volume com a conversão de unidades cúbicas. Um litro corresponde a 1 dm³; portanto 1 m³ corresponde a 1 000 litros.",
    "steps": [
      "Converta todas as dimensões para a mesma unidade antes de calcular volume.",
      "Aplique a fórmula do sólido e converta a unidade cúbica para litros ou outra pedida."
    ],
    "pitfall": "Converter centímetros em metros depois de calcular volume exige fator cúbico, não o fator linear 100.",
    "example": {
      "question": "1 m³ equivale a quantos litros?",
      "steps": [
        "(100cm)^3=1.000.000cm³; 1L=1000cm³."
      ],
      "answer": "1000 L"
    }
  },
  "math.m24.t05": {
    "summary": "Medições topográficas usam triângulos para relacionar distância horizontal, desnível e ângulo. A tangente do ângulo de elevação é desnível dividido pela distância horizontal num terreno modelado como plano.",
    "steps": [
      "Desenhe o triângulo retângulo e marque ângulo, distância horizontal e altura.",
      "Escolha tangente, seno ou cosseno e interprete o resultado como medida do terreno."
    ],
    "pitfall": "Some a altura do instrumento quando necessário; o desnível calculado parte da linha de visada, não sempre do chão.",
    "example": {
      "question": "Ângulo30°, distância horizontal10m: altura?",
      "steps": [
        "tan30=h/10; h=10tan30."
      ],
      "answer": "≈5,77m"
    }
  },
  "math.m24.t06": {
    "summary": "Interpretar estatísticas exige escolher medidas que respondam à pergunta e explicitar seus limites. Médias podem ser puxadas por valores extremos, enquanto a mediana descreve melhor o centro em algumas distribuições assimétricas.",
    "steps": [
      "Calcule medidas de centro e dispersão e observe valores extremos.",
      "Compare média e mediana antes de concluir sobre o grupo representado."
    ],
    "pitfall": "Não escolha uma medida só porque ela favorece uma conclusão; mostre a distribuição e o efeito dos extremos.",
    "example": {
      "question": "Os dados são 2,3,4,5,100. Qual medida representa melhor o centro sem ser puxada pelo extremo?",
      "steps": [
        "A média é (2+3+4+5+100)/5=22,8.",
        "A mediana é 4, pois ocupa a posição central na lista ordenada."
      ],
      "answer": "Mediana: 4"
    }
  },
  "math.m24.t07": {
    "summary": "A análise dimensional acompanha unidades nas operações e elimina fórmulas incompatíveis. Estimativas de ordem de grandeza servem para detectar erros de escala antes e depois do cálculo exato.",
    "steps": [
      "Escreva unidades em cada fator e faça uma ordem de grandeza.",
      "Cancele unidades incompatíveis, estime o resultado e verifique se a escala é plausível."
    ],
    "pitfall": "Unidades compatíveis são necessárias, mas não provam que uma fórmula ou um modelo esteja correto.",
    "example": {
      "question": "Velocidade60km/h por2h: distância?",
      "steps": [
        "km/h·h cancela h."
      ],
      "answer": "120 km"
    }
  },
  "math.m25.t01": {
    "summary": "Matrizes organizam valores em linhas e colunas e só podem ser somadas com dimensões iguais. O determinante existe para matrizes quadradas; no caso 2×2, é ad−bc e ajuda a estudar invertibilidade.",
    "steps": [
      "Identifique linhas, colunas e a ordem da matriz antes da operação.",
      "Para 2×2 use ad−bc e confirme que o determinante é escalar."
    ],
    "pitfall": "Produto de matrizes combina linha com coluna e geralmente AB é diferente de BA.",
    "example": {
      "question": "Determinante de [[2,1],[3,4]]?",
      "steps": [
        "ad−bc=8−3."
      ],
      "answer": "5"
    }
  },
  "math.m25.t02": {
    "summary": "Um sistema linear pode ser representado por AX=b, separando coeficientes, incógnitas e resultados. Operações elementares nas linhas da matriz aumentada preservam as soluções e permitem escalonar o sistema.",
    "steps": [
      "Escreva o sistema como AX=b e confira a ordem das matrizes.",
      "Calcule a inversa ou eliminação matricial e valide a solução nas equações originais."
    ],
    "pitfall": "Determinante zero não significa sempre ausência de solução: o sistema também pode ter infinitas soluções.",
    "example": {
      "question": "x+y=5,x−y=1: solução?",
      "steps": [
        "Some equações:2x=6."
      ],
      "answer": "x=3,y=2"
    }
  },
  "math.m25.t03": {
    "summary": "Números complexos têm forma a+bi, com i²=−1, e ampliam os reais para resolver equações como x²+1=0. Operações combinam partes reais e imaginárias respeitando essa identidade.",
    "steps": [
      "Separe parte real e imaginária e use i²=−1.",
      "Some componentes ou multiplique distribuindo e reduza potências de i."
    ],
    "pitfall": "Ao multiplicar termos com i, substitua i² por −1; tratá-lo como 1 troca o sinal do resultado.",
    "example": {
      "question": "(2+3i)+(1−i)?",
      "steps": [
        "Some partes reais e imaginárias."
      ],
      "answer": "3+2i"
    }
  },
  "math.m25.t04": {
    "summary": "Identidades trigonométricas são igualdades válidas em todo o domínio indicado. A fundamental sen²x+cos²x=1 vem do ciclo unitário; tg x=sen x/cos x exige cos x≠0.",
    "steps": [
      "Escolha a identidade que relaciona as expressões presentes.",
      "Substitua sen²x por 1−cos²x ou reorganize sem dividir por uma expressão que pode ser zero."
    ],
    "pitfall": "Cancelar ou dividir por seno ou cosseno sem verificar seus zeros pode perder soluções válidas.",
    "example": {
      "question": "sen²x+cos²x vale quanto?",
      "steps": [
        "Identidade fundamental."
      ],
      "answer": "1"
    }
  },
  "math.m25.t05": {
    "summary": "Equações modulares envolvem valor absoluto, interpretado como distância. Para |u|=a, trate os casos u=a e u=−a quando a>0, verificando separadamente os casos a=0 e a<0.",
    "steps": [
      "Verifique se o lado fora do módulo é positivo, zero ou negativo.",
      "Para |u|=a com a>0, resolva u=a e u=−a e teste as respostas na equação original."
    ],
    "pitfall": "Aqui módulo é valor absoluto; não confunda com congruências inteiras escritas 'mod n'.",
    "example": {
      "question": "Resolva |x−2|=3 nos reais.",
      "steps": [
        "O lado direito é positivo: x−2=3 ou x−2=−3.",
        "Assim, x=5 ou x=−1; ambos ficam a distância 3 de 2."
      ],
      "answer": "x=−1 ou x=5"
    }
  },
  "math.m25.t06": {
    "summary": "Cônicas surgem de seções de um cone e incluem elipse, parábola e hipérbole; a circunferência é um caso particular de elipse. Suas equações revelam centros, eixos e orientação, sem exigir desenho em escala exata.",
    "steps": [
      "Compare sinais e termos quadráticos com as formas padrão de círculo, elipse, parábola e hipérbole.",
      "Leia centro, eixos ou abertura sem resolver uma equação além do necessário."
    ],
    "pitfall": "Sinais e coeficientes dos termos quadráticos importam: dois termos positivos não bastam sem organizar a equação.",
    "example": {
      "question": "x²/9+y²/4=1 é qual cônica?",
      "steps": [
        "Dois termos quadráticos positivos igualados a1."
      ],
      "answer": "Elipse"
    }
  },
  "math.m25.t07": {
    "summary": "Conjuntos organizam elementos; união corresponde a pertencer a pelo menos um conjunto e interseção a pertencer a ambos. Diagramas e condições lógicas ajudam a traduzir afirmações e contar sem repetir.",
    "steps": [
      "Traduza a frase para união, interseção, complemento ou implicação.",
      "Liste elementos ou use tabela-verdade e verifique cada condição antes da conclusão."
    ],
    "pitfall": "O 'ou' matemático costuma ser inclusivo; um elemento nos dois conjuntos também pertence à união.",
    "example": {
      "question": "A={1,2},B={2,3}; A∩B?",
      "steps": [
        "Elementos comuns."
      ],
      "answer": "{2}"
    }
  }
};
