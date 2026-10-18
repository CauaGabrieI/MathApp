import {normalizeVideoTitle} from './video-topics.js?v=math22';
export const MODULE_VIDEO_TOPICS={1:'basics',2:'ratios',3:'percentage',4:'basics',5:'units',6:'equations',7:'equations',8:'functions',9:'functions',10:'functions',11:'functions',12:'progressions',13:'geometry',14:'geometry',15:'trigonometry',16:'geometry',17:'geometry',18:'statistics',19:'combinatorics',20:'probability',21:'finance',22:'functions',23:'statistics',24:'basics',25:'basics'};
export function learningLesson(curriculum,contentId){if(curriculum.modules?.[0]?.lessons){for(const m of curriculum.modules){const l=m.lessons.find(l=>l.id===contentId);if(l||m.id===contentId)return {id:contentId,title:l?.title??m.title,videoTerms:l?.videoTerms??m.title,moduleTitle:m.title,topic:l?.videoTopic??m.videoTopic,query:l?.videoTerms??m.title,isModule:!l};}return null;}for(const m of curriculum.modules){const t=m.topics.find(t=>t.id===contentId);if(t||m.id===contentId)return {id:contentId,title:t?.title??m.title,moduleTitle:m.title,topic:MODULE_VIDEO_TOPICS[m.sourceNumber??m.order]??'basics',query:(t?.title??m.title)+' matemática aula explicação',isModule:!t};}return null;}
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
 const rules=[['finance',/juros|financeir|capitaliza|investimento/],['percentage',/porcent|percentua|desconto|acrescimo|\d\s*%/],['probability',/probabilidade|chance|sorteio|espaco amostral/],['combinatorics',/combinatoria|permutacao|arranjo|combinacao/],['trigonometry',/trigonom|seno|cosseno|tangente|funcao trigonom/],['statistics',/estatistica|mediana|media aritmetica|media de altura|media da altura|media altura|desvio padrao|moda|frequencia/],['progressions',/progressao|sequencia aritmetica|sequencia geometrica/],['functions',/funcao|funcoes|parabola|logaritm/],['ratios',/proporc|regra de tres|escala|razao entre/],['geometry',/geometr|triangulo|quadrilatero|retangulo|trapezio|circunferencia|circulo|area|volume/],['equations',/equacao|sistema linear|inequacao/],['fractions',/fracao|fracoes/],['units',/unidade de medida|conversao|mililitro|centimetro cubico/],['basics',/numeros naturais|operacoes basicas|operacoes fundamentais|adicao|subtracao|multiplicacao|divisao/]];
 const topic=rules.find(([,pattern])=>pattern.test(raw))?.[0]??null,candidates=[];
 for(const m of curriculum?.modules??[])for(const t of (m.topics??[])){
  const terms=normalizeVideoTitle(t.title).split(/\s+/).filter(w=>w.length>3).slice(0,3);
  const moduleTopic=MODULE_VIDEO_TOPICS[m.sourceNumber??m.order]??null;
  const tagMatch=topicIds.includes(t.id), cueMatch=terms.filter(w=>w.length>3).filter(w=>raw.includes(w)).length;
  if(tagMatch&&(topic?moduleTopic===topic:true) || (!topic&&topicIds.length===0&&cueMatch>=2))candidates.push({id:t.id,title:t.title,moduleTitle:m.title,topic:moduleTopic??topic??'basics',query:t.title+' matemática aula explicação',score:(tagMatch?10:0)+cueMatch});
 }
 const selected=candidates.sort((a,b)=>b.score-a.score).slice(0,4);
 if(topic&&!selected.length)return {questionId,topic,candidates:[{id:'question:'+questionId,title:topic==='statistics'?'Média aritmética':topic==='trigonometry'?'Funções trigonométricas':topic,moduleTitle:'Questão',topic,query:(topic==='statistics'?'média aritmética':topic)+' matemática aula explicação'}],moduleIds,topicIds,reason:'cue-fallback'};
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
export function matchesLessonVideo(title,lesson){if(!lesson)return true;const text=normalizeVideoTitle(title),target=normalizeVideoTitle(lesson.videoTerms??lesson.title);if(ROADMAP_VIDEO_MATCH[lesson.id])return ROADMAP_VIDEO_MATCH[lesson.id].test(text);const override=aliases.find(([key])=>key.test(target));if(override)return override[1].test(text);const stop=new Set(['de','do','da','dos','das','e','em','no','na','nos','nas','a','o','as','os','com','por','para','basico','basica','basicos','basicas','nocoes','nivel','aplicacoes','interpretativo','introducao','problemas']);const groups=target.split(/\s+e\s+|,|\+|\//).map(part=>part.replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(word=>word&&!stop.has(word)));return groups.some(words=>words.length&&words.every(word=>new RegExp('\\b'+word.replace(/s$/,'')+'[a-z0-9]*\\b').test(text)));}
