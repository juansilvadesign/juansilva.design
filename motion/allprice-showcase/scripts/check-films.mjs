import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Checks only: this command never renders, publishes, or modifies a composition.
const project=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const lintOnly=args.includes('--lint');
const cliIndex=args.indexOf('--cli');
const cli=cliIndex>=0?args[cliIndex+1]:null;
if(cliIndex>=0&&!cli)throw Error('--cli requires the installed HyperFrames cli.js path');
const names=args.filter((arg,i)=>arg!=='--lint'&&arg!=='--cli'&&(cliIndex<0||i!==cliIndex+1));
const films=[
 {name:'main',dir:'.',at:'0,1,2.5,6,7.5,11,12.5,16,18,22,24.4,29,31,35,36,39,41,45,45.5,48,49.2,54,55.5,57.983333'},
 {name:'remediation',dir:'films/remediation',at:'0,1,2,4.9,5.5,6.9,8.9,9.5,10.9,12.9,14,15.6,15.983333'},
 {name:'responsive',dir:'films/responsive',at:'0,1,3,6.9,7.5,9,12.9,15,17.5,17.983333'},
 {name:'interactions',dir:'films/interactions',at:'0,1.3,2,3.5,6.9,7.5,9,12.1,13,15.3,15.983333'}
];
if(names.some(name=>!films.some(film=>film.name===name)))throw Error('Unknown film name');
const pkg=JSON.parse(await readFile(resolve(project,'package.json'),'utf8'));
const pin=pkg.scripts.check.match(/hyperframes@([\d.]+)/)?.[1];
if(!pin)throw Error('Cannot locate the project HyperFrames pin');
await mkdir(resolve(project,'review/checks'),{recursive:true});
let failed=false;
for(const film of films.filter(film=>!names.length||names.includes(film.name))){
 const dir=resolve(project,film.dir),mode=lintOnly?'lint':'check';
 const entry=await readFile(resolve(dir,'index.html'),'utf8');
 const sources=['index.html','index.motion.json',...entry.matchAll(/data-composition-src="([^"]+)"/g)].map(value=>typeof value==='string'?value:value[1]);
 const sourceHashes={};
 for(const path of sources)sourceHashes[path]=createHash('sha256').update(await readFile(resolve(dir,path))).digest('hex');
 const commandArgs=[mode,'.','--json',...(lintOnly?[]:['--strict','--timeout','120000','--snapshots','--at',film.at])];
 console.log(`${film.name}: ${mode}`);
 const result=spawnSync(cli?process.execPath:'npx',cli?[cli,...commandArgs]:['--yes',`hyperframes@${pin}`,...commandArgs],{
  cwd:dir,encoding:'utf8',maxBuffer:32*1024*1024,
  env:{...process.env,HYPERFRAMES_RUN_ID:'allprice-motion-qa'}
 });
 let report;
 try{report=JSON.parse(result.stdout);}catch{report={ok:false,error:result.error?.message||'No JSON check report',stdout:result.stdout,stderr:result.stderr};}
 const exitCode=result.error?null:result.status;
 const receipt={film:film.name,mode,entry:`${film.dir}/index.html`,sourceHashes,exitCode,report};
 await writeFile(resolve(project,`review/checks/${film.name}.${mode}.json`),JSON.stringify(receipt,null,2)+'\n');
 const sections=lintOnly?{lint:report}:Object.fromEntries(['lint','runtime','layout','motion','contrast'].map(key=>[key,report[key]]));
 console.log(JSON.stringify({film:film.name,ok:report.ok,exitCode,counts:Object.fromEntries(Object.entries(sections).map(([key,value])=>[key,{errors:value?.errorCount,warnings:value?.warningCount,samples:value?.samples}]))}));
 if(exitCode!==0||!report.ok||(lintOnly&&report.warningCount>0))failed=true;
}
process.exitCode=failed?1:0;
