// Curriculum identities, order and titles come exclusively from the imported Markdown.
// These associations add existing support material; they never replace a curriculum lesson.
import {guideForLesson} from './lesson-guides.mjs';
const rid = (module, lesson) => `roadmap.m${String(module).padStart(2, '0')}.l${String(lesson).padStart(2, '0')}`;
const tid = (module, lesson) => `math.m${String(module).padStart(2, '0')}.t${String(lesson).padStart(2, '0')}`;
const ASSOCIATIONS = {
  1: { 1:[[2,3]], 2:[[2,3]], 3:[[1,3]], 4:[[1,4]], 5:[[1,1]], 6:[[1,2]], 7:[[1,6]], 8:[[1,7]], 10:[[1,8]] },
  2: { 1:[[1,18]], 2:[[1,18]], 3:[[1,19]], 4:[[1,20]], 6:[[1,21]] },
  3: { 1:[[1,3],[1,22]], 2:[[1,22]], 3:[[1,22]], 7:[[1,23]], 8:[[1,23]] },
  4: { 1:[[1,9]], 2:[[1,9]], 3:[[1,10]], 5:[[1,12]], 6:[[1,12]], 8:[[1,12]] },
  5: { 1:[[1,11]], 2:[[1,11]], 3:[[1,11]], 4:[[4,1],[5,5]] },
  6: { 1:[[1,15]], 2:[[1,13]], 3:[[1,13]], 4:[[1,14]], 6:[[1,15]], 7:[[3,8]], 8:[[1,16]], 9:[[1,15],[1,16]] },
  7: { 1:[[1,17]], 2:[[1,17]], 3:[[1,17]], 4:[[1,17]], 8:[[3,8],[3,4]] },
  8: { 1:[[3,1]], 2:[[3,1],[3,9]], 3:[[3,7]], 4:[[10,1]], 5:[[3,7]], 6:[[3,3],[3,4]], 7:[[3,3]], 8:[[3,3],[3,4]], 9:[[3,6],[11,1]] },
  9: { 1:[[3,3]], 2:[[3,3],[10,3]], 3:[[3,3],[3,7]], 4:[[3,3]], 5:[[3,3],[3,8]], 6:[[3,2],[3,3]], 7:[[1,16]], 8:[[3,3]] },
  10: { 1:[[3,4]], 2:[[3,4],[3,5]], 3:[[3,5]], 4:[[3,4],[3,8]], 5:[[3,4]], 6:[[3,5]], 7:[[3,4]] },
  11: { 1:[[3,13]], 2:[[3,13]], 3:[[3,14]], 4:[[3,15]], 5:[[3,15]], 6:[[3,16]], 7:[[3,16]], 8:[[3,13],[1,23]] },
  12: { 1:[[7,1]], 2:[[7,2]], 3:[[7,2]], 4:[[7,3]], 5:[[7,3]], 6:[[7,3]], 8:[[1,23],[7,3]] },
  13: { 1:[[4,1]], 3:[[4,2]], 4:[[4,2],[4,6]], 5:[[4,3],[4,8]], 7:[[4,12]], 8:[[4,12]] },
  14: { 1:[[4,5],[4,6]], 2:[[4,6]], 3:[[4,7],[4,11]], 4:[[5,4]], 5:[[4,7]], 8:[[4,10]] },
  15: { 1:[[5,1],[5,2]], 2:[[5,2]], 3:[[5,3]], 4:[[5,3]], 5:[[5,5]], 6:[[5,6]], 7:[[5,5]], 8:[[5,6]] },
  16: { 1:[[6,3],[6,4]], 2:[[6,3]], 3:[[6,5],[6,6]], 5:[[6,3],[6,4],[6,5],[6,6]], 6:[[6,3],[6,4],[6,5],[6,6]], 7:[[4,11],[6,7]] },
  17: { 1:[[10,1]], 3:[[10,3]], 4:[[10,3]], 5:[[10,4]], 6:[[10,3],[10,4]], 7:[[10,5]], 8:[[10,2]] },
  18: { 1:[[9,1]], 2:[[9,1]], 3:[[9,2]], 4:[[9,3]] },
  19: { 1:[[8,1]], 2:[[8,1]], 3:[[8,3],[8,2]], 4:[[8,4]], 5:[[8,7]], 6:[[8,6]], 7:[[8,1],[8,5]], 8:[[8,1]] },
  20: { 1:[[8,8]], 2:[[8,8]], 4:[[8,9],[2,2]], 5:[[8,9]], 7:[[8,6],[8,8]], 8:[[8,9]] },
  21: { 1:[[1,23]], 3:[[1,23]], 5:[[1,23]] },
  22: { 2:[[3,10],[3,11]], 3:[[3,7]], 4:[[3,5]], 5:[[3,6],[11,1]], 6:[[3,4],[3,13]], 7:[[3,2],[3,13]] },
  23: {},
  24: { 1:[[4,8],[1,18]], 2:[[8,6],[8,8]], 3:[[3,3],[1,23]], 4:[[6,3],[1,11]], 5:[[5,2]], 6:[[9,1]], 7:[[1,11]] },
  25: { 1:[[11,7]], 3:[[11,3]], 4:[[11,2]], 5:[[3,12]], 6:[[11,5]], 7:[[2,1],[2,2],[2,3]] },
};

// A completed old lesson is migrated only for a direct equivalent. A related
// resource (or a broad lesson split over several new lessons) grants no credit.
const DIRECT_EQUIVALENTS = {
  '1.5':[[1,1]], '1.6':[[1,2]], '1.7':[[1,6]], '1.8':[[1,7]], '1.10':[[1,8]],
  '2.3':[[1,19]], '2.4':[[1,20]], '2.6':[[1,21]], '3.2':[[1,22]],
  '4.1':[[1,9]], '4.3':[[1,10]], '5.2':[[1,11]],
  '6.3':[[1,13]], '6.4':[[1,14]], '6.6':[[1,15]], '6.8':[[1,16]],
  '7.1':[[1,17]], '8.1':[[3,1]], '8.9':[[3,6],[11,1]],
  '10.3':[[3,5]], '11.2':[[3,13]], '11.3':[[3,14]], '11.6':[[3,16]],
  '12.1':[[7,1]], '13.3':[[4,2]], '13.8':[[4,12]], '14.5':[[4,7]],
  '15.5':[[5,5]], '15.6':[[5,6]], '17.4':[[10,3]], '17.7':[[10,5]], '17.8':[[10,2]],
  '18.3':[[9,2]], '18.4':[[9,3]], '19.3':[[8,3]], '19.4':[[8,4]],
  '19.5':[[8,7]], '19.6':[[8,6]], '25.5':[[3,12]],
};
const DESCRIPTIONS = [
  'Reconheça os conjuntos numéricos, organize cálculos e use propriedades das operações para resolver problemas.',
  'Compare grandezas, identifique relações proporcionais e interprete razões, taxas e escalas.',
  'Relacione porcentagens, variações e juros para analisar situações financeiras do cotidiano.',
  'Use potências, raízes e notação científica para representar números e simplificar cálculos.',
  'Converta unidades e avalie estimativas, precisão e erros nas medidas.',
  'Represente relações com expressões algébricas, equações, inequações e sistemas.',
  'Estude equações quadráticas, raízes e operações com polinômios.',
  'Entenda a correspondência entre grandezas e conecte fórmulas, tabelas e gráficos.',
  'Interprete taxas constantes, retas e modelos de tarifas por meio da função afim.',
  'Explore parábolas, zeros, extremos e situações de otimização.',
  'Descreva crescimento exponencial e use logaritmos para interpretar escalas e modelos.',
  'Reconheça padrões e calcule termos e somas de progressões aritméticas e geométricas.',
  'Investigue ângulos, triângulos, semelhança e relações métricas fundamentais.',
  'Compare polígonos e círculos e estude perímetros, áreas e relações geométricas.',
  'Relacione ângulos e comprimentos e interprete representações trigonométricas.',
  'Estude sólidos, suas representações, áreas, volumes e relações de escala.',
  'Use coordenadas para analisar pontos, retas, circunferências e áreas.',
  'Organize dados e interprete medidas de posição, dispersão e representações gráficas.',
  'Conte possibilidades com princípios de contagem, permutações, arranjos e combinações.',
  'Descreva eventos e analise probabilidades em situações simples e de múltiplas etapas.',
  'Compare regimes financeiros, taxas, investimentos e efeitos da inflação.',
  'Integre diferentes funções para interpretar gráficos e construir modelos contextualizados.',
  'Examine amostras, associações e variabilidade ao interpretar dados e conclusões.',
  'Conecte conteúdos matemáticos na resolução e interpretação de problemas integrados.',
  'Explore matrizes, complexos, cônicas, conjuntos e outras ferramentas complementares.',
];
const unique = values => [...new Set(values)];

export function createLearningPath(curriculum, legacyRoadmap, legacyIndex) {
  const oldLessons = new Map(legacyRoadmap.modules.flatMap(module => module.lessons.map(lesson => [lesson.id, lesson])));
  const lessonQuestions = {}, moduleQuestions = {};
  const modules = curriculum.modules.map(module => {
    const lessons = module.topics.map(topic => {
      const key = `${module.order}.${topic.order}`;
      const resources = (ASSOCIATIONS[module.order]?.[topic.order] ?? []).map(([m,l]) => {
        const resource = oldLessons.get(rid(m,l));
        if (!resource) throw new Error(`Recurso ausente para ${topic.id}: ${rid(m,l)}`);
        return structuredClone(resource);
      });
      // Inline lessons and module exams use only questions exclusively tagged to
      // this module. Multi-module questions remain available through the global
      // practice pool after every required module is completed.
      const exclusiveQuestions = (legacyIndex.topicQuestions[topic.id] ?? []).filter(id => {
        const tags = legacyIndex.questionTags[id];
        return tags?.moduleIds?.length === 1 && tags.moduleIds[0] === module.id;
      });
      const questionIds = unique([...resources.flatMap(resource => resource.questionIds), ...exclusiveQuestions]);
      lessonQuestions[topic.id] = questionIds;
      const legacyIds = (DIRECT_EQUIVALENTS[key] ?? []).map(([m,l]) => rid(m,l));
      const guide = guideForLesson(topic,module);
      const card = resources[0]?.card
        ? {...resources[0].card, id:topic.id}
        : guide?.example?.question && guide?.example?.answer
          ? {id:topic.id,question:guide.example.question,answer:guide.example.answer}
          : undefined;
      return {id:topic.id,title:topic.title,order:topic.order,resources,questionIds,legacyIds,
        ...(card ? {card} : {}),
        videoTopic:resources[0]?.videoTopic ?? 'basics',videoTerms:topic.title,
        guide,
      };
    });
    moduleQuestions[module.id] = unique(lessons.flatMap(lesson => lesson.questionIds));
    return {...module,description:DESCRIPTIONS[module.order-1],lessons};
  });
  // The curriculum levels remain on each module as difficulty metadata. The
  // learner-facing path is a single subject, so modules are never split into
  // separate stages by level.
  const stages = [{
    id:'stage.math', title:'Matemática',
    description:'Estude os 25 módulos no seu ritmo, com recomendações de base entre os assuntos.',
    order:1, moduleIds:modules.map(module=>module.id),
  }];
  const requiredModules = Object.fromEntries(Object.entries(legacyIndex.questionTags).filter(([,tags])=>tags.moduleIds?.length).map(([id,tags])=>[id,[...tags.moduleIds]]));
  const path = {schemaVersion:2,title:'Seu caminho de aprendizagem',source:curriculum.source,prerequisitePolicy:'recommended',
    prerequisiteNote:curriculum.prerequisiteNote,stages,modules,
    // Full original modules retain the context of pre-existing exams and attempts;
    // none of these archived IDs count toward the new curriculum's progression.
    archiveModules:structuredClone(legacyRoadmap.modules).map(module=>({...module,archived:true})),
  };
  const index = {schemaVersion:2,method:'markdown_curriculum_with_editorial_resource_associations',requiredModules,lessonQuestions,moduleQuestions,
    description:'As aulas seguem integralmente o currículo Markdown. Materiais existentes são apoios explicitamente relacionados; questões ENEM exigem todos os módulos temáticos indicados no índice curricular.'};
  return {path,index};
}
