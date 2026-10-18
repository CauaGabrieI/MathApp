export const VIDEO_CHANNELS=[
 {handle:'umbertomann',id:'UC3KTSc6Ihj3vKI6aaYYpN_A',name:'Umberto Mannarino'},
 {handle:'PedroAssaad',id:'UC6vF2MME3Xc3FV-a_33DKsQ',name:'Pedro Assaad'},
 {handle:'UniversoNarrado',id:'UCcdK7fNDtCuiERTzTZdWY7w',name:'Universo Narrado'},
 {handle:'MétodoQuestiona',id:'UCpRZYty4rAOjX3PN_N5NyUg',name:'Método Questiona'},
 {handle:'paulojubilut',id:'UCG-eghyORxNrzSG8FkAWKyw',name:'Paulo Jubilut'},
 {handle:'sandrocuriodicasdemat',id:'UCXBJ_Ef8qfYrwN5cY8W7ziA',name:'Dicasdemat Sandro Curió'},
 {handle:'Giscomgiz',id:'UCCTHtVMXy9gQA8X_HOEJA2A',name:'Gis com Giz'},
 {handle:'UniversoMilitares',id:'UCX6DjOoxXoB2pE4dCmdbd4A',name:'Universo Narrado Militares'},
 {handle:'professorferretto',id:'UCW9_n8p_Byz-4k8wV1tnUBg',name:'Professor Ferretto | ENEM e Vestibulares'}
];
export const VIDEO_TOPICS={
 basics:{label:'Matemática básica',query:'matemática básica aula 1 introdução do zero',pattern:'matematica basica|matematica do zero|operacoes basicas|operacoes fundamentais|introducao a matematica|fundamentos da matematica'},
 percentage:{label:'Porcentagem',query:'porcentagem aula matemática',pattern:'porcentagem|percentua'},
 ratios:{label:'Razão, proporção e regra de três',query:'razão proporção regra de três matemática aula',pattern:'regra de tres|razao|proporc'},
 geometry:{label:'Geometria',query:'geometria plana espacial areas volumes aula',pattern:'geometria|area|volume|pitagoras'},
 functions:{label:'Funções',query:'funções matemática introdução aula',pattern:'funcao|funcoes'},
 equations:{label:'Equações',query:'equação primeiro segundo grau aula',pattern:'equacao|equacoes'},
 probability:{label:'Probabilidade',query:'probabilidade matemática aula',pattern:'probabilidade'},
 statistics:{label:'Estatística',query:'estatística média moda mediana aula',pattern:'estatistica|media moda|mediana'},
 finance:{label:'Matemática financeira',query:'matemática financeira juros simples compostos aula',pattern:'financeira|juros'},
 combinatorics:{label:'Análise combinatória',query:'análise combinatória arranjo combinação permutação aula',pattern:'combinatoria|permutacao|combinacao|arranjo'},
 trigonometry:{label:'Trigonometria',query:'trigonometria seno cosseno tangente introdução aula',pattern:'trigonometria|seno|cosseno|tangente'},
 fractions:{label:'Frações',query:'frações matemática básica aula',pattern:'fracao|fracoes'},
 progressions:{label:'Progressões',query:'progressão aritmética geométrica PA PG aula',pattern:'progressao|progressoes|\\bpa e pg\\b'},
 units:{label:'Unidades e medidas',query:'conversão de unidades medidas matemática aula',pattern:'unidades|medidas|conversao'}
};
export function normalizeVideoTitle(s){return String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
export function isVideoLesson(title){
 const text=normalizeVideoTitle(title);
 if(/deveria estudar|como estudar|vale a pena|cronograma|plano de estudos|mentoria|como passar|todos os assuntos|evite.{0,40}simulad|foque em|o que estudar|quais assuntos estudar|estrategia de estudo|metodo de estudo|maratona|motivac(?:ao|ional)|desafio de estudos|renda extra/.test(text))return false;
 // Generic study advice is different from a revision lesson on a named skill.
 return !/como (?:melhorar|revisar|aprender)(?: (?:em|a|na|sua))* matematica|revisar(?: a)? matematica|dicas? (?:para|de) estudar|^revisao(?: de)? matematica(?: basica)?(?: \||$)/.test(text);
}
export function matchesVideoTopic(title,topic){const spec=VIDEO_TOPICS[topic];const text=normalizeVideoTitle(title);if(!isVideoLesson(title))return false;if(topic==='basics'&&!/aula|introducao|do zero|operacoes|fundamentos|curso|completa|aprenda|comece|#0?1/.test(text))return false;return Boolean(spec&&new RegExp(spec.pattern,'i').test(text));}
export function detectVideoTopic(question,hasCompletedHistory){if(!hasCompletedHistory)return 'basics';if(!question)return null;const text=normalizeVideoTitle((question.topic??'')+' '+(question.question??''));const rules=[['finance',/juros|financeir|taxa de rendimento|investimento/],['percentage',/porcent|percentua|desconto|acrescimo|\d\s*%/],['probability',/probabilidade|probabilistic|chance de|sorteio/],['combinatorics',/combinatoria|permutacao|arranjo|combinacoes/],['statistics',/estatistica|mediana|media aritmetica|media ponderada|desvio padrao|moda|frequencia/],['trigonometry',/trigonom|seno|cosseno|tangente/],['progressions',/progressao|progress|sequencia aritmetica|sequencia geometrica/],['functions',/funcao|funcoes|parabola|logaritm/],['ratios',/proporc|regra de tres|escala|razao entre/],['geometry',/geometr|triangulo|quadrilatero|retangulo|trapezio|circunferencia|circulo|poligono|area|volume|cone|cilindro|esfera|perimetro/],['equations',/equacao|equacoes|sistema linear/],['fractions',/fracao|fracoes/],['units',/unidade de medida|conversao de|mililitro|centimetro cubico/]];return rules.find(([,pattern])=>pattern.test(text))?.[0]??null;}
