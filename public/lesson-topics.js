import {normalizeVideoTitle} from './video-topics.js?v=path16';
export const MODULE_VIDEO_TOPICS={1:'basics',2:'ratios',3:'percentage',4:'basics',5:'units',6:'equations',7:'equations',8:'functions',9:'functions',10:'functions',11:'functions',12:'progressions',13:'geometry',14:'geometry',15:'trigonometry',16:'geometry',17:'geometry',18:'statistics',19:'combinatorics',20:'probability',21:'finance',22:'functions',23:'statistics',24:'basics',25:'basics'};
export function learningLesson(curriculum,contentId){if(curriculum.modules?.[0]?.lessons){for(const m of curriculum.modules){const l=m.lessons.find(l=>l.id===contentId);if(l||m.id===contentId)return {id:contentId,title:l?.title??m.title,videoTerms:l?.videoTerms??m.title,moduleTitle:m.title,topic:l?.videoTopic??m.videoTopic,query:l?.videoTerms??m.title,isModule:!l};}return null;}for(const m of curriculum.modules){const t=m.topics.find(t=>t.id===contentId);if(t||m.id===contentId)return {id:contentId,title:t?.title??m.title,moduleTitle:m.title,topic:MODULE_VIDEO_TOPICS[m.sourceNumber??m.order]??'basics',query:(t?.title??m.title)+' matemática aula explicação',isModule:!t};}return null;}
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
