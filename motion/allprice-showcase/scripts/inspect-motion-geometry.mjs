import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire('/home/jaypy/.npm/_npx/110f701c48e68d66/node_modules/hyperframes/package.json');
const puppeteer = require('puppeteer-core');
const browser = await puppeteer.launch({ headless:true, executablePath:'/home/jaypy/.cache/puppeteer/chrome/linux-150.0.7871.24/chrome-linux64/chrome', args:['--no-sandbox'] });
const output = {};
try {
  for (const [mode,width,height,expectedHeight] of [['desktop',1440,900,11279],['mobile',390,844,15607]]) {
    const page = await browser.newPage();
    await page.setViewport({ width,height,deviceScaleFactor:2 });
    await page.goto('https://allprice-lp.juanpablosilva.com.br/', {waitUntil:'networkidle0'});
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
    output[mode] = await page.evaluate(()=>{
      const box=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y+scrollY,w:r.width,h:r.height};};
      return {height:document.documentElement.scrollHeight,fonts:[...document.fonts].map(f=>({family:f.family,weight:f.weight,status:f.status})),sections:[...document.querySelectorAll('section,header,footer')].map(e=>({id:e.id,tag:e.tagName,box:box(e)})),headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>({text:e.textContent,box:box(e)})),buttons:[...document.querySelectorAll('button')].map(e=>({text:e.textContent,aria:e.getAttribute('aria-label'),box:box(e)})),scrollers:[...document.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+5&&['auto','scroll'].includes(getComputedStyle(e).overflowX)).map(e=>({tag:e.tagName,classes:e.className,box:box(e),scrollWidth:e.scrollWidth,inner:[...e.children].map(c=>({text:c.textContent.slice(0,80),box:box(c)}))}))};
    });
    if(output[mode].height!==expectedHeight)throw new Error(`${mode} page changed: ${output[mode].height}`);
    if(mode==='desktop'){
      await page.evaluate(()=>scrollTo(0,9181));
      const q = await page.evaluateHandle(()=>[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='2. Preciso ter um ERP para usar?'));
      await q.asElement().click();
      await new Promise(r=>setTimeout(r,450));
      output.faqOpen=await page.evaluate(()=>{const q=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='2. Preciso ter um ERP para usar?');const a=document.getElementById(q.getAttribute('aria-controls'));const box=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y+scrollY,w:r.width,h:r.height};};return{question:box(q),answer:a?{box:box(a),text:a.textContent}:null,following:[...document.querySelectorAll('button')].filter(e=>/^([3-9]|1[0-9])\./.test(e.textContent.trim())).map(e=>({text:e.textContent,box:box(e)}))};});
    }
    await page.close();
  }
  await mkdir('assets/fonts',{recursive:true});
  await writeFile('capture/motion-geometry.json',JSON.stringify(output,null,2)+'\n');
  const css=await fetch('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',{headers:{'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}}).then(r=>r.text());
  const fontRecords=[];
  for(const weight of [400,700]){
    let blocks=[...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)].map(m=>m[1]);
    if(!blocks.length)blocks=[...css.matchAll(/@font-face\s*\{[^}]+\}/g)].map(m=>m[0]);
    const block=blocks.find(b=>b.includes(`font-weight: ${weight};`));
    if(!block)throw new Error(`No latin Lato ${weight}: ${css.slice(0,100)}`);
    const url=block.match(/url\(([^)]+)\)/)[1];
    const data=Buffer.from(await fetch(url).then(r=>r.arrayBuffer()));
    const extension=data.subarray(0,4).toString()==='wOF2'?'woff2':'ttf';
    const path=`assets/fonts/lato-${weight}-latin.${extension}`;
    await writeFile(path,data);fontRecords.push({path,url,weight,bytes:data.length});
  }
  output.fontFiles=fontRecords;
  await writeFile('capture/motion-geometry.json',JSON.stringify(output,null,2)+'\n');
  console.log(JSON.stringify(output,null,2));
} finally {await browser.close();}
