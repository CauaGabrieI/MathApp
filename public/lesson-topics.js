import {normalizeVideoTitle} from './video-topics.js?v=math27';
export const MODULE_VIDEO_TOPICS={1:'basics',2:'ratios',3:'percentage',4:'basics',5:'units',6:'equations',7:'equations',8:'functions',9:'functions',10:'functions',11:'functions',12:'progressions',13:'geometry',14:'geometry',15:'trigonometry',16:'geometry',17:'geometry',18:'statistics',19:'combinatorics',20:'probability',21:'finance',22:'functions',23:'statistics',24:'basics',25:'basics'};
export function learningLesson(curriculum,contentId){const modules=curriculum?.modules??[];for(const m of modules){const children=m.lessons??m.topics??[],child=children.find(item=>item.id===contentId),topic=m.videoTopic??MODULE_VIDEO_TOPICS[m.sourceNumber??m.order]??'basics';if(child)return {id:contentId,title:child.title,videoTerms:child.videoTerms??child.title,moduleTitle:m.title,topic:child.videoTopic??topic,query:child.videoTerms??child.title,isModule:false};if(m.id===contentId)return {id:contentId,title:m.title,videoTerms:m.videoTerms??m.title,moduleTitle:m.title,topic,query:m.videoTerms??m.title,isModule:true,lessonContexts:children.map(item=>({id:item.id,title:item.title,videoTerms:item.videoTerms??item.title,moduleTitle:m.title,topic:item.videoTopic??topic,query:item.videoTerms??item.title,isModule:false}))};}return null;}
const normalizeWords=value=>normalizeVideoTitle(value).replace(/\b(aprofundamento|introducao|introdução|noc\.?es|noções|quando pertinente|aplicacoes|aplicações)\b/g,' ').replace(/\s+/g,' ').trim();
const EARLY_ARITHMETIC_VIDEO_GUARDS={
 'math.m01':{reject:/\b(?:monom(?:io|ios)|polinom(?:io|ios)|radic(?:al|ais)|raiz(?:es)? quadrad|func(?:ao|oes)|trigonom(?:etria)?|logaritm[a-z]*|derivad[a-z]*|integrais|calculo (?:1|diferencial|integral)|calculus)\b/},
 'math.m01.t01':{reject:/\b(?:operac(?:ao|oes)|adicao|subtracao|multiplicacao|divisao|monom(?:io|ios)|polinom(?:io|ios)|radic(?:al|ais)|raiz(?:es)? quadrad|func(?:ao|oes)|trigonom(?:etria)?|logaritm[a-z]*|derivad[a-z]*|integrais|calculo (?:1|diferencial|integral)|calculus)\b/},
 'math.m01.t05':{reject:/\b(?:matriz|matrizes|sistemas?|equac[a-z]*|proporcion[a-z]*|notacao cientifica|potencia[a-z]*|monom(?:io|ios)|polinom(?:io|ios)|radic(?:al|ais)|raiz(?:es)? quadrad|frac(?:ao|oes)|func(?:ao|oes)|trigonom(?:etria)?|logaritm[a-z]*|derivad[a-z]*|integrais|calculo (?:1|diferencial|integral)|calculus)\b/},
 'math.m01.t10':{reject:/\b(?:monom(?:io|ios)|polinom(?:io|ios)|radic(?:al|ais)|raiz(?:es)? quadrad|frac(?:ao|oes)|func(?:ao|oes)|trigonom(?:etria)?|logaritm[a-z]*|derivad[a-z]*|integrais|calculo (?:1|diferencial|integral)|calculus)\b/}
};
// Editorial concept profiles follow the 199 stable curriculum lesson IDs.
// Related coverage is allowed, but ambiguous words require their subject context.
const LESSON_VIDEO_ROWS={
1:String.raw`
numeros naturais sistema decimal~ordens classes numeracao decimal;numeros? naturais|sistema (?:de numeracao )?decimal|ordens e classes|decomposicao de numeros
numeros inteiros negativos;numeros? inteiros|numeros? negativos
fracoes proprias improprias~tipos de fracoes;fracoes?\b|fracao\b|tipos de fracao;algebr|geratriz|radic
numeros decimais conversao~fracao decimal;decima(?:is|l)|fracao decimal
quatro operacoes basicas~adicao subtracao multiplicacao divisao;operac(?:oes|ao).*(?:basic|fundament)|adicao|subtracao|multiplicacao|divisao
expressoes numericas parenteses~ordem das operacoes;expressoes? numericas?|ordem das operacoes|parenteses.*operac
multiplos divisores;multiplos?|divisores?;divisor comum|multiplo comum
criterios de divisibilidade;divisibilidade|divisivel
numeros primos fatoracao~decomposicao fatores primos;primos?|fatores? primos|fatoracao (?:numerica|de numeros)
mmc mdc~minimo multiplo comum maximo divisor comum;\bmmc\b|\bmdc\b|multiplo comum|divisor comum`,
2:String.raw`
razao taxa matematica~razao proporcao;razao|razoes|taxa unitaria;juros|exponencial
proporcionalidade direta inversa~grandezas diretamente inversamente proporcionais;proporcional|proporcionais
regra de tres simples;regra de tres simples
regra de tres composta;regra de tres composta
divisao partes proporcionais;divisao.*proporciona|partes proporcionais
escalas matematica;\bescalas?\b;logarit|richter|decibe|\bph\b|quant|universo|musica
velocidade media;velocidade media|movimento uniforme\b;uniformemente
densidade vazao~razao densidade;\bdensidade\b|\bvazao\b`,
3:String.raw`
fracao decimal porcentagem~conversao fracao porcentagem;(?:fraco?es?|fracao).*(?:decimal|decimais|porcent)|(?:decimal|decimais|porcent).*(?:fraco?es?|fracao)
porcentagem~calculo percentual;porcentagem|percentua
acrescimos descontos porcentagem~aumento desconto percentual;acrescim|descont|aumento.*percent|percent.*aumento
variacoes percentuais sucessivas~aumentos descontos sucessivos;sucessiv.*(?:percent|descont|aument|variac)|(?:percent|descont|aument|variac).*sucessiv
porcentagem valor original~porcentagem inversa;porcentagem.*(?:reversa|inversa)|(?:reversa|inversa).*porcentagem|porcentagem.*(?:original|inicial)|(?:preco|valor) (?:original|inicial)
lucro prejuizo;\blucro\b|\bprejuizo\b
juros simples;juros simples
juros compostos;juros compostos|capitalizacao composta
taxa juros inflacao;inflacao|taxa.*juros|juros.*taxa`,
4:String.raw`
potenciacao propriedades;potenciacao|propriedades.*potencia|potencia.*propriedades
potencias de dez~potencia base 10;potencia(?:s)? (?:de |da base |com base )?(?:dez|10)\b|notacao cientifica
notacao cientifica;notacao cientifica
ordem de grandeza;ordem de grandeza
raiz quadrada cubica~radiciacao;raiz(?:es)? (?:quadrad|cubic)|radiciacao
simplificacao radicais;simplifica.*radic|radic.*simplifica
racionalizacao denominadores;racionaliza
expoentes fracionarios~potencia expoente fracionario;expoente.*fracionar|potencia.*fracionar`,
5:String.raw`
sistema internacional unidades~prefixos multiplos submultiplos;sistema internacional|prefixos.*(?:unidades|medidas)|unidades.*prefixos
conversao unidades medidas~transformacao unidades;conversao.*(?:unidades|medidas)|transformacao.*(?:unidades|medidas)|unidades de (?:comprimento|massa|volume|area|tempo);radian|graus|trigonom
litros metros cubicos~medidas capacidade volume;litro.*(?:metro|volume)|(?:metro|volume).*litro|(?:unidades|medidas) de (?:volume|capacidade)
medidas angulares~graus minutos segundos angulos;medidas? angulares?|angulos.*(?:graus|minutos|segundos)|(?:graus|minutos|segundos).*angulos
estimativa matematica~calculo aproximado;estimativ|calculo aproximado
algarismos significativos;algarismos? significativos?
arredondamento erro medida~arredondamento numeros;arredondamento|erro.*medida|medida.*erro`,
6:String.raw`
variaveis expressoes algebricas~linguagem algebrica;expressoes? algebricas?|linguagem algebrica|\bvariaveis\b;qualitativ|quantitativ|estatistic
propriedade distributiva;distributiv
produtos notaveis;produtos? notaveis?
fatoracao algebrica~fatoracao polinomios;fatoracao|fatorar;primos|numerica|numeros
fracoes algebricas;fracoes? algebricas?|fracao algebrica
 equacao primeiro grau;equac(?:ao|oes).*(?:primeiro|1[º°o]?).*grau;segundo|quadratic|inequa
inequacao primeiro grau;inequac(?:ao|oes).*(?:primeiro|1[º°o]?).*grau
sistemas lineares duas incognitas~sistemas equacoes 2x2;sistemas?.*(?:linear|lineares|equac|incognitas)|metodo.*(?:adicao|substituicao);quadratic|segundo grau
problemas equacao primeiro grau~problemas incognitas;problemas?.*(?:equac|incognit)|(?:equac|incognit).*problemas?`,
7:String.raw`
equacao segundo grau;equac(?:ao|oes).*(?:segundo|2[º°o]?).*grau|equac(?:ao|oes) quadratic;inequa
formula bhaskara;bhaskara;sem (?:usar )?bhaskara
soma produto raizes~relacoes girard;soma.*produto.*raiz|relacoes? de girard
discriminante equacao segundo grau~delta bhaskara;discriminante|delta.*(?:equac|grau|bhaskara)|(?:equac|grau|bhaskara).*delta
sistema equacoes segundo grau~sistemas quadraticos;sistemas?.*(?:segundo grau|2[º°o]?.*grau|quadratic)|(?:segundo grau|2[º°o]?.*grau|quadratic).*sistemas?
polinomios operacoes;polinomios?|monomios?
equacoes biquadradas;biquadrad
inequacoes segundo grau~inequacoes quadraticas;inequac(?:ao|oes).*(?:segundo|2[º°o]?).*grau|inequac(?:ao|oes) quadratic`,
8:String.raw`
introducao funcoes~conceito funcao;(?:introducao|conceito|definicao|o que e|nocoes|entenda).*(?:funcao|funcoes)|(?:funcao|funcoes).*(?:introducao|conceito|definicao);inversa|modular|composta|quadratic|exponencial|logarit
dominio contradominio imagem;dominio|contradominio|imagem.*funcao
par ordenado~pares ordenados;pares? ordenados?|par ordenado|produto cartesiano|coordenadas cartesianas
plano cartesiano;plano cartesiano
grafico tabela funcao~construcao graficos funcoes;grafic.*(?:funcao|funcoes)|(?:funcao|funcoes).*grafic|tabel.*funcao
funcoes crescentes decrescentes;crescent|decrescent|crescimento.*funcao|funcao.*crescimento;juros|exponencial
taxa de variacao~funcao taxa variacao;taxa.*variacao|variacao.*funcao|coeficiente angular
zeros interceptos funcoes~raiz funcao;zeros?.*(?:funcao|funcoes)|(?:funcao|funcoes).*(?:zeros?|raiz)|intercepto
funcao composta inversa;func(?:ao|oes).*(?:compost|invers)|composicao.*fun`,
9:String.raw`
coeficiente angular linear funcao afim;coeficientes?.*(?:angular|linear)
equacao reta~funcao afim equacao reta;equac(?:ao|oes).*reta|funcao afim
grafico funcao afim~grafico funcao primeiro grau;grafic.*(?:afim|primeiro grau|1[º°o]?.*grau)|(?:afim|primeiro grau).*grafic
zero funcao afim~raiz funcao primeiro grau;(?:zero|raiz).*(?:afim|primeiro grau|1[º°o]?.*grau)|(?:afim|primeiro grau).*(?:zero|raiz)
sinal funcao afim~estudo sinal primeiro grau;sinal.*(?:afim|primeiro grau|1[º°o]?.*grau)|(?:afim|primeiro grau).*sinal
taxa variacao funcao afim~coeficiente angular taxa constante;taxa.*variacao.*(?:afim|linear|constante)|coeficiente angular
sistemas equacoes metodo grafico;sistemas?.*(?:grafic|retas)|(?:grafic|retas).*sistemas?
funcao afim problemas~funcao tarifas;(?:afim|primeiro grau).*(?:tarifa|consumo|problema|aplicac)|(?:tarifa|consumo|problema).*(?:afim|primeiro grau)`,
10:String.raw`
parabola concavidade funcao quadratica;parabola|concavidade.*(?:funcao|grau)
vertice raizes parabola~zeros funcao quadratica;vertice.*(?:parabola|quadratic|grau)|(?:parabola|quadratic|segundo grau).*(?:vertice|raiz|zero)
maximos e minimos funcao quadratica~vertice parabola;(?:maxim|minim).*(?:quadratic|segundo grau|2[º°o]?.*grau|parabola)|(?:quadratic|segundo grau|parabola).*(?:maxim|minim)
sinal funcao quadratica~sinal funcao segundo grau;sinal.*(?:quadratic|segundo grau|2[º°o]?.*grau)|(?:quadratic|segundo grau).*sinal
grafico funcao quadratica~translacao parabola;grafic.*(?:quadratic|segundo grau)|(?:quadratic|segundo grau).*grafic|(?:translacao|deslocamento).*parabola
funcao quadratica problemas area~otimizacao funcao quadratica;(?:quadratic|segundo grau|parabola).*(?:area|otimiza|maxim|minim)|(?:area|otimiza).*(?:quadratic|segundo grau)
funcao quadratica trajetoria~lancamento obliquo parabola;trajetoria.*(?:parabol|quadratic)|(?:parabol|quadratic).*trajetoria|lancamento obliquo`,
11:String.raw`
crescimento decaimento exponencial;crescimento.*exponencial|decaimento.*exponencial|exponencial.*(?:crescimento|decaimento)|funcao exponencial
funcao exponencial;func(?:ao|oes) exponencia
 equacoes exponenciais;\bequac(?:ao|oes) exponencia
introducao logaritmos~definicao logaritmo;logaritmo.*(?:introducao|definicao|conceito)|(?:introducao|definicao|conceito|o que e).*logaritmo
propriedades logaritmos;propriedades?.*logaritm|logaritm.*propriedades?
funcao logaritmica;func(?:ao|oes) logaritm
escalas logaritmicas~logaritmo ph decibeis richter;escala.*(?:logaritm|\bph\b|decibe|richter)|(?:logaritm|funcao).*(?:\bph\b|decibe|richter)|(?:\bph\b|decibe|richter).*logaritm
funcao exponencial populacao juros~crescimento populacional exponencial;exponencial.*(?:juros|populac|aplicac|bacter)|(?:juros|populac|bacter).*exponencial|juros compostos`,
12:String.raw`
sequencias numericas padroes;sequencias? numericas?|padroes?.*sequenc
progressao aritmetica termo geral;progressao aritmetica|\bpa\b.*termo geral|termo geral.*\bpa\b
soma progressao aritmetica~soma pa;som[ae].*(?:\bpa\b|progressao aritmetica)|(?:\bpa\b|progressao aritmetica).*som[ae]
progressao geometrica termo geral;progressao geometrica|\bpg\b.*termo geral|termo geral.*\bpg\b
soma progressao geometrica finita~soma pg;som[ae].*(?:\bpg\b|progressao geometrica)|(?:\bpg\b|progressao geometrica).*som[ae];infinit
crescimento geometrico~progressao geometrica crescimento;crescimento.*geometric|geometric.*crescimento|progressao geometrica
sequencias recorrentes~recorrencia sequencias;(?:recorren|recursiv).*sequenc|sequenc.*(?:recorren|recursiv)|fibonacci
progressoes matematica financeira~juros compostos progressao geometrica;(?:progressao|\bpg\b|\bpa\b).*(?:financeir|juros)|(?:financeir|juros).*(?:progressao|\bpg\b|\bpa\b)`,
13:String.raw`
ponto reta segmento angulos;ponto.*reta|segmento de reta|tipos de angulos|conceitos.*angulos
retas paralelas transversais;paralelas.*transversa|transversa.*paralelas
triangulos classificacao;classificac.*triangulo|triangulo.*classificac|tipos de triangulo
soma angulos triangulo~soma angulos internos poligonos;soma.*angulos.*(?:triangulo|poligono)|(?:triangulo|poligono).*soma.*angulos
congruencia semelhanca triangulos;congruencia.*triangulo|semelhanca.*triangulo|triangulo.*(?:congruencia|semelhanca)
teorema tales;\btales\b|\bthales\b
teorema pitagoras;pitagoras
relacoes metricas triangulo retangulo;relacoes metricas.*triangulo|triangulo.*relacoes metricas`,
14:String.raw`
quadrilateros poligonos;quadrilateros?|poligonos?|paralelogramos?|trapezios?
poligonos regulares;poligonos? regulares?|hexagono regular
perimetro areas figuras planas;perimetro|areas?.*(?:figuras|planas|triangulo|quadrado|retangulo|trapezio)|(?:triangulo|quadrado|retangulo|trapezio).*areas?
formula heron;heron|herao
circunferencia circulo;circunferencia|circulo;analitica|equacao
arcos setores coroas~setor coroa circular;setor circular|setores circulares|coroa circular|arcos?.*circunferencia
angulo inscrito central;angulos?.*(?:inscrit|central)|(?:inscrit|central).*angulos?
tangencia circunferencia~relacoes metricas circunferencia;tangencia|tangentes?.*circunferencia|circunferencia.*tangentes?|relacoes metricas.*circunferencia`,
15:String.raw`
trigonometria triangulo retangulo~razoes trigonometricas;trigonometria.*triangulo retangulo|razoes trigonometricas|(?:seno|cosseno|tangente).*triangulo retangulo
angulos notaveis trigonometria;angulos? notaveis?|tabela trigonometrica
lei senos;lei.*senos
lei cossenos;lei.*cossenos
ciclo trigonometrico;circulo trigonometrico|ciclo trigonometrico|circunferencia trigonometrica
funcoes seno cosseno;func(?:ao|oes).*(?:seno|cosseno)|funcoes trigonometricas
graus radianos;graus.*radian|radian.*graus|conversao.*radian
funcoes trigonometricas fenomenos periodicos~periodo funcoes seno cosseno;fenomenos periodicos|(?:periodo|periodic).*(?:seno|cosseno|trigonom)|(?:seno|cosseno|trigonom).*(?:periodo|periodic)`,
16:String.raw`
prismas piramides;prismas?|piramides?
cubo paralelepipedo;\bcubos?\b|paralelepipedo
cilindros cones esferas;cilindros?|\bcones?\b|esferas?;condutora|carga|eletro|magnet
planificacao solidos;planificac
area lateral total geometria espacial;area.*(?:lateral|total)|(?:lateral|total).*area
volume solidos geometria espacial;volumes?.*(?:solido|prisma|piramide|cubo|paralelepipedo|cilindro|cone|esfera)|(?:solido|prisma|piramide|cubo|paralelepipedo|cilindro|cone|esfera).*volumes?
secoes solidos semelhanca escala~seccao transversal solidos;secc?(?:ao|oes).*(?:solido|prisma|cilindro|cone|piramide|esfera)|(?:solido|prisma|cilindro|cone|piramide|esfera).*(?:secc?ao|escala|semelhanca)
tronco cone piramide;troncos?.*(?:cone|piramide)`,
17:String.raw`
distancia entre pontos;distancia.*pontos
ponto medio;point medio|ponto medio
coeficiente angular;coeficiente angular
equacao reta geometria analitica;equac(?:ao|oes).*reta
retas paralelismo perpendicularismo;paralelismo|perpendicularismo|retas?.*(?:paralel|perpendicular);transversa
intersecao retas;intersecc?ao.*retas|retas.*intersecc?ao|sistemas?.*(?:grafic|retas)
circunferencia equacao geometria analitica;equac(?:ao|oes).*circunferencia|circunferencia.*(?:equac|analitica|plano cartesiano)
area triangulo determinante~area coordenadas geometria analitica;area.*(?:determinante|coordenada|analitica)|(?:determinante|coordenada|analitica).*area`,
18:String.raw`
distribuicao frequencia~tabela frequencia;distribuicao.*frequencia|tabela.*frequencia|frequencia (?:absoluta|relativa)|tabelas? estatisticas?
estatistica tabelas graficos~leitura interpretacao graficos tabelas;(?:tabelas|graficos).*(?:estatistic|interpretac|leitura)|(?:estatistic|interpretac|leitura).*(?:tabelas|graficos)
media aritmetica ponderada;media.*(?:aritmetica|ponderada|simples)
mediana moda;mediana|\bmoda\b
amplitude estatistica;amplitude.*(?:estatistica|dados|total)|(?:estatistica|dados).*amplitude
quartis~diagrama caixa boxplot;quartis|quartil|box.?plot
variancia desvio padrao;variancia|desvio padrao
graficos enganosos~graficos manipulados;graficos?.*(?:engan|manipul|mentir|distorc|fals)|(?:engan|manipul|mentir|distorc).*graficos?`,
19:String.raw`
principio fundamental contagem;principio fundamental.*contagem|\bpfc\b|principio multiplicativo
diagrama arvore contagem~arvore possibilidades;diagrama.*arvore|arvore.*(?:possibilidades|contagem|probabilidade)
permutacao simples;permutacao simples;repeticao|circular
permutacao repeticao;permutacao.*repeticao
arranjo combinatoria;\barranjo\b|\barranjos\b
combinacao combinatoria;combinac(?:ao|oes)
contagem restricoes combinatoria;(?:contagem|combinatoria|permutacao).*(?:restric|juntos|separados)|restric.*(?:contagem|combinatoria)|permutacao circular
principio aditivo multiplicativo;principio aditivo|principio multiplicativo|principio fundamental.*contagem`,
20:String.raw`
espaco amostral eventos;espaco amostral|eventos.*probabilidade|probabilidade.*eventos
eventos equiprovaveis probabilidade;equiprovaveis|equiprovavel|probabilidade.*(?:moeda|dado)|(?:moeda|dado).*probabilidade
probabilidade evento complementar;complementar.*(?:probabilidade|evento)|(?:probabilidade|evento).*complementar
probabilidade uniao intersecao;probabilidade.*(?:uniao|intersec)|(?:uniao|intersec).*probabilidade|adicao.*probabilidade|probabilidade.*adicao
eventos independentes probabilidade;eventos independentes|probabilidade.*independen
probabilidade condicional;probabilidade condicional|teorema de bayes
probabilidade combinatoria;probabilidade.*combinatoria|combinatoria.*probabilidade
probabilidade multiplas etapas~multiplicacao probabilidades;probabilidade.*(?:multiplica|etapas|sucessiv|independen)|(?:multiplica|etapas|sucessiv).*probabilidade`,
21:String.raw`
capitalizacao composta juros compostos;capitalizacao composta|juros compostos
taxas equivalentes;taxas?.*equivalen|equivalencia.*taxas?
valor presente futuro matematica financeira;valor presente|valor futuro|valor atual
parcelamentos prestacoes matematica financeira;parcelamento|prestacoes|prestacao|financiamento|sistema price|sistema sac
comparacao investimentos matematica financeira;compara.*investimento|investimento.*compara|rentabilidade|rendimento.*(?:juros|compost|financeir)
inflacao acumulada;inflacao.*acumulad|acumulad.*inflacao|aumentos sucessivos
juros nominais reais;(?:juros|taxas?).*(?:nomina|reais|real)|(?:nomina|reais).*(?:juros|taxa)`,
22:String.raw`
funcao definida sentencas~funcao por partes;func(?:ao|oes).*(?:partes|sentencas|leis|ramos)|(?:partes|sentencas|leis|ramos).*funcao
valor absoluto modulo~funcao modular;valor absoluto|funcao modular|\bmodulo\b;aritmetica modular|congruencia
relacao graficos formulas funcoes~lei formacao funcao grafico;grafic.*(?:formula|lei de formacao)|(?:formula|lei de formacao).*grafic
otimizacao funcao problemas~maximo minimo funcao quadratica;otimizac.*(?:funcao|matematic)|(?:funcao|matematic).*otimizac|maxim.*minim.*(?:quadratic|grau)
composicao funcoes modelos~funcao composta;func(?:ao|oes) compost|composicao.*func
modelos nao lineares~modelagem funcao quadratica exponencial;(?:quadratic|exponencial).*(?:modelagem|aplicac|problema|contextualiz)|(?:modelagem|aplicac).*funcao.*(?:quadratic|exponencial)|modelos? nao lineares?
crescimento linear exponencial comparacao;linear.*exponencial|exponencial.*linear|funcao (?:afim|exponencial)`,
23:String.raw`
amostragem representatividade~amostra populacao estatistica;amostragem|amostra.*(?:populacao|representativ)|populacao.*amostra
vies amostral~vies estatistica;vies.*(?:amostra|estatistic)|(?:amostra|estatistic).*vies
correlacao causalidade;correlacao|causalidade
interpolacao extrapolacao;interpolac|extrapolac
series temporais estatistica;series? temporais?|serie historica
boxplot~diagrama de caixa;box.?plot|diagrama.*caixa
distribuicao normal~curva gauss;distribuicao normal|curva de gauss|curva normal
variabilidade estatistica~dispersao estatistica;variabilidade.*(?:estatistic|dados)|medidas de dispersao|variancia|desvio padrao`,
24:String.raw`
semelhanca geometria proporcao~teorema tales problemas;semelhanca.*(?:triangulo|figura)|(?:triangulo|figura).*semelhanca|teorema.*tales
probabilidade combinatoria problemas;probabilidade.*combinatoria|combinatoria.*probabilidade
funcoes matematica financeira~funcao exponencial juros;funcao.*(?:financeir|juros)|(?:financeir|juros).*funcao
geometria espacial conversao volume~conversao unidades volume;conversao.*volume|volume.*conversao|litro.*metro cubico
trigonometria topografia~trigonometria alturas distancias;trigonometria.*(?:topografia|alturas|distancias)|(?:topografia|alturas|distancias).*trigonometria
estatistica interpretacao graficos~analise dados estatistica;estatistica.*(?:interpretac|grafic|analise)|(?:interpretac|grafic|analise).*estatistica
analise dimensional estimativa;analise dimensional|estimativa.*(?:unidades|medidas)`,
25:String.raw`
matrizes determinantes;matrizes?|determinantes?
sistemas lineares matrizes~sistemas regra cramer;sistemas?.*(?:matriz|matrizes|cramer)|(?:matriz|matrizes|cramer).*sistemas?|regra de cramer
numeros complexos;numeros? complexos?|unidade imaginaria
identidades trigonometricas~relacao fundamental trigonometria;identidades? trigonometricas?|relacao fundamental.*trigonometria|trigonometria.*relacao fundamental
equacoes modulares;\bequac(?:ao|oes) modulares?|\bequacao modular
conicas elipse hiperbole parabola;conicas?|elipse|hiperbole
raciocinio logico conjuntos;raciocinio logico|logica.*(?:matematica|proposic)|conjuntos|diagrama de venn`
};
export const VIDEO_LESSON_PROFILES=Object.fromEntries(Object.entries(LESSON_VIDEO_ROWS).flatMap(([module,rows])=>rows.trim().split('\n').map((row,i)=>{
 const [query,accept,reject]=row.trim().split(';');
 return [`math.m${module.padStart(2,'0')}.t${String(i+1).padStart(2,'0')}`,{queries:query.trim().split('~'),accept:new RegExp(accept),reject:reject?new RegExp(reject):null}];
})));

const EDITORIAL_QUERY_ALIASES=[
 [/calculo percentual/,'porcentagem'],[/funcao quadratica/,'funcao do segundo grau'],[/funcao afim/,'funcao do primeiro grau'],
 [/naturais|sistema decimal/,'sistema de numeracao decimal ordens classes decomposicao'],[/adicao, subtracao.*multiplicacao.*divisao/,'quatro operacoes basicas numeros inteiros decimais'],[/coeficientes? angular/,'inclinacao da reta'],[/ordem das operacoes/,'expressoes numericas'],
 [/mmc e mdc/,'minimo multiplo comum maximo divisor comum'],[/fracoes proprias/,'tipos de fracoes']
];
export function lessonVideoQueries(lesson){
 if(!lesson)return[];
 if(VIDEO_LESSON_PROFILES[lesson.id])return VIDEO_LESSON_PROFILES[lesson.id].queries.slice(0,2);
 const base=normalizeWords(lesson.videoTerms??lesson.title);
 if(!base)return[];
 const moduleContext=lesson.moduleTitle==null?'':normalizeWords(lesson.moduleTitle);
 const contextual=/^math\.m10\./.test(lesson.id??'')&&/maxim|minim/.test(base)?`${base} ${moduleContext}`.trim():base;
 const alias=EDITORIAL_QUERY_ALIASES.find(([pattern])=>pattern.test(base))?.[1];
 return [...new Set([contextual,alias].filter(Boolean))].slice(0,2);
}
// Resolve a bank question to the smallest trustworthy curriculum concept. The
// route supplies an id and local record; arbitrary client text is never looked up.
export function questionVideoContext(question,{curriculum,index,roadmap}={}){
 if(!question||typeof question!=='object')return {questionId:null,topic:null,candidates:[],reason:'missing-question'};
 const questionId=String(question.id??''),tags=index?.questionTags?.[questionId];
 const raw=normalizeVideoTitle((question.topic??'')+' '+(question.title??'')+' '+(question.question??'')+' '+(question.statement??''));
 const moduleIds=[...(tags?.moduleIds??[])],topicIds=[...(tags?.topicIds??[])];
 const exactLessonId=question.learning?.lessonId??question.lessonId;
 if(exactLessonId&&roadmap){const exact=learningLesson(roadmap,exactLessonId);if(exact)return {questionId,topic:exact.topic??'basics',moduleIds,topicIds,candidates:[exact],lesson:exact,reason:'authorial-lesson'};}
 // Order is deliberate: concrete skills win over incidental words such as
 // "vazão", "área" or "média" in a word problem.
 const rules=[['finance',/juros|financeir|capitaliza|investimento/],['percentage',/porcent|percentua|desconto|acrescimo|\d\s*%/],['probability',/probabilidade|chance|sorteio|espaco amostral/],['combinatorics',/combinatoria|permutacao|arranjo|combinacao/],['trigonometry',/trigonom|seno|cosseno|tangente|funcao trigonom/],['statistics',/estatistica|mediana|media aritmetica|media de altura|media da altura|media altura|desvio padrao|variancia|moda|frequencia|quartil|boxplot/],['progressions',/progressao|sequencia aritmetica|sequencia geometrica/],['functions',/funcao|funcoes|parabola|logaritm/],['ratios',/proporc|regra de tres|escala|razao entre/],['geometry',/geometr|triangulo|quadrilatero|retangulo|trapezio|circunferencia|circulo|area|volume/],['equations',/equacao|sistema linear|inequacao/],['fractions',/fracao|fracoes/],['units',/unidade de medida|conversao|mililitro|centimetro cubico/],['basics',/numeros naturais|operacoes basicas|operacoes fundamentais|adicao|subtracao|multiplicacao|divisao/]];
 const topic=rules.find(([,pattern])=>pattern.test(raw))?.[0]??null,candidates=[];
 for(const m of curriculum?.modules??[])for(const t of (m.topics??[])){
  const terms=normalizeVideoTitle(t.title).split(/\s+/).filter(w=>w.length>3).slice(0,3);
  const moduleTopic=MODULE_VIDEO_TOPICS[m.sourceNumber??m.order]??null;
  const tagMatch=topicIds.includes(t.id), cueMatch=terms.filter(w=>w.length>3).filter(w=>raw.includes(w)).length;
  if(tagMatch&&(topic?moduleTopic===topic:true) || (!topic&&topicIds.length===0&&cueMatch>=2))candidates.push({id:t.id,title:t.title,moduleTitle:m.title,topic:moduleTopic??topic??'basics',query:t.title+' matemática aula explicação',score:(tagMatch?10:0)+cueMatch});
 }
 const selected=candidates.sort((a,b)=>b.score-a.score).slice(0,4);
 if(topic&&!selected.length){const statTitle=/quartil|boxplot/.test(raw)?'Quartis e interpretação':/varianc|desvio padrao/.test(raw)?'Variância e desvio padrão':/mediana|moda/.test(raw)?'Mediana e moda':/frequencia|distribuicao/.test(raw)?'Leitura de distribuição de frequência':'Média simples e ponderada';const fallback=topic==='statistics'?statTitle:topic==='trigonometry'?'Funções seno e cosseno':topic;return {questionId,topic,candidates:[{id:'question:'+questionId,title:fallback,moduleTitle:'Questão',topic,query:fallback+' matemática aula explicação'}],moduleIds,topicIds,reason:'cue-fallback'};}
 return {questionId,topic:topic??selected[0]?.topic??null,moduleIds,topicIds,candidates:selected,reason:(topic||selected.length)?'matched':'unknown'};
}
const aliases=[[/calculo percentual/,/porcentagem|calculo percentual/],[/funcao quadratica/,/funcao quadratica|funcao do (segundo|2.?|2°) grau/],[/^numeros e operacoes$/,/matematica basica|operacoes fundamentais|operacoes basicas|numeros naturais/],[/naturais|sistema decimal/,/numeros? naturais|sistema (de numeracao )?decimal/],[/coeficientes? angular/,/coeficientes? angular|inclinacao da reta/],[/inteiros e numeros negativos/,/numeros? inteiros|numeros? negativos/],[/adicao, subtracao/,/operacoes basicas|operacoes fundamentais|adicao|subtracao|multiplicacao|divisao/],[/ordem das operacoes/,/ordem das operacoes|expressoes numericas/],[/mmc e mdc/,/\bmmc\b|\bmdc\b|multiplo comum|divisor comum/],[/funcao afim/,/funcao afim|funcao do (primeiro|1.?|1°) grau/],[/equacao da reta/,/equacao da reta|funcao afim/],[/fracoes proprias/,/fracoes proprias|fracoes improprias|tipos de fracoes/]];
const ROADMAP_VIDEO_MATCH={
 'roadmap.m02.l01':/^(?!.*(?:conjunto solucao|trigonom|equacao|conjuntos numericos)).*(?:conjuntos?|diagrama de venn)/,
 'roadmap.m01.l01':/operac(?:oes|ao).*(?:basic|fundament|quatro)|quatro operacoes/,
 'roadmap.m03.l06':/func(?:ao|oes).*(?:compost|invers)|composicao.*fun/,
 'roadmap.m04.l09':/diagonal.*retang|retang.*diagonal|quadrilateros|propriedades.*retangulo/,
 'roadmap.m04.l11':/semelhanca|figuras semelhantes|razao.*area/,
 'roadmap.m05.l03':/lei (?:dos )?(?:senos|cossenos)/,
 'roadmap.m05.l04':/seno.*area|area.*seno|lei.*areas/,
 'roadmap.m06.l02':/projec(?:ao|oes).*ortogon/,
 'roadmap.m06.l03':/prismas?|poliedros?/,
 'roadmap.m06.l07':/inscrit|circunscrit/,
 'roadmap.m06.l08':/geometria.*posicao|posicao.*(?:retas|planos)|retas.*planos/,
 'roadmap.m08.l09':/probabilidade.*(?:uniao|intersecao|independ|multiplica|adicao)|adicao.*probabilidade/,
 'roadmap.m10.l02':/area.*(?:triangulo.*(?:plano|determinante)|coordenad)|determinante.*area|geometria analitica.*area/,
 'roadmap.m10.l04':/retas.*(?:paralela|perpendicular|posic)|posic.*retas/,
 'roadmap.m11.l02':/periodo.*(?:seno|cosseno|func)|funcao.*(?:seno|cosseno)|funcoes trigonometricas/,
 'roadmap.m11.l04':/funcao.*racional|funcoes.*racionais|funcao.*(?:quociente|hiperbol|homograf)/,
 'roadmap.m11.l09':/soma.*(?:pg|progressao geometrica).*infinit|serie.*geometrica|pg.*infinit/,
 'roadmap.m11.l10':/limites?|continuidade/
};
export function scoreLessonVideo(title,lesson){
 if(!lesson)return 0;
 const text=normalizeVideoTitle(title),target=normalizeWords(lesson.videoTerms??lesson.title);
 if(!target)return 0;
 if(/\b(dicas? de estudo|como estudar|maratona|revisao geral|aul[aã]o completo)\b/.test(text)&&!text.includes(target))return 0;
 const guard=EARLY_ARITHMETIC_VIDEO_GUARDS[lesson.id];
 if(guard?.reject.test(text))return 0;
 if(lesson.id==='math.m10.t03'&&!/quadratic|parabol|segundo grau|2\s*[º°o]?\s*grau/.test(text))return 0;
 const profile=VIDEO_LESSON_PROFILES[lesson.id];
 if(profile){if(profile.reject?.test(text)||/derivad|calculo (?:1|diferencial|integral)/.test(text))return 0;return profile.accept.test(text)?(text.includes(target)?40:20):0;}
 if(ROADMAP_VIDEO_MATCH[lesson.id])return ROADMAP_VIDEO_MATCH[lesson.id].test(text)?20:0;
 const override=aliases.find(([key])=>key.test(target));
 if(override)return override[1].test(text)?(text.includes(target)?40:20):0;
 const stop=new Set(['de','do','da','dos','das','e','em','no','na','nos','nas','a','o','as','os','com','por','para','basico','basica','basicos','basicas','nocoes','nivel','aplicacoes','interpretativo','introducao','problemas','aprofundamento']);
 const groups=target.split(/\s+e\s+|,|\+|\//).map(part=>part.replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(word=>word&&!stop.has(word)));
 const generic=new Set(['funcao','funcoes','soma','produto','equacao','equacoes','interpretacao','interpretacao','grafico','graficos','aula','matematica','calculo','calculos']);
 const matches=words=>words.filter(word=>new RegExp('\\b'+word.replace(/s$/,'')+'[a-z0-9]*\\b').test(text));
 const completeGroups=groups.filter(words=>words.length&&matches(words).length===words.length);
 // A shared word such as "função" or "soma" is not enough to identify a
 // lesson. Admission requires a complete group containing a concrete term;
 // partial hits are used only for ranking after that gate.
 const semanticGroups=completeGroups.filter(words=>words.some(word=>!generic.has(word)));
 if(!semanticGroups.length)return 0;
 let score=0;
 for(const words of groups){
  const hits=matches(words).length;
  if(hits===words.length)score+=5; else if(hits)score+=hits;
 }
 // Closely named subjects are deliberately exclusive, so a neighbouring
 // lesson cannot win merely because it shares one broad keyword.
 if(/quadratic|quadratica|segundo grau/.test(target)&&/afim|primeiro grau/.test(text))return 0;
 if(/afim|primeiro grau/.test(target)&&/quadratic|quadratica|segundo grau/.test(text))return 0;
 if(/juros compost/.test(target)&&/juros simples/.test(text))return 0;
 if(/juros simples/.test(target)&&/juros compost/.test(text))return 0;
 if(/mediana/.test(target)&&/media(?!n)/.test(text)&&!/mediana/.test(text))return 0;
 if(/media(?!n)/.test(target)&&/mediana/.test(text)&&!/media(?!n)/.test(text))return 0;
 if(/geometria analitica/.test(target)&&/geometria espacial|solidos/.test(text))return 0;
 if(/geometria espacial|solidos/.test(target)&&/geometria analitica/.test(text))return 0;
 const absolute=/valor absoluto|modulo(?: de| do| da| dos| das)?\b/.test(target);
 const modular=/aritmetica modular|congruencia|congruencias/.test(text);
 const targetModular=/aritmetica modular|congruencia|congruencias/.test(target);
 if((absolute&&modular)||(targetModular&&/valor absoluto|modulo(?: de| do| da| dos| das)?\b/.test(text)))return 0;
 return score;
}
export function matchesLessonVideo(title,lesson){return scoreLessonVideo(title,lesson)>0;}
