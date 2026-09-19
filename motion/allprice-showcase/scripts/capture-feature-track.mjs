import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const require=createRequire('/home/jaypy/.npm/_npx/110f701c48e68d66/node_modules/hyperframes/package.json');
const browser=await require('puppeteer-core').launch({headless:true,executablePath:'/home/jaypy/.cache/puppeteer/chrome/linux-150.0.7871.24/chrome-linux64/chrome',args:['--no-sandbox']});
try {
 const page=await browser.newPage();await page.setViewport({width:1440,height:1000,deviceScaleFactor:2});
 await page.goto('https://allprice-lp.juanpablosilva.com.br/',{waitUntil:'networkidle0'});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
 const height=await page.evaluate(()=>document.documentElement.scrollHeight);if(height!==11279)throw Error('Source geometry changed');
 const records=[];
 for(const [name,x] of [['left',0],['right',446]]){
  await page.evaluate(left=>{scrollTo(0,0);document.querySelector('#features .overflow-x-auto').scrollLeft=left;},x);
  const asset=`assets/live/desktop-feature-track-${name}-complete.png`;
  await page.screenshot({path:asset,captureBeyondViewport:true,clip:{x:136,y:4237.5,width:1168,height:638}});
  records.push({path:asset,source:'https://allprice-lp.juanpablosilva.com.br/',clip:{x:136,y:4237.5,width:1168,height:638},scrollLeft:x,deviceScaleFactor:2,height});
 }
 await writeFile('capture/feature-track-complete.json',JSON.stringify(records,null,2)+'\n');console.log(records);
}finally{await browser.close();}
