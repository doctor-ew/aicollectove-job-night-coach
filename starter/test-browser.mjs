import assert from 'node:assert/strict';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const directory=dirname(fileURLToPath(import.meta.url));
const artifacts=resolve(process.env.STARTER_BROWSER_ARTIFACTS || resolve(directory,'../docs/1/direct-verification/browser-acceptance'));
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const instructions=readFileSync(resolve(directory,'../coach/START-HERE.md'),'utf8');
const url=pathToFileURL(resolve(directory,'index.html')).href;
const sampleResume='  Avery Example\nCommunity workshop volunteer\nHelped participants prepare materials.\n';
const sampleJob='\nWorkshop assistant\nSupport participants and organize materials.  ';
const expected=(resume,job)=>instructions+'\n\n## Resume\n\n'+resume+'\n\n## Job posting\n\n'+job;
const checks=[];
const started=Date.now();
const source_sha256=Object.fromEntries(['index.html','styles.css','app.js','instructions.js','build.py','test-browser.mjs'].map(name=>[name,createHash('sha256').update(readFileSync(resolve(directory,name))).digest('hex')]));
mkdirSync(artifacts,{recursive:true});
const browser=await chromium.launch({headless:true});
let activePage;
async function scenario(mode,run){
  const context=await browser.newContext({viewport:{width:1280,height:980}});
  const page=await context.newPage();activePage=page;
  const network=[],consoleMessages=[],errors=[];
  page.on('request',request=>{if(!request.url().startsWith('file:'))network.push(request.url());});
  page.on('console',message=>consoleMessages.push(message.text()));
  page.on('pageerror',error=>errors.push(error.message));
  await context.route(/^https?:/,route=>route.abort());
  await context.addInitScript(({mode})=>{
    globalThis.__acceptance={copies:[],storage:[],network:[]};
    const observed=globalThis.__acceptance;
    const forbid=(kind,name)=>function(){observed[kind].push(name);throw new Error('Synthetic forbidden '+name);};
    for(const name of ['getItem','setItem','removeItem','clear','key'])Storage.prototype[name]=forbid('storage',name);
    Object.defineProperty(document,'cookie',{configurable:true,get(){observed.storage.push('cookie read');return '';},set(){observed.storage.push('cookie write');}});
    if(globalThis.indexedDB)globalThis.indexedDB.open=forbid('storage','indexedDB');
    if(globalThis.caches)globalThis.caches.open=forbid('storage','caches');
    globalThis.fetch=forbid('network','fetch');
    XMLHttpRequest.prototype.open=forbid('network','XMLHttpRequest');
    globalThis.WebSocket=forbid('network','WebSocket');
    globalThis.EventSource=forbid('network','EventSource');
    navigator.sendBeacon=forbid('network','sendBeacon');
    const clipboard=mode==='unavailable'?undefined:{writeText(text){
      observed.copies.push(text);
      if(mode==='rejected')return Promise.reject(new Error('Synthetic clipboard denial'));
      if(mode==='pending')return new Promise(resolve=>{globalThis.__finishCopy=resolve;});
      return Promise.resolve();
    }};
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:clipboard});
  },{mode});
  try{
    await page.goto(url);
    assert.equal(await page.locator('#resume').inputValue(),'');
    assert.equal(await page.locator('#job-posting').inputValue(),'');
    await run(page);
    const observed=await page.evaluate(()=>({storage:__acceptance.storage,network:__acceptance.network}));
    assert.deepEqual(observed,{storage:[],network:[]});
    assert.deepEqual(network,[]);assert.deepEqual(consoleMessages,[]);assert.deepEqual(errors,[]);
  }finally{await context.close();activePage=undefined;}
}
const fill=async(page,resume=sampleResume,job=sampleJob)=>{await page.getByLabel('Resume',{exact:true}).fill(resume);await page.getByLabel('Job posting',{exact:true}).fill(job);};
const submit=page=>page.getByRole('button',{name:'Copy coaching prompt',exact:true}).click();
try{
  await scenario('success',async page=>{
    await submit(page);
    assert.equal(await page.locator('#resume-error').innerText(),'Add your resume before copying.');
    assert.equal(await page.locator('#job-error').innerText(),'Add the job posting before copying.');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'resume');
    await fill(page,' \n\t ',sampleJob);await submit(page);
    assert.equal(await page.locator('#resume').getAttribute('aria-invalid'),'true');
    assert.equal(await page.locator('#job-posting').getAttribute('aria-invalid'),null);
    await fill(page,sampleResume,' \t ');await submit(page);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'job-posting');
    assert.equal(await page.evaluate(()=>__acceptance.copies.length),0);
    checks.push('Empty and whitespace-only fields reject without clipboard writes; focus and field errors are accessible.');
    await fill(page);
    await page.locator('#resume').focus();await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'job-posting');
    await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'copy-prompt');
    await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('#copy-status').textContent==='Coaching prompt copied. Paste it into a new AI conversation.');
    assert.deepEqual(await page.evaluate(()=>__acceptance.copies),[expected(sampleResume,sampleJob)]);
    assert.equal(await page.getByRole('status').getAttribute('aria-live'),'polite');
    assert.equal(await page.locator('#manual-copy').isVisible(),false);
    checks.push('Keyboard copy succeeds with exact canonical instructions once and both untouched input values.');
    await page.screenshot({path:resolve(artifacts,'starter-desktop.png'),fullPage:true});
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:resolve(artifacts,'starter-mobile.png'),fullPage:true});
    checks.push('390px mobile layout has no horizontal overflow.');
    await page.reload();assert.equal(await page.locator('#resume').inputValue(),'');assert.equal(await page.locator('#job-posting').inputValue(),'');
    assert.equal(await page.locator('#copy-status').innerText(),'');assert.equal(await page.locator('#manual-copy').isVisible(),false);
    checks.push('Refresh begins with empty inputs, feedback and prepared prompt.');
    await page.setViewportSize({width:1280,height:980});
    await page.screenshot({path:resolve(artifacts,'starter-empty.png'),fullPage:true});
  });
  for(const mode of ['rejected','unavailable'])await scenario(mode,async page=>{
    const resume='<img src="https://example.invalid/fictional" onerror="globalThis.__injected=1">\nAvery Example';
    const job='</textarea><script>globalThis.__injected=2</script>\nFictional role';
    await fill(page,resume,job);await submit(page);
    await page.locator('#manual-copy').waitFor({state:'visible'});
    assert.equal(await page.locator('#prepared-prompt').inputValue(),expected(resume,job));
    assert.equal(await page.locator('#prepared-prompt').getAttribute('readonly'),'');
    assert.equal(await page.locator('#copy-status').innerText(),'Automatic copying is unavailable. Use the complete prompt below to copy manually.');
    assert.equal(await page.evaluate(()=>globalThis.__injected),undefined);
    assert.equal(await page.locator('img').count(),0);
    await page.getByRole('button',{name:'Select complete prompt'}).click();
    assert.deepEqual(await page.locator('#prepared-prompt').evaluate(element=>({active:document.activeElement===element,start:element.selectionStart,end:element.selectionEnd})),{active:true,start:0,end:expected(resume,job).length});
    if(mode==='rejected')assert.deepEqual(await page.evaluate(()=>__acceptance.copies),[expected(resume,job)]);
    else assert.deepEqual(await page.evaluate(()=>__acceptance.copies),[]);
    if(mode==='rejected')await page.screenshot({path:resolve(artifacts,'starter-manual-copy.png'),fullPage:true});
    await page.locator('#resume').fill('Edited fictional text');assert.equal(await page.locator('#manual-copy').isVisible(),false);assert.equal(await page.locator('#prepared-prompt').inputValue(),'');
    checks.push(mode+' clipboard exposes the exact read-only selectable prompt, treats HTML as text and clears stale fallback on edit.');
  });
  await scenario('pending',async page=>{
    await fill(page);await submit(page);assert.equal(await page.locator('#copy-prompt').isDisabled(),true);
    await page.locator('#resume').fill('Edited fictional resume');await page.evaluate(()=>__finishCopy());
    await page.waitForFunction(()=>!document.querySelector('#copy-prompt').disabled);
    assert.equal(await page.locator('#copy-status').innerText(),'The earlier prompt was copied. Copy again to include your edits.');
    assert.deepEqual(await page.evaluate(()=>__acceptance.copies),[expected(sampleResume,sampleJob)]);
    checks.push('Edits during asynchronous copy never claim that the changed inputs were copied.');
  });
  const report={status:'passed',synthetic:true,clipboard_outcomes:'simulated',elapsed_ms:Date.now()-started,source_sha256,protocol:'file:',browser:browser.version(),canonical_sha256:createHash('sha256').update(instructions).digest('hex'),canonical_bytes:Buffer.byteLength(instructions),provider_calls:0,network_requests:0,storage_calls:0,logged_input_messages:0,checks};
  writeFileSync(resolve(artifacts,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
}catch(error){if(activePage&&!activePage.isClosed())await activePage.screenshot({path:resolve(artifacts,'failure.png'),fullPage:true});throw error;}
finally{await browser.close();}
