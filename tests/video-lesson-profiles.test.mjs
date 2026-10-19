import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {VIDEO_LESSON_PROFILES,learningLesson,lessonVideoQueries,matchesLessonVideo} from '../public/lesson-topics.js';
import {verifyYouTubeVideo,recommendVideos} from '../video-service.js';
const curriculum=JSON.parse(fs.readFileSync(new URL('../public/learning-path.json',import.meta.url)));
const context=id=>learningLesson(curriculum,id);

test('os 25 módulos e 199 aulas têm conceitos específicos e consultas utilizáveis',()=>{
 const ids=curriculum.modules.flatMap(m=>m.lessons.map(l=>l.id));
 assert.equal(curriculum.modules.length,25);assert.equal(ids.length,199);
 assert.deepEqual(Object.keys(VIDEO_LESSON_PROFILES).sort(),[...ids].sort());
 for(const id of ids){const lesson=context(id),queries=lessonVideoQueries(lesson);assert.ok(queries.length>0&&queries.length<=2,id);assert.ok(queries.some(q=>matchesLessonVideo(q,lesson)),id);}
});

test('sinônimos e vídeos de apoio são admitidos com o contexto correto',()=>{
 const cases=[['math.m03.t08','Capitalização composta — entenda o cálculo'],['math.m18.t06','BOXPLOT: quartis e diagrama de caixa'],['math.m01.t03','Frações: aula completa e exemplos'],['math.m01.t01','Sistema de numeração decimal: classes e ordens'],['math.m03.t01','Frações e números decimais'],['math.m17.t08','Área do triângulo usando determinantes'],['math.m25.t02','Regra de Cramer: sistemas lineares'],['math.m12.t03','Soma dos termos de uma progressão aritmética'],['math.m21.t07','Taxas de juros reais e nominais'],['math.m09.t08','Problemas com função afim: tarifa de táxi']];
 for(const [id,title]of cases)assert.ok(matchesLessonVideo(title,context(id)),id+' '+title);
});

test('palavras ambíguas não associam conteúdos de outras aulas',()=>{
 const cases=[['math.m08.t08','Zero fatorial: por que 0! é igual a 1?'],['math.m10.t02','Vértices, faces e arestas de poliedros'],['math.m12.t03','Soma de vetores e lei dos cossenos'],['math.m21.t07','Conjuntos numéricos: números reais'],['math.m07.t06','As quatro operações básicas'],['math.m09.t05','Sinal da função quadrática'],['math.m17.t08','Área lateral do cilindro'],['math.m20.t04','União e interseção de conjuntos'],['math.m01.t03','Frações algébricas'],['math.m18.t05','Amplitude da função seno'],['math.m22.t02','Aritmética modular: congruências'],['math.m10.t03','Máximos e mínimos usando derivadas']];
 for(const [id,title]of cases)assert.equal(matchesLessonVideo(title,context(id)),false,id+' '+title);
});

test('aulas compostas admitem a parte explicitamente ensinada e nomes equivalentes',()=>{
 const cases=[['math.m05.t03','Medidas de volume: conversão de unidades'],['math.m07.t05','Sistemas de equações do 2º grau'],['math.m08.t03','Plano cartesiano e produto cartesiano'],['math.m08.t07','Coeficiente angular da reta'],['math.m11.t08','Juros compostos: como calcular o montante'],['math.m12.t07','Sequência recursiva e não recursiva'],['math.m17.t06','Sistema de equações: representação gráfica'],['math.m19.t07','Permutação circular'],['math.m21.t02','Equivalência de taxas'],['math.m23.t08','Variância e desvio padrão'],['math.m25.t02','Regra de Cramer']];
 for(const [id,title]of cases)assert.ok(matchesLessonVideo(title,context(id)),id+' '+title);
 const wrong=[['math.m05.t02','Conversão de unidades: graus e radianos'],['math.m06.t01','Variáveis qualitativas e quantitativas na estatística'],['math.m11.t03','Inequações exponenciais'],['math.m25.t05','Inequações modulares'],['math.m04.t02','Potenciação em 10 minutos'],['math.m16.t03','Esfera condutora e carga elétrica']];
 for(const [id,title]of wrong)assert.equal(matchesLessonVideo(title,context(id)),false,id+' '+title);
});

test('operações básicas não aceitam matrizes, sistemas ou divisões proporcionais',()=>{
 const lesson=context('math.m01.t05');
 for(const title of ['Sistema de equações do primeiro grau: método da adição','Multiplicação de matrizes','Operações com matrizes: adição, subtração e multiplicação','Divisão proporcional','Divisão de números em partes proporcionais','Grandezas diretamente e inversamente proporcionais: divisão','Potência de dez e notação científica: operações e ordem de grandeza'])assert.equal(matchesLessonVideo(title,lesson),false,title);
 assert.ok(matchesLessonVideo('Operações fundamentais: multiplicação e divisão com decimais',lesson));
});

test('associação explícita ainda exige autoria, disponibilidade e assunto corretos',async()=>{
 const candidate={id:'abcdefghijk',channelHandle:'professorferretto',topic:'finance',lessonIds:['math.m21.t01'],curated:true};
 const lesson=context('math.m21.t01');
 const check=(title,author='https://www.youtube.com/@professorferretto',status=200)=>verifyYouTubeVideo(candidate,'finance',{lesson,useCache:false,fetchImpl:async()=>new Response(JSON.stringify({title,author_url:author}),{status})});
 assert.ok(await check('Juros compostos e capitalização composta'));
 assert.equal(await check('Juros simples'),null);
 assert.equal(await check('Juros compostos','https://www.youtube.com/@outrocanal'),null);
 assert.equal(await check('Juros compostos',undefined,404),null);
 const rows=await recommendVideos('finance','professorferretto',{lesson,useCache:false,seedVideos:[candidate],fetchImpl:async url=>String(url).includes('/oembed?')?new Response(JSON.stringify({title:'Juros compostos',author_url:'https://www.youtube.com/@professorferretto'})):new Response('var ytInitialData = {};')});
 assert.deepEqual(rows.map(v=>v.id),[candidate.id]);
});

test('metadados antigos de outro assunto não esgotam a verificação da aula correta',async()=>{
 const lesson=context('math.m18.t06'),checks=[];
 const seeds=Array.from({length:20},(_,i)=>({id:'bad'+String(i).padStart(8,'0'),title:'Média aritmética',channelHandle:'professorferretto',topic:'statistics',lessonIds:[lesson.id]}));
 seeds.push({id:'goodVideo01',title:'Quartis e boxplot',channelHandle:'professorferretto',topic:'statistics',lessonIds:[lesson.id]});
 const videos=await recommendVideos('statistics','professorferretto',{lesson,seedVideos:seeds,useCache:false,fetchImpl:async url=>{
  if(String(url).includes('/oembed?')){checks.push(new URL(url).searchParams.get('url'));return new Response(JSON.stringify({title:'Quartis e boxplot',author_url:'https://www.youtube.com/@professorferretto'}));}
  return new Response('var ytInitialData = {};');
 }});
 assert.deepEqual(videos.map(v=>v.id),['goodVideo01']);
 assert.equal(checks.length,1);
});
