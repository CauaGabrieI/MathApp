import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {releaseMetadata} from '../scripts/android-release.mjs';

test('manifesto de atualização usa os dados do APK e a release exata do MathApp',()=>{
  const apk=Buffer.from('fixture-apk');
  const metadata=releaseMetadata({applicationId:'br.com.equacao.app',versionCode:3,versionName:'1.0.2',apk});
  assert.deepEqual(metadata,{schemaVersion:1,applicationId:'br.com.equacao.app',versionCode:3,versionName:'1.0.2',apk:{name:'equacao-android-1.0.2.apk',url:'https://github.com/CauaGabrieI/MathApp/releases/download/v1.0.2/equacao-android-1.0.2.apk',size:apk.length,sha256:createHash('sha256').update(apk).digest('hex')}});
});
test('publicação rejeita outro aplicativo, APK vazio e versões inválidas',()=>{
  const valid={applicationId:'br.com.equacao.app',versionCode:3,versionName:'1.0.2',apk:Buffer.from('apk')};
  for(const bad of [{applicationId:'other.app'},{versionCode:0},{versionCode:2.5},{versionCode:2147483648},{versionName:'../evil'},{versionName:'1.0.2-beta'},{apk:Buffer.alloc(0)}])assert.throws(()=>releaseMetadata({...valid,...bad}));
});
