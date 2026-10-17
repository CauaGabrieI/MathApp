import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Source module numbers anchor identities; source titles are display text only.
const moduleId = number => `math.m${String(number).padStart(2, '0')}`;
const BRANCHES = [
  { id: 'numbers', title: 'Números e operações', description: 'Operações, potências, radicais, unidades e estimativas.', color: '#6de4ae' },
  { id: 'ratios', title: 'Razões, proporções e matemática financeira', description: 'Razões, porcentagens e decisões financeiras.', color: '#ffd07a' },
  { id: 'algebra', title: 'Álgebra e equações', description: 'Expressões, equações, sistemas e polinômios.', color: '#a79bff' },
  { id: 'functions', title: 'Funções e gráficos', description: 'Gráficos, relações entre variáveis e padrões de crescimento.', color: '#60c4ff' },
  { id: 'geometry', title: 'Geometria e trigonometria', description: 'Formas, ângulos, áreas, volumes e coordenadas.', color: '#f29bc7' },
  { id: 'statistics', title: 'Estatística', description: 'Organização de dados, variabilidade e interpretação de resultados.', color: '#f3ae70' },
  { id: 'probability', title: 'Combinatória e probabilidade', description: 'Possibilidades, eventos e incerteza.', color: '#77d4d7' },
  { id: 'modeling', title: 'Modelagem e problemas avançados', description: 'Modelos, conexões entre conteúdos e tópicos complementares.', color: '#d0d780' },
];
const BRANCH_MODULES = {
  numbers: [1, 4, 5], ratios: [2, 3, 21], algebra: [6, 7], functions: [8, 9, 10, 11, 12],
  geometry: [13, 14, 15, 16, 17], statistics: [18, 23], probability: [19, 20], modeling: [22, 24, 25],
};
// Editorial recommendations, intentionally independent of the source's linear route.
const PREREQUISITES = {
  1: [], 2: [1], 3: [2], 4: [1], 5: [1, 4], 6: [1, 4], 7: [6], 8: [6, 2],
  9: [8], 10: [8, 7], 11: [8, 4], 12: [6, 4], 13: [2, 5, 6], 14: [13],
  15: [14, 8], 16: [14], 17: [9, 14], 18: [2, 4], 19: [1], 20: [19, 2],
  21: [3, 11, 12], 22: [9, 10, 11], 23: [18, 20, 9],
  24: [15, 16, 20, 21, 22, 23], 25: [7, 15, 17, 22],
};
const FOUNDATIONS = [
  {
    id: 'math.foundation.interpretation', title: 'Interpretação de problemas',
    description: 'Apoio transversal para compreender informações, comandos e unidades antes de calcular.',
    sourceDiscipline: 'Leitura e estudo', sourceModules: ['Leitura literal', 'Interpretação inicial', 'Habilidades transversais'],
    skills: ['Leitura de enunciados e comandos', 'Informações explícitas', 'Inferências simples', 'Interpretar comandos e unidades', 'Reconhecer estimativas plausíveis'],
    informational: true,
  },
  {
    id: 'math.foundation.visual', title: 'Leitura de gráficos e representações',
    description: 'Apoio transversal para relacionar informações verbais, tabelas, imagens e gráficos.',
    sourceDiscipline: 'Leitura e estudo', sourceModules: ['Linguagens visuais', 'Habilidades transversais'],
    skills: ['Tabelas e gráficos elementares', 'Infográficos', 'Mapas e legendas', 'Relação texto e imagem', 'Relacionar texto, imagem e gráficos'],
    informational: true,
  },
];

export function parseMathMarkdown(markdown) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const start = lines.findIndex(line => /^##\s+(?:📐\s*)?Matemática\s*—\s*Matemática\s*$/u.test(line));
  if (start < 0) throw new Error('Seção Matemática — Matemática não encontrada.');
  const modules = [];
  let current;
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line)) break;
    const heading = line.match(/^###\s+\[(Básico|Intermediário|Avançado)\]\s+(\d+)\.\s+(.+?)\s*$/u);
    if (heading) {
      current = { sourceNumber: Number(heading[2]), title: heading[3], level: heading[1], sourceStudyAfter: '', topics: [] };
      modules.push(current);
      continue;
    }
    if (/^###\s/.test(line)) throw new Error(`Cabeçalho de módulo inválido: ${line}`);
    if (!current) continue;
    const studyAfter = line.match(/^\*\*Estudar depois de:\*\*\s*(.+)$/u);
    if (studyAfter) { current.sourceStudyAfter = studyAfter[1].trim(); continue; }
    const topic = line.match(/^\s*-\s+\[[ xX]\]\s+(.+?)\s*$/u);
    if (topic) current.topics.push(topic[1]);
  }
  if (modules.length !== 25) throw new Error(`Esperados 25 módulos; encontrados ${modules.length}.`);
  modules.forEach((module, index) => {
    if (module.sourceNumber !== index + 1) throw new Error('Os números de origem devem cobrir 01 a 25 uma vez, em ordem.');
    if (!module.topics.length || !module.sourceStudyAfter) throw new Error(`Módulo ${module.sourceNumber} incompleto.`);
  });
  return modules;
}

function preserveTopicIds(sourceTopics, previousTopics, id) {
  const used = new Set();
  const allOldIds = new Set(previousTopics.map(topic => topic.id));
  // Match existing titles only to preserve identity on a harmless source reordering.
  const matches = sourceTopics.map(title => {
    const match = previousTopics.find(topic => topic.title === title && !used.has(topic.id));
    if (match) used.add(match.id);
    return match;
  });
  // A changed title can keep its original slot, provided that slot was not moved elsewhere.
  matches.forEach((match, index) => {
    if (!match && previousTopics[index] && !used.has(previousTopics[index].id)) {
      matches[index] = previousTopics[index];
      used.add(previousTopics[index].id);
    }
  });
  let next = Math.max(0, ...previousTopics.map(topic => Number(topic.id.match(/\.t(\d+)$/)?.[1]) || 0));
  return sourceTopics.map((title, index) => {
    let topicId = matches[index]?.id;
    if (!topicId) {
      do { topicId = `${id}.t${String(++next).padStart(2, '0')}`; } while (allOldIds.has(topicId) || used.has(topicId));
      used.add(topicId);
    }
    return { id: topicId, title, order: index + 1 };
  });
}

export function buildCurriculum(sourceModules, previous = null) {
  const previousModules = previous?.modules ?? [];
  const ids = new Map(sourceModules.map(module => {
    const existing = previousModules.find(old => (old.sourceNumber ?? old.order) === module.sourceNumber);
    return [module.sourceNumber, existing?.id ?? moduleId(module.sourceNumber)];
  }));
  const modules = sourceModules.map(source => {
    const id = ids.get(source.sourceNumber);
    const old = previousModules.find(module => module.id === id);
    const branchId = Object.entries(BRANCH_MODULES).find(([, numbers]) => numbers.includes(source.sourceNumber))[0];
    return {
      id, title: source.title, level: source.level, order: source.sourceNumber, sourceNumber: source.sourceNumber,
      branchId: old?.branchId ?? branchId,
      prerequisiteIds: old?.prerequisiteIds ?? PREREQUISITES[source.sourceNumber].map(number => ids.get(number)),
      sourceStudyAfter: source.sourceStudyAfter,
      topics: preserveTopicIds(source.topics, old?.topics ?? [], id),
    };
  });
  const curriculum = {
    version: previous?.version ?? 1,
    discipline: { id: previous?.discipline?.id ?? 'math', title: 'Matemática' },
    prerequisitePolicy: 'recommended',
    prerequisiteNote: 'Dependências pedagógicas recomendadas, sem bloqueio obrigatório. A ordem textual de origem é preservada separadamente em sourceStudyAfter.',
    source: { markdown: 'ENEM_mapa_mental_completo.md', referenceHtml: 'ENEM_mapa_mental_interativo.html', section: 'Matemática — Matemática' },
    branches: BRANCHES.map(branch => ({ ...branch, ...previous?.branches?.find(old => old.id === branch.id) })),
    foundations: previous?.foundations ?? FOUNDATIONS,
    modules,
  };
  validateCurriculum(curriculum, { expectedTopics: sourceModules.reduce((sum, module) => sum + module.topics.length, 0) });
  return curriculum;
}

export function validateCurriculum(curriculum, { expectedTopics } = {}) {
  if (curriculum.modules.length !== 25) throw new Error('O currículo precisa conter 25 módulos.');
  const branchIds = new Set(curriculum.branches.map(branch => branch.id));
  if (branchIds.size !== 8 || Object.keys(BRANCH_MODULES).some(id => !branchIds.has(id))) throw new Error('Os oito ramos curriculares devem existir uma vez.');
  const ids = new Set();
  const register = (id, kind) => {
    if (typeof id !== 'string' || !id || ids.has(id)) throw new Error(`ID ${kind} inválido ou duplicado: ${id}`);
    ids.add(id);
  };
  let topicCount = 0;
  for (const module of curriculum.modules) {
    register(module.id, 'de módulo');
    if (!branchIds.has(module.branchId)) throw new Error(`Ramo desconhecido em ${module.id}.`);
    if (!['Básico', 'Intermediário', 'Avançado'].includes(module.level)) throw new Error(`Nível inválido em ${module.id}.`);
    if (!Array.isArray(module.prerequisiteIds) || new Set(module.prerequisiteIds).size !== module.prerequisiteIds.length) throw new Error(`Dependências inválidas em ${module.id}.`);
    if (!module.topics.length) throw new Error(`Módulo sem subtópicos: ${module.id}.`);
    module.topics.forEach((topic, index) => {
      register(topic.id, 'de subtópico');
      if (!topic.title || topic.order !== index + 1) throw new Error(`Subtópico inválido em ${module.id}.`);
      topicCount++;
    });
  }
  if (expectedTopics !== undefined && topicCount !== expectedTopics) throw new Error('A contagem de subtópicos diverge do Markdown.');
  const byId = new Map(curriculum.modules.map(module => [module.id, module]));
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) throw new Error(`Ciclo de dependências envolvendo ${id}.`);
    if (visited.has(id)) return;
    const module = byId.get(id);
    if (!module) throw new Error(`Referência de pré-requisito desconhecida: ${id}.`);
    visiting.add(id);
    module.prerequisiteIds.forEach(visit);
    visiting.delete(id);
    visited.add(id);
  }
  curriculum.modules.forEach(module => visit(module.id));
  return { modules: curriculum.modules.length, topics: topicCount, branches: branchIds.size };
}

async function main() {
  const sourcePath = process.argv[2];
  if (!sourcePath) throw new Error('Uso: node scripts/import-curriculum.mjs caminho/arquivo.md [public/curriculum.json]');
  const outputPath = resolve(process.argv[3] ?? fileURLToPath(new URL('../public/curriculum.json', import.meta.url)));
  let previous = null;
  try { previous = JSON.parse(await readFile(outputPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const sourceModules = parseMathMarkdown(await readFile(resolve(sourcePath), 'utf8'));
  const curriculum = buildCurriculum(sourceModules, previous);
  const summary = validateCurriculum(curriculum);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(curriculum, null, 2)}\n`);
  console.log(`Currículo importado: ${summary.modules} módulos, ${summary.topics} subtópicos, ${summary.branches} ramos. ${outputPath}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
