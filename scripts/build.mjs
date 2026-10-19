import {approvedExercises} from '../content/pedagogy-exercises.mjs';
import {MODULE01_LESSONS} from '../content/review/module01.mjs';
import {createLearningPath} from '../content/learning-path.mjs';
import {parseMathMarkdown,buildCurriculum} from './import-curriculum.mjs';
import {pathVideoSeeds} from '../content/path-video-seeds.mjs';
import {createRoadmap} from '../content/roadmap.mjs';
import {validateRoadmap,roadmapIndex} from '../public/journey-model.js';
import {generateDesignSystem} from './design-system.mjs';
import fs from 'node:fs/promises';
import {normalizeSources,LEVELS} from '../public/core.js';
import {makeCurriculumIndex} from '../question-classifier.js';
import {validateLearningCurriculum} from '../public/learning-model.js';
await generateDesignSystem();
const hub=JSON.parse(await fs.readFile('public/enemhub.json','utf8'));
const dev=JSON.parse(await fs.readFile('public/enemdev.json','utf8'));
const bank=normalizeSources(hub,dev);
await fs.writeFile('public/bank.json',JSON.stringify(bank));
const curriculum=buildCurriculum(parseMathMarkdown(await fs.readFile('content/math-curriculum.md','utf8')),JSON.parse(await fs.readFile('public/curriculum.json','utf8')));validateLearningCurriculum(curriculum);
await fs.writeFile('public/curriculum.json',JSON.stringify(curriculum,null,2)+'\n');
const legacyIndex=makeCurriculumIndex(bank,curriculum);
await fs.writeFile('public/curriculum-index.json',JSON.stringify(legacyIndex));
const {roadmap,questions:studyBank}=createRoadmap();validateRoadmap(roadmap);
await fs.writeFile('public/roadmap.json',JSON.stringify(roadmap));
studyBank.push(...approvedExercises(MODULE01_LESSONS,curriculum));
await fs.writeFile('public/study-bank.json',JSON.stringify(studyBank));
await fs.writeFile('public/roadmap-index.json',JSON.stringify(roadmapIndex(roadmap,legacyIndex)));
const {path:learningPath,index:learningPathIndex}=createLearningPath(curriculum,roadmap,legacyIndex,{theoryCandidates:MODULE01_LESSONS,preview:process.env.PEDAGOGY_PREVIEW==='1'});validateRoadmap(learningPath);
await fs.writeFile('public/learning-path.json',JSON.stringify(learningPath));
await fs.writeFile('public/learning-path-index.json',JSON.stringify(learningPathIndex));

const files=(await fs.readdir('public')).filter(file=>!['questions.json','enemdev.json','enemhub.json'].includes(file));const assets={};
const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',json:'application/json; charset=utf-8',webmanifest:'application/manifest+json',svg:'image/svg+xml',png:'image/png'};
for(const file of files){const buffer=await fs.readFile(`public/${file}`);assets['/'+(file==='index.html'?'':file)]={body:buffer.toString('base64'),type:types[file.split('.').pop()]??'application/octet-stream'};}
const core=(await fs.readFile('public/core.js','utf8')).replace(/export /g,'');
const videoTopics=(await fs.readFile('public/video-topics.js','utf8')).replace(/export /g,'');
const lessonTopics=(await fs.readFile('public/lesson-topics.js','utf8')).replace(/^import[^;]+;\s*/gm,'').replace(/export /g,'');
const videoService=(await fs.readFile('video-service.js','utf8')).replace(/^import[^;]+;\s*/gm,'').replace(/export /g,'');
let roadmapVideos=[];try{roadmapVideos=JSON.parse(await fs.readFile('video-catalog-roadmap.json','utf8'));}catch{}
const videoSeeds=pathVideoSeeds(learningPath,[...JSON.parse(await fs.readFile('video-catalog.json','utf8')),...roadmapVideos]);
const githubService=(await fs.readFile('github-service.js','utf8')).replace(/export /g,'');
const githubClientId=JSON.parse(await fs.readFile('public/github-config.json','utf8')).clientId;
const worker=await fs.readFile('worker.js','utf8');
await fs.mkdir('dist/server',{recursive:true});await fs.mkdir('dist/.openai',{recursive:true});
await fs.writeFile('dist/server/index.js',`const ASSETS=${JSON.stringify(assets)};\nconst BANK=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(ASSETS['/bank.json'].body),c=>c.charCodeAt(0))));\n${core}\n${videoTopics}\n${lessonTopics}\nconst ROADMAP=${JSON.stringify(roadmap)};\nconst CURRICULUM=${JSON.stringify(curriculum)};\nconst VIDEO_SEEDS=${JSON.stringify(videoSeeds)};\n${videoService}\nconst GITHUB_CLIENT_ID=${JSON.stringify(githubClientId)};\n${githubService}\n${worker}`);
// Hosting identity is local deployment configuration, not public application source.
try{await fs.copyFile('.openai/hosting.json','dist/.openai/hosting.json');}catch(error){if(error.code!=='ENOENT')throw error;}
console.log(`Built worker with ${files.length} assets, ${bank.filter(q=>q.source==='enemdev').length} enem.dev + ${bank.filter(q=>q.source==='enemhub').length} EnemHub questions.`);
console.log('Level distribution:',Object.keys(LEVELS).map(l=>[l,bank.filter(q=>q.source==='enemdev'&&q.level===l).length,bank.filter(q=>q.source==='enemhub'&&q.level===l).length]));
