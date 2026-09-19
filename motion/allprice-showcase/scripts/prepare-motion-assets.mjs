import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const require=createRequire('/home/jaypy/.npm/_npx/110f701c48e68d66/node_modules/hyperframes/package.json');
const sharp=require('sharp');
const manifest={version:1,policy:'Immutable source pixels, bounded crops, lossless outputs, unique per-frame media URLs. All coordinates are CSS pixels unless pixelCrop is named.',frames:{},derivatives:[]};
const strips=JSON.parse(await readFile('capture/live-metadata.json')).strips;
const hash=async p=>createHash('sha256').update(await readFile(p)).digest('hex');
const sourceHashes={};
async function receipt(path,sources,extra){for(const s of sources)sourceHashes[s]??=await hash(s);manifest.derivatives.push({path,sha256:await hash(path),sources:sources.map(path=>({path,sha256:sourceHashes[path]})),...extra});}
async function copy(id,name,source){const dir=`assets/motion/${id}`;await mkdir(dir,{recursive:true});const out=`${dir}/${name}.png`;await copyFile(source,out);const m=await sharp(out).metadata();await receipt(out,[source],{pixelSize:[m.width,m.height],operation:'byte-for-byte copy'});return out;}
async function crop(id,name,source,rect,scale=2){const dir=`assets/motion/${id}`;await mkdir(dir,{recursive:true});const out=`${dir}/${name}.png`;await sharp(source).extract({left:Math.round(rect.x*scale),top:Math.round(rect.y*scale),width:Math.round(rect.w*scale),height:Math.round(rect.h*scale)}).png().toFile(out);await receipt(out,[source],{cssCrop:rect,sourceScale:scale,pixelSize:[Math.round(rect.w*scale),Math.round(rect.h*scale)]});return out;}
async function page(id,name,top,bottom,dpr=1.5){const dir=`assets/motion/${id}`;await mkdir(dir,{recursive:true});const layers=[],sources=[];let y=top;while(y<bottom){const strip=[...strips].reverse().find(s=>s.top<=y);const end=Math.min(bottom,strip.top+strip.height);if(end<=y)throw Error('Uncovered document region');const input=await sharp(strip.path).extract({left:0,top:Math.round((y-strip.top)*2),width:2880,height:Math.round((end-y)*2)}).png().toBuffer();layers.push({input,left:0,top:Math.round((y-top)*2)});sources.push(strip.path);y=end;}
 const composed=await sharp({create:{width:2880,height:Math.round((bottom-top)*2),channels:3,background:'#FFFFFF'}}).composite(layers).png().toBuffer();
 const out=`${dir}/${name}.png`;await sharp(composed).resize({width:1440*dpr,height:Math.round((bottom-top)*dpr),kernel:'lanczos3'}).png().toFile(out);await receipt(out,sources,{documentCrop:{x:0,y:top,w:1440,h:bottom-top},outputScale:dpr,operation:'overlapping-strip crop assembly; bounded decode'});return out;}
const main=[
 ['main-01-clarity',5,[[0,0],[4.2,0],[5,0]]],
 ['main-02-overview',5,[[0,0],[4.1,1250],[5,1250]]],
 ['main-03-audiences',5,[[0,1250],[1.3,1745],[3.25,1745],[5,2500]]],
 ['main-04-erp',6,[[0,2500],[1,2640],[2.4,2640],[3.6,3060],[4.7,3060],[6,3770]]],
 ['main-05-features',7,[[0,3770],[.45,3927],[4.8,3927],[7,4790]]],
 ['main-06-price',6,[[0,4790],[.5,4840],[2,4840],[6,6060]]],
 ['main-07-alerts',4,[[0,6060],[.65,6120],[2.7,6120],[4,6590]]],
 ['main-08-plans',6,[[0,6590],[1.55,7010],[3.2,7010],[6,8080]]],
 ['main-09-page-continuity',3,[[0,8080],[3,9181]]],
 ['main-10-faq',6,[[0,9181],[4,9181],[6,10180]]],
 ['main-11-finish',5,[[0,10180],[1,10379],[5,10379]]]
];
for(const[id,duration,stops]of main){const top=stops[0][1],bottom=Math.min(11279,Math.max(...stops.map(s=>s[1]))+900);const f={kind:'main',duration,stops,cropTop:top,cropBottom:bottom,pageHeight:bottom-top,page:await page(id,'page',top,bottom,id==='main-01-clarity'?2:1.5),header:await crop(id,'header','assets/live/desktop-hero.png',{x:0,y:0,w:1440,h:86})};manifest.frames[id]=f;}
const featureId='main-05-features';
const left='assets/live/desktop-feature-track-left-complete.png',right='assets/live/desktop-feature-track-right-complete.png';
const tail=await sharp(right).extract({left:1444,top:0,width:892,height:1276}).png().toBuffer();
const rail=`assets/motion/${featureId}/rail-complete.png`;
await sharp({create:{width:3228,height:1276,channels:3,background:'#FFFFFF'}}).composite([{input:left,left:0,top:0},{input:tail,left:2336,top:0}]).png().toFile(rail);
await receipt(rail,[left,right],{operation:'append last 446 CSS pixels from genuine right-scroll state',cssSize:[1614,638]});
Object.assign(manifest.frames[featureId],{rail,railBox:{x:136,documentY:4237.5,width:1168,height:638,contentWidth:1614},drag:{start:1.45,end:3.05,fromX:0,toX:-446,returnStart:4.15,returnEnd:4.8,cursorFrom:[1030,458],cursorTo:[584,458]}});
async function faqParts(id,top,bottom){return{faqTop:await page(id,'faq-top',top,9749),faqTail:await page(id,'faq-tail',9749,bottom),answer:await crop(id,'answer','assets/live/desktop-faq-framed-open.png',{x:0,y:568,w:1440,h:81}),openIcon:await crop(id,'open-icon','assets/live/desktop-faq-framed-open.png',{x:1211,y:514,w:36,h:36}),splitDocY:9749,answerHeight:81,icon:{x:1211,documentY:9695,width:36,height:36},clickDocument:[1229,9713]};}
Object.assign(manifest.frames['main-10-faq'],await faqParts('main-10-faq',9181,11080));
for(const id of ['remediation-01-intent','remediation-02-source','remediation-03-structure','remediation-04-return']){
 manifest.frames[id]={kind:'remediation',duration:4};
 for(const variant of ['original','optimized'])manifest.frames[id][variant]=await crop(id,variant,`assets/figma/${variant}-desktop-full.png`,{x:0,y:0,w:1280,h:410},1);
}
for(const id of ['responsive-01-hero','responsive-02-cards','responsive-03-plans']){
 const f=manifest.frames[id]={kind:'responsive',duration:6};
 f.heroDesktop=await crop(id,'hero-desktop','assets/live/desktop-hero.png',{x:0,y:0,w:1440,h:520});f.heroMobile=await copy(id,'hero-mobile','assets/live/mobile-hero.png');
 f.mobileHeader=await crop(id,'mobile-header','assets/live/mobile-hero.png',{x:0,y:0,w:390,h:76});
 if(id.includes('cards')){f.desktop=await page(id,'audience-desktop',1570,2667);f.desktopSourceHeight=1097;f.mobile=await copy(id,'audience-mobile','assets/live/mobile-comofunciona-full.png');f.mobileSourceHeight=2289;f.mobileScrollStops=[[0,0],[1.1,275],[2.1,275],[4.7,1478],[6,1478]];}
 if(id.includes('plans')){f.desktop=await page(id,'plans-desktop',7130,8316);f.desktopSourceHeight=1186;f.mobile=await copy(id,'plans-mobile','assets/live/mobile-pricing-full.png');f.mobileSourceHeight=2802;f.mobileScrollStops=[[0,465],[1,550],[2.2,550],[4.75,1575],[6,1575]];}
}
for(const[id,duration]of [['interactions-01-menu',6],['interactions-02-answer',6],['interactions-03-return',4]]){
 const f=manifest.frames[id]={kind:'interactions',duration};
 f.mobile=await copy(id,'mobile-closed','assets/live/mobile-hero.png');f.menu=await copy(id,'mobile-open','assets/live/mobile-menu-open.png');
 f.header=await crop(id,'header','assets/live/desktop-hero.png',{x:0,y:0,w:1440,h:86});f.faq=await page(id,'faq-closed',9181,10160);
 Object.assign(f,await faqParts(id,9181,10160));
}
await writeFile('capture/motion-assets.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Staged ${Object.keys(manifest.frames).length} frame-specific asset sets and ${manifest.derivatives.length} SHA-256 derivatives.`);
