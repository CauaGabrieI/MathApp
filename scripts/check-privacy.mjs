import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import fs from 'node:fs';

// Only tracked source is examined. Findings never print matching values.
const {stdout}=await promisify(execFile)('git',['ls-files','-co','--exclude-standard','-z'],{encoding:'utf8'});
const files=[...new Set(stdout.split('\0').filter(Boolean))];
const forbidden=/(?:^|\/)(?:\.env(?:\..*)?|(?:signing|keystore|local)\.properties|[^/]+\.(?:jks|keystore|p12|pfx|key|pem|apk|aab|apks))$/i;
const privateFolders=/^(?:backups|exports|private-data|outputs|\.secrets)\//;
const patterns=[
 ['chave privada',/-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/],
 ['token GitHub',/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,})\b/],
 ['chave EnemHub',/\behub_enem_[A-Za-z0-9_-]{24,}\b/],
 ['credencial AWS',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
 ['URL com credencial',/https?:\/\/(?!user:(?:pass|secret)@)[^\s/@:]+:[^\s/@]+@/],
 ['caminho de computador pessoal',/(?:\/home\/|\/Users\/)[A-Za-z0-9._-]+\//]
];
const findings=[];
for(const file of files){
 if((forbidden.test(file)&&!/(?:^|\/)\.env\.(?:example|sample)$/.test(file))||privateFolders.test(file))findings.push([file,'arquivo privado ou artefato gerado']);
 let data;try{data=fs.readFileSync(file);}catch{continue;}
 if(data.includes(0))continue;
 const text=data.toString('utf8');
 for(const [label,pattern]of patterns)if(pattern.test(text))findings.push([file,label]);
}
if(findings.length){for(const [file,label]of findings)console.error(`${file}: ${label}`);process.exitCode=1;}
else console.log(`Privacy check passed for ${files.length} tracked source files. No secret values are printed by this check.`);
