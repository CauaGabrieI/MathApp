import {normalizeVideoTitle} from './video-topics.js?v=math27';
export const MODULE_VIDEO_TOPICS={1:'basics',2:'ratios',3:'percentage',4:'basics',5:'units',6:'equations',7:'equations',8:'functions',9:'functions',10:'functions',11:'functions',12:'progressions',13:'geometry',14:'geometry',15:'trigonometry',16:'geometry',17:'geometry',18:'statistics',19:'combinatorics',20:'probability',21:'finance',22:'functions',23:'statistics',24:'basics',25:'basics'};
export function learningLesson(curriculum,contentId){if(curriculum.modules?.[0]?.lessons){for(const m of curriculum.modules){const l=m.lessons.find(l=>l.id===contentId);if(l||m.id===contentId)return {id:contentId,title:l?.title??m.title,videoTerms:l?.videoTerms??m.title,moduleTitle:m.title,topic:l?.videoTopic??m.videoTopic,query:l?.videoTerms??m.title,isModule:!l};}return null;}for(const m of curriculum.modules){const t=m.topics.find(t=>t.id===contentId);if(t||m.id===contentId)return {id:contentId,title:t?.title??m.title,moduleTitle:m.title,topic:MODULE_VIDEO_TOPICS[m.sourceNumber??m.order]??'basics',query:(t?.title??m.title)+' matemática aula explicação',isModule:!t};}return null;}
const normalizeWords=value=>normalizeVideoTitle(value).replace(/\b(aprofundamento|introducao|introdução|noc\.?es|noções|quando pertinente|aplicacoes|aplicações)\b/g,' ').replace(/\s+/g,' ').trim();
const EARLY_ARITHMETIC_VIDEO_GUARDS={
 'math.m01':{reject:/\b(?:monom(?:io|ios)|polinom(?:io|ios)|radic(?:al|ais)|raiz(?:es)? quadrad|func(?:ao|oes)|trigonom(?:etria)?|logaritm[a-z]*|derivad[a-z]*|integrais|calculo (?:1|diferencial|integral)|calculus)\b/},
 'math.m01.t01':{reject:/\b(?:operac(?:ao|oes)|adicao|subtracao|multiplicacao|divisao|monom(?:io|ios)|polinom(?:io|ios)|radic(?:al|ais)|raiz(?:es)? quadrad|func(?:ao|oes)|trigonom(?:etria)?|logaritm[a-z]*|derivad[a-z]*|integrais|calculo (?:1|diferencial|integral)|calculus)\b/},
 'math.m01.t05':{reject:/\b(?:monom(?:io|ios)|polinom(?:io|ios)|radic(?:al|ais)|raiz(?:es)? quadrad|frac(?:ao|oes)|func(?:ao|oes)|trigonom(?:etria)?|logaritm[a-z]*|derivad[a-z]*|integrais|calculo (?:1|diferencial|integral)|calculus)\b/},
 'math.m01.t10':{reject:/\b(?:monom(?:io|ios)|polinom(?:io|ios)|radic(?:al|ais)|raiz(?:es)? quadrad|frac(?:ao|oes)|func(?:ao|oes)|trigonom(?:etria)?|logaritm[a-z]*|derivad[a-z]*|integrais|calculo (?:1|diferencial|integral)|calculus)\b/}
};
const EDITORIAL_QUERY_ALIASES=[
 [/calculo percentual/,'porcentagem'],[/funcao quadratica/,'funcao do segundo grau'],[/funcao afim/,'funcao do primeiro grau'],
 [/naturais|sistema decimal/,'sistema de numeracao decimal ordens classes decomposicao'],[/adicao, subtracao.*multiplicacao.*divisao/,'quatro operacoes basicas numeros inteiros decimais'],[/coeficientes? angular/,'inclinacao da reta'],[/ordem das operacoes/,'expressoes numericas'],
 [/mmc e mdc/,'minimo multiplo comum maximo divisor comum'],[/fracoes proprias/,'tipos de fracoes']
];
export function lessonVideoQueries(lesson){
 if(!lesson)return[];
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
