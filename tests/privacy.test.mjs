import test from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';

test('gitignore protects credentials, exports, packages and local hosting state while retaining source',async()=>{
 const privatePaths=['.env','.env.production','.secrets/provider.json','android/.android-signing/release.jks','android/.android-signing/signing.properties','android/local.properties','private-key.pem','key.p12','credentials.local.json','tokens.local.json','equacao-historico-2026-01-01.json','equacao-backup.json','backups/progress.json','exports/progress.json','outputs/screenshot.png','app.apk','android/app/build/outputs/app-release.apk','.openai/hosting.json'];
 const sourcePaths=['.env.example','.env.sample','public/answer-shuffle.js','public/backup-model.js','android/gradle.properties','android/app/build.gradle','content/math-curriculum.md','SECURITY.md','scripts/check-privacy.mjs'];
 const check=async paths=>{
  const child=execFile('git',['check-ignore','--no-index','--stdin'],{encoding:'utf8'});
  child.stdin.end(paths.join('\n')+'\n');
  return await new Promise((resolve,reject)=>{let output='';child.stdout.on('data',x=>output+=x);child.on('error',reject);child.on('close',code=>[0,1].includes(code)?resolve(new Set(output.trim().split('\n').filter(Boolean))):reject(new Error('git check-ignore failed')));});
 };
 const ignored=await check([...privatePaths,...sourcePaths]);
 for(const path of privatePaths)assert.ok(ignored.has(path),`${path} must remain private`);
 for(const path of sourcePaths)assert.ok(!ignored.has(path),`${path} must remain available as source`);
});
