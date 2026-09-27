import {readFile,writeFile,copyFile,mkdir,access,symlink,readlink} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve,basename} from 'node:path';
import {parseStoryboard} from '/home/jaypy/.agents/skills/product-launch-video/scripts/lib/storyboard.mjs';
const skill='/home/jaypy/.agents/skills/product-launch-video/scripts';
const allFilms=[['remediation','../allprice-remediation.storyboard.md'],['responsive','../allprice-responsive.storyboard.md'],['interactions','../allprice-interactions.storyboard.md'],['main','STORYBOARD.md']];
const requested=process.argv.slice(2);
if(requested.some(name=>!allFilms.some(([known])=>known===name)))throw Error('Unknown film requested');
const films=allFilms.filter(([name])=>!requested.length||requested.includes(name));
function run(script,args){const r=spawnSync(process.execPath,[`${skill}/${script}.mjs`,...args],{encoding:'utf8'});if(r.error)throw r.error;console.log(r.stdout);if(r.status!==0)throw Error(r.stderr||`${script} failed`);}
await mkdir('assets/vendor',{recursive:true});
try{await access('assets/vendor/gsap.min.js');}catch{const r=await fetch('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js');if(!r.ok)throw Error('Unable to stage GSAP');await writeFile('assets/vendor/gsap.min.js',Buffer.from(await r.arrayBuffer()));}
for(const[name,board]of films){
 const original=await readFile(board,'utf8');const plan=parseStoryboard(original);
 for(const f of plan.frames){const html=await readFile(f.src,'utf8');if(!html.trim().startsWith('<template')||html.includes('SKETCH ONLY'))throw Error(`Frame not animated: ${f.src}`);}
 // The workflow stager flattens paths. Byte copies satisfy its basename
 // compatibility check; production frames keep their unique nested URLs.
 for(const f of plan.frames)for(const part of String(f.extra?.asset_candidates||'').split(';')){
  const source=part.split(/\s+[—–-]\s+/)[0].trim();if(!source)continue;
  try{await access(`assets/${basename(source)}`);}catch{await copyFile(source,`assets/${basename(source)}`);}
 }
 const previousMain=name==='main'?null:await readFile('index.html','utf8');
 run('assemble-index',['--storyboard',board,'--hyperframes','.']);
 run('transitions',['inject','--storyboard',board,'--hyperframes','.']);
 let html=await readFile('index.html','utf8');
 html=html.replace(/<script src="https:\/\/cdn\.jsdelivr[^>]+><\/script>/,'<script src="assets/vendor/gsap.min.js"></script>');
 html=html.replace(/(#root\s*\{[^}]*?)width: 1920px;\s*height: 1080px;/, '$1width: 100%;\n        height: 100%;');
 const seconds=plan.frames.reduce((sum,f)=>sum+f.durationSeconds,0);
 if(!html.includes('full-span anchor'))html=html.replace('window.__timelines["main"] = gsap.timeline({ paused: true });',`window.__timelines["main"] = gsap.timeline({ paused: true });\n      window.__timelines["main"].to({}, {duration:${seconds}}, 0); // master clock; child timelines own visual motion`);
 const entry=name==='main'?'index.html':`films/${name}/index.html`;
 if(name!=='main'){
  await mkdir(`films/${name}`,{recursive:true});
  // Each delivery has one entry point, with shared immutable source assets.
  for(const folder of ['assets','compositions']){
   const link=`films/${name}/${folder}`,target=`../../${folder}`;
   try{await symlink(target,link,'dir');}catch(e){
    if(e.code!=='EEXIST'||await readlink(link)!==target)throw e;
   }
  }
  const pkg=JSON.parse(await readFile('package.json','utf8'));
  const scripts=Object.fromEntries(['dev','check','render','publish'].map(key=>[key,pkg.scripts[key]]));
  await writeFile(`films/${name}/package.json`,JSON.stringify({...pkg,name:`allprice-${name}`,scripts},null,2)+'\n');
  await writeFile(`films/${name}/meta.json`,JSON.stringify({id:`allprice-${name}`,name:`allprice-${name}`},null,2)+'\n');
  await copyFile('hyperframes.json',`films/${name}/hyperframes.json`);
 }
 await writeFile(entry,html);
 if(previousMain!==null)await writeFile('index.html',previousMain);
 run('transitions',['verify','--storyboard',board,'--index',entry,'--hyperframes','.']);
 console.log(`Ready: ${name} (${seconds}s)`);
}
