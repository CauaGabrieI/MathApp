import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {generateDesignSystem} from '../scripts/design-system.mjs';

function luminance(hex){
  const [r,g,b]=hex.slice(1).match(/../g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);
  return .2126*r+.7152*g+.0722*b;
}
function contrast(a,b){const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (values[0]+.05)/(values[1]+.05);}
test('textos, ações e estados mantêm contraste nos temas claro e escuro',async()=>{
  const {themes}=JSON.parse(await fs.readFile('design/tokens.json','utf8'));
  for(const [mode,c] of Object.entries(themes)){
    const pairs=[...['text','text-secondary','text-tertiary','primary'].flatMap(fg=>['canvas','surface','surface-subtle','primary-container'].map(bg=>[fg,bg])),['on-primary','primary'],['on-primary','primary-hover'],...['success','error','warning','info'].map(state=>[state,state+'-container'])];
    for(const [fg,bg]of pairs)assert.ok(contrast(c[fg],c[bg])>=4.5,`${mode}: ${fg}/${bg} = ${contrast(c[fg],c[bg]).toFixed(2)}:1`);
    for(const bg of ['canvas','surface'])assert.ok(contrast(c['border-strong'],c[bg])>=3,`${mode}: borda de controle em ${bg}`);
  }
});
test('tokens web e Android continuam derivados da mesma fonte',async()=>{
  await generateDesignSystem({check:true});
  const css=await fs.readFile('public/design-tokens.css','utf8');
  assert.equal(await fs.readFile('android/app/src/main/assets/design-tokens.css','utf8'),css);
});
