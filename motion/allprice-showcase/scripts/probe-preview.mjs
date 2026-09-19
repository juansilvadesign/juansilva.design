import {createRequire} from 'node:module';
const require=createRequire('/home/jaypy/.npm/_npx/110f701c48e68d66/node_modules/hyperframes/package.json');
const browser=await require('puppeteer-core').launch({headless:true,executablePath:'/home/jaypy/.cache/puppeteer/chrome/linux-150.0.7871.24/chrome-linux64/chrome',args:['--no-sandbox']});
try{
 const page=await browser.newPage();await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3148/api/projects/allprice-showcase/preview/comp/'+(process.argv[2]||'compositions/frames/main-01-clarity.html'),{waitUntil:'networkidle0'});
 console.log(JSON.stringify(await page.evaluate(()=>({title:document.title,roots:[...document.querySelectorAll('[data-composition-id]')].map(e=>({id:e.dataset.compositionId,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})),timelines:Object.entries(window.__timelines||{}).map(([k,v])=>({id:k,duration:v.duration(),children:v.getChildren().length})),runtime:Object.keys(window.__hyperframes||{}),globals:Object.keys(window).filter(k=>/hyper|seek|render|timeline/i.test(k)),images:[...document.images].map(i=>({src:i.getAttribute('src'),decoded:i.complete&&i.naturalWidth>0}))})),null,2));
 console.log(JSON.stringify(await page.evaluate(()=>[...document.scripts].filter(s=>s.textContent.includes('addEventListener')&&s.textContent.includes('message')).map(s=>{const t=s.textContent;return [...t.matchAll(/.{0,100}(?:case .seek.|seekTo|setCurrentTime|data\.type|message\.type|hf-seek|producer:seek).{0,230}/g)].slice(0,28).map(m=>m[0]);})),null,2));
 console.log({errors});
}finally{await browser.close();}
