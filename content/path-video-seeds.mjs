// Existing verified candidates can also be checked against the precise Markdown lesson.
// The title/channel/oEmbed checks still run before any suggestion is displayed.
export function pathVideoSeeds(path,seeds){return seeds.map(seed=>{if(!seed.lessonIds)return seed;const ids=new Set(seed.lessonIds);for(const module of path.modules)for(const lesson of module.lessons)if(lesson.resources?.some(resource=>seed.lessonIds.includes(resource.id)))ids.add(lesson.id);return {...seed,lessonIds:[...ids]};});}
