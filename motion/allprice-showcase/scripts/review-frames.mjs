import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
const require=createRequire('/home/jaypy/.npm/_npx/110f701c48e68d66/node_modules/hyperframes/package.json');
const sharp=require('sharp');
const manifest=JSON.parse(await readFile('capture/motion-assets.json'));
const ids=process.argv.slice(2).length?process.argv.slice(2):Object.keys(manifest.frames);
const browser=await require('puppeteer-core').launch({headless:true,executablePath:'/home/jaypy/.cache/puppeteer/chrome/linux-150.0.7871.24/chrome-linux64/chrome',args:['--no-sandbox']});
const receipts=[],thumbs=[];
await mkdir('review/frames',{recursive:true});
try {
 const page=await browser.newPage();
 await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
 await page.evaluateOnNewDocument(()=>{window.__HF_EXPORT_RENDER_SEEK_CONFIG={fps:60,fpsSource:'render-options'};});
 for(const id of ids){
  if((await readFile(`compositions/frames/${id}.html`,'utf8')).includes('SKETCH ONLY'))continue;
  const errors=[];const onError=e=>errors.push(e.message);page.on('pageerror',onError);
  await page.goto(`http://127.0.0.1:3148/api/projects/allprice-showcase/preview/comp/compositions/frames/${id}.html`,{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>window.__renderReady===true);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  const duration=manifest.frames[id].duration;
  const times=[0,id==='main-05-features'?3.4:id==='main-10-faq'?2.2:duration/2,duration-1/60];
  const samples=[];
  for(const time of times){
   await page.evaluate(time=>window.postMessage({source:'hf-parent',type:'control',action:'seek',timeSeconds:time},'*'),time);
   await page.waitForFunction((id,time)=>Math.abs(window.__timelines[id].time()-time)<.002,{},id,time);
   await page.evaluate(async()=>{await window.__hfWaitForSeekCompletion?.();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
   const path=`review/frames/${id}-${time.toFixed(4)}.png`;
   await page.screenshot({path});
   samples.push({time,path});
   if(time===times[1])thumbs.push({id,input:await sharp(path).resize(640,360).png().toBuffer()});
  }
  receipts.push({id,errors,samples,timelines:await page.evaluate(()=>Object.entries(window.__timelines).map(([id,t])=>({id,duration:t.duration(),children:t.getChildren().length})))});
  page.off('pageerror',onError);console.log(`Reviewed ${id}`);
 }
 const cols=3,cellH=394,rows=Math.ceil(thumbs.length/cols);
 const layers=[];
 for(const[t,thumb]of thumbs.entries()){
  const left=(t%cols)*640,top=Math.floor(t/cols)*cellH;
  layers.push({input:thumb.input,left,top});
  layers.push({input:Buffer.from(`<svg width="640" height="34"><rect width="640" height="34" fill="white"/><text x="12" y="23" font-family="sans-serif" font-size="18" fill="#234dd7">${thumb.id}</text></svg>`),left,top:top+360});
 }
 if(layers.length)await sharp({create:{width:1920,height:rows*cellH,channels:3,background:'white'}}).composite(layers).png().toFile('review/frames/contact-sheet.png');
 await writeFile('review/frames/receipt.json',JSON.stringify(receipts,null,2)+'\n');
} finally {await browser.close();}
