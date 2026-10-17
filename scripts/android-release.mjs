import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const REPOSITORY='CauaGabrieI/MathApp';
export const RELEASE_SIGNER='cb2f8d2d2edf62d36e5fbf0506794028c7b0db9d8dfa45c429d69a38b81bb666';

export function releaseMetadata({versionCode,versionName,applicationId,apk}){
  if(!Number.isSafeInteger(versionCode)||versionCode<1||versionCode>2147483647||!/^\d{1,6}\.\d{1,6}\.\d{1,6}$/.test(versionName)||applicationId!=='br.com.equacao.app'||!Buffer.isBuffer(apk)||apk.length===0||apk.length>150*1024*1024)throw new Error('Dados inválidos para a versão Android.');
  const name=`equacao-android-${versionName}.apk`;
  return {schemaVersion:1,applicationId,versionCode,versionName,apk:{name,url:`https://github.com/${REPOSITORY}/releases/download/v${versionName}/${name}`,size:apk.length,sha256:createHash('sha256').update(apk).digest('hex')}};
}

function command(file,args){
  const result=spawnSync(file,args,{encoding:'utf8',maxBuffer:2*1024*1024});
  if(result.status!==0)throw new Error(`Falha ao executar ${path.basename(file)}: ${result.error?.message??result.stderr??result.stdout}`);
  return result.stdout;
}

export async function prepareRelease(apkFile,outputDir,{sdk=process.env.ANDROID_HOME??process.env.ANDROID_SDK_ROOT}={}){
  if(!sdk)throw new Error('Configure ANDROID_HOME para verificar a assinatura e os dados do APK.');
  const tools=path.join(sdk,'build-tools','36.0.0');
  const signer=command(path.join(tools,'apksigner'),['verify','--verbose','--print-certs',apkFile]);
  if(!signer.toLowerCase().includes(`signer #1 certificate sha-256 digest: ${RELEASE_SIGNER}`))throw new Error('O APK usa outra assinatura. Não pode atualizar as instalações existentes.');
  command(path.join(tools,'zipalign'),['-c','-P','16','4',apkFile]);
  const badging=command(path.join(tools,'aapt2'),['dump','badging',apkFile]);
  const identity=badging.match(/^package: name='([^']+)' versionCode='(\d+)' versionName='([^']+)'/m);
  if(!identity||badging.includes('application-debuggable'))throw new Error('O arquivo deve ser um APK release do Equação.');
  const metadata=releaseMetadata({applicationId:identity[1],versionCode:Number(identity[2]),versionName:identity[3],apk:await fs.readFile(apkFile)});
  await fs.mkdir(outputDir,{recursive:true});
  await fs.copyFile(apkFile,path.join(outputDir,metadata.apk.name));
  await fs.writeFile(path.join(outputDir,'android-update.json'),JSON.stringify(metadata,null,2)+'\n');
  await fs.writeFile(path.join(outputDir,metadata.apk.name+'.sha256'),metadata.apk.sha256+'  '+metadata.apk.name+'\n');
  return metadata;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=path.resolve(import.meta.dirname,'..');
  const metadata=await prepareRelease(path.resolve(process.argv[2]??path.join(root,'android/app/build/outputs/apk/release/app-release.apk')),path.resolve(process.argv[3]??path.join(root,'android/build/github-release')));
  console.log(`Arquivos da versão ${metadata.versionName} preparados e assinatura verificada. Publique o APK, android-update.json e o .sha256 juntos numa GitHub Release estável.`);
}
