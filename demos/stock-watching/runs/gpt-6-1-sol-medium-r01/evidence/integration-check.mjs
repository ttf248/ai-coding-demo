import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const base=process.env.STOCK_TEST_API||'http://127.0.0.1:58080/api';
const frontend=process.env.STOCK_TEST_FRONTEND||'http://127.0.0.1:5173';
let checks=0;const owned=[];
async function api(url,status,method='GET',body,headers={}){const response=await fetch(base+url,{method,headers:{...headers,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});assert.equal(response.status,status,method+' '+url);checks++;return response.status===204?null:response.json()}
let browser;
try{
 assert.equal((await api('/health',200)).quoteSource,'simulated');
 await api('/contracts',400,'POST',{market:'CN',symbol:'!invalid',name:'不合法代码'});
 await api('/contracts',400,'POST',{market:'CN',symbol:'VALID',name:'测试',extra:'unknown'});
 await api('/contracts?market=invalid',400);
 await api('/contracts/0',400);
 const create=await api('/contracts',201,'POST',{market:'CN',symbol:'TEST.API',name:'接口联调',note:'首版备注'});owned.push(create.data.id);
 assert.equal(create.data.quote.source,'simulated');assert.equal(create.data.quote.currency,'CNY');
 await api('/contracts',409,'POST',{market:'CN',symbol:'TEST.API',name:'重复合约'});
 await api('/contracts/'+create.data.id,400,'PATCH',{});
 const updated=await api('/contracts/'+create.data.id,200,'PATCH',{name:'修改后的合约',note:''});
 assert.equal(updated.data.name,'修改后的合约');assert.equal(updated.data.note,'');
 const result=await api('/contracts?market=CN&q='+encodeURIComponent('修改后的'),200);assert.equal(result.data.length,1);
 assert.equal((await api('/contracts?market=CN&q='+encodeURIComponent('%'),200)).data.length,0);
 await api('/contracts',204,'OPTIONS',undefined,{Origin:frontend,'Access-Control-Request-Method':'POST'});
 await api('/contracts',403,'OPTIONS',undefined,{Origin:'http://disallowed.invalid'});
 await api('/contracts/'+create.data.id,204,'DELETE');
 await api('/contracts/'+create.data.id,404);
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:960}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(frontend);await page.getByRole('button',{name:'＋ 添加合约'}).click();
 await page.getByLabel('代码',{exact:true}).fill('TEST.UI');await page.getByLabel('名称',{exact:true}).fill('浏览器联调合约');await page.getByLabel('备注',{exact:true}).fill('新增备注');await page.getByRole('button',{name:'保存合约',exact:true}).click();
 const row=page.locator('.stock-row').filter({hasText:'浏览器联调合约'});await row.waitFor();
 await row.getByRole('button',{name:'编辑 浏览器联调合约'}).click();await page.getByLabel(/^备注/).fill('修改后的备注');await page.getByRole('button',{name:'保存合约',exact:true}).click();await page.getByText('修改后的备注',{exact:true}).waitFor();
 await page.getByRole('textbox',{name:'搜索合约'}).fill('TEST.UI');await page.waitForTimeout(600);assert.equal(await page.locator('.stock-row').count(),1);
 const out=path.dirname(fileURLToPath(import.meta.url));await page.screenshot({path:path.join(out,'stock-desktop.png')});await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:path.join(out,'stock-mobile.png')});
 await row.getByRole('button',{name:'删除 浏览器联调合约'}).click();await page.getByRole('button',{name:'确认删除',exact:true}).click();await row.waitFor({state:'detached'});
 await page.getByRole('button',{name:/港股/}).click();await page.getByRole('button',{name:/美股/}).click();
 await page.route('**/api/contracts**',route=>route.abort());await page.getByRole('button',{name:'刷新',exact:true}).click();await page.getByRole('alert').waitFor();assert.match(await page.getByRole('alert').textContent(),/后端不可用/);await page.unroute('**/api/contracts**');await page.getByRole('button',{name:'重试',exact:true}).click();await page.getByRole('alert').waitFor({state:'detached'});
 assert.deepEqual(errors,[]);console.log(`PASS: ${checks} real PostgreSQL API checks; frontend create/edit/search/delete/market/offline/mobile checks`);
}finally{if(browser)await browser.close();for(const id of owned)await fetch(base+'/contracts/'+id,{method:'DELETE'}).catch(()=>{})}
