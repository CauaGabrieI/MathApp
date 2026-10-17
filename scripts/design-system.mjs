import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(import.meta.dirname,'..');

export async function generateDesignSystem({check=false}={}) {
  const tokens=JSON.parse(await fs.readFile(path.join(root,'design/tokens.json'),'utf8'));
  const declarations=[];
  for(const [group,values] of Object.entries({font:tokens.font,'font-size':tokens.fontSize,'line-height':tokens.lineHeight,space:tokens.space,radius:tokens.radius,duration:tokens.duration,size:tokens.size})){
    for(const [name,value] of Object.entries(values))declarations.push(`  --eq-${group}-${name}: ${value};`);
  }
  const theme=name=>Object.entries(tokens.themes[name]).map(([key,value])=>`  --eq-color-${key}: ${value};`).concat(Object.entries(tokens.shadow[name]).map(([key,value])=>`  --eq-shadow-${key}: ${value};`)).join('\n');
  const aliases={'bg':'color-canvas','surface':'color-surface','ink':'color-text','muted':'color-text-secondary','line':'color-border','primary':'color-primary','primary-dark':'color-primary-hover','lavender':'color-primary-container','green':'color-success','red':'color-error','shadow':'shadow-card','font':'font-body','heading':'font-heading'};
  let css='/* Generated from design/tokens.json by scripts/design-system.mjs. */\n:root {\n'+declarations.join('\n')+'\n'+theme('light')+'\n'+Object.entries(aliases).map(([key,value])=>`  --${key}: var(--eq-${value});`).join('\n')+'\n  color-scheme: light;\n}\nhtml[data-theme="dark"] {\n'+theme('dark')+'\n  color-scheme: dark;\n}\n';
  const colorName=name=>'eq_'+name.replaceAll('-','_');
  const color=value=>value.length===9?'#'+value.slice(7)+value.slice(1,7):value;
  const xml=(dark=false)=>'<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated from design/tokens.json. -->\n<resources>\n'+(dark?'':Object.entries(tokens.themes).flatMap(([mode,values])=>Object.entries(values).map(([name,value])=>`    <color name="${colorName(mode+'-'+name)}">${color(value)}</color>`)).join('\n')+'\n')+Object.keys(tokens.themes.light).map(name=>`    <color name="${colorName('color-'+name)}">@color/${colorName((dark?'dark':'light')+'-'+name)}</color>`).join('\n')+'\n</resources>\n';
  const files={'public/design-tokens.css':css,'android/app/src/main/res/values/design_tokens.xml':xml(),'android/app/src/main/res/values-night/design_tokens.xml':xml(true)};
  for(const [file,content] of Object.entries(files)){
    const target=path.join(root,file);
    if(check){if(await fs.readFile(target,'utf8')!==content)throw new Error(`Tokens desatualizados: ${file}`);}
    else{await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,content);}
  }
  return tokens;
}

export async function exportDesignGuide(output){
  let html=await fs.readFile(path.join(root,'public/design-system.html'),'utf8');
  for(const file of ['design-tokens.css','components.css','design-system.css'])html=html.replace(new RegExp(`<link rel="stylesheet" href="/?${file.replaceAll('.','\\.')}[^\"]*">`),'<style>\n'+(await fs.readFile(path.join(root,'public',file),'utf8')).replace(/^@import[^;]+;\s*/, '')+'\n</style>');
  let fonts='';
  for(const [file,family,weight]of [['dm-sans','DM Sans','100 900'],['manrope','Manrope','200 800']])fonts+=`@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${(await fs.readFile(path.join(root,'android/fonts',file+'.woff2'))).toString('base64')})}\n`;
  html=html.replace('<!-- fonts -->','<style>'+fonts+'</style>');
  html=html.replace(/<script type="module" src="\/?design-system\.js[^\"]*"><\/script>/,'<script type="module">\n'+await fs.readFile(path.join(root,'public/design-system.js'),'utf8')+'\n</script>');
  await fs.writeFile(output,html);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  await generateDesignSystem({check:process.argv.includes('--check')});
  const at=process.argv.indexOf('--export');if(at>=0)await exportDesignGuide(path.resolve(process.argv[at+1]));
  console.log('Design tokens for web and Android are consistent.');
}
