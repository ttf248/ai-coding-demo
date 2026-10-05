import {test,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const topics=['circuit-lab','fantasy-map-generator','fluid-simulation','pathfinding-lab'];
const entry=t=>`demos/${t}/runs/gpt-6-astra-low-r01/index.html`;
for(const topic of topics){test(`${topic}: HTTP、file 与 390px 触摸视口`,async({page,baseURL})=>{
const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const url of [new URL(entry(topic),baseURL+'/').href,pathToFileURL(path.resolve(entry(topic))).href]){await page.goto(url);await expect(page.locator('canvas')).toBeVisible();await page.setViewportSize({width:390,height:844});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);if(topic==='fluid-simulation')await expect(page.locator('#status')).toContainText('WebGL 2 ·');await page.waitForTimeout(100);}
expect(errors).toEqual([]);
});}
test('电路: 串并联、开路、短路、冲突与浮置网络',async({page})=>{
await page.goto(entry('circuit-lab'));
let currents=()=>page.evaluate(()=>parts.filter(p=>p.type==='resistor').map(p=>readings.get(p.id).current));
expect(await currents()).toEqual([.04,.04]);
await page.click('#parallel');let parallel=await currents();expect(parallel[0]).toBeCloseTo(.12);expect(parallel[1]).toBeCloseTo(.06);
expect(await page.evaluate(()=>readings.get(parts.find(p=>p.type==='battery').id).current)).toBeCloseTo(-.18);
await page.evaluate(()=>{parts.find(p=>p.type==='switch').closed=false;solve()});expect(await currents()).toEqual([0,0]);
await page.evaluate(()=>{preset();connect(parts[0],0,parts[0],1);solve()});await expect(page.locator('#status')).toContainText('电源短路');
await page.evaluate(()=>{preset();let p=add('battery');p.value=6;connect(parts[0],0,p,0);connect(parts[0],1,p,1);solve()});await expect(page.locator('#status')).toContainText('冲突');
await page.evaluate(()=>{parts.at(-1).value=12;solve()});await expect(page.locator('#status')).toContainText('无唯一解');
await page.evaluate(()=>{preset();add('resistor');solve()});expect(await page.evaluate(()=>readings.get(parts.at(-1).id).current)).toBe(0);
});
test('电路: 拖动保留连接、删除清线与触摸端子',async({browser,baseURL})=>{
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});let page=await context.newPage();await page.goto(new URL(entry('circuit-lab'),baseURL+'/').href);await page.click('#parallel');
await page.locator('canvas').scrollIntoViewIfNeeded();let box=await page.locator('canvas').boundingBox(),point=await page.evaluate(()=>({x:parts[1].x,y:parts[1].y}));
await page.mouse.move(box.x+point.x,box.y+point.y);await page.mouse.down();await page.mouse.move(box.x+point.x,box.y+point.y+35);await page.mouse.up();expect(await page.evaluate(()=>wires.length)).toBe(5);
await page.click('#delete');expect(await page.evaluate(()=>wires.every(w=>w.every(k=>!k.startsWith('2:'))))).toBe(true);
await page.click('#reset');await page.locator('canvas').scrollIntoViewIfNeeded();box=await page.locator('canvas').boundingBox();let ends=await page.evaluate(()=>[terminal(parts[0],0),terminal(parts[0],1)]);for(let p of ends)await page.touchscreen.tap(box.x+p.x,box.y+p.y);await expect(page.locator('#status')).toContainText('电源短路');await context.close();
});
test('寻路: 算法代价、不可达与真实单步',async({page})=>{
await page.goto(entry('pathfinding-lab'));const solve=alg=>page.evaluate(a=>{$('algorithm').value=a;stop();let n=0;while(!search?.done&&n++<1000)tick();return {path:search.path,stats:$('stats').textContent}},alg);
let bfs=await solve('BFS'),d=await solve('Dijkstra'),a=await solve('A*');expect(bfs.stats).toContain('23 步');expect(bfs.stats).toContain('91');expect(d.stats).toContain('总代价 25');expect(a.stats).toContain('总代价 25');
await page.selectOption('#preset','blocked');await page.click('#load');expect((await solve('BFS')).stats).toContain('不可达');
await page.selectOption('#preset','empty');await page.click('#load');await page.click('#step');expect(await page.evaluate(()=>search.closed.size)).toBe(1);await page.waitForTimeout(150);expect(await page.evaluate(()=>search.closed.size)).toBe(1);
await page.click('#run');await page.click('#pause');let count=await page.evaluate(()=>search.closed.size);await page.waitForTimeout(150);expect(await page.evaluate(()=>search.closed.size)).toBe(count);
const b=await page.locator('canvas').boundingBox();await page.mouse.click(b.x+b.width*.5,b.y+b.height*.5);expect(await page.evaluate(()=>search)).toBe(null);
});
test('地图: 种子可重复、画笔坐标、下降水系与导出',async({page})=>{
await page.goto(entry('fantasy-map-generator'));let data=()=>page.evaluate(()=>atlas.toDataURL());let before=await data();await page.click('#generate');expect(await data()).toBe(before);await page.fill('#seed','另一片大陆');await page.click('#generate');expect(await data()).not.toBe(before);
expect(await page.evaluate(()=>rivers.every(p=>p.every((n,i)=>i===0||heights[n]<heights[p[i-1]])))).toBe(true);
await page.click('#in');await page.selectOption('#tool','raise');let n=await page.evaluate(()=>Math.floor((viewH/2-oy)/zoom/6)*W+Math.floor((viewW/2-ox)/zoom/6));let h=await page.evaluate(n=>heights[n],n);let box=await page.locator('canvas').boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);expect(await page.evaluate(n=>heights[n],n)).toBeGreaterThan(h);
const download=page.waitForEvent('download');await page.click('#export');expect((await download).suggestedFilename()).toContain('.png');
});
test('流体: GPU 演化、暂停、清空、重建与截图',async({page})=>{
await page.goto(entry('fluid-simulation'));await expect(page.locator('#status')).toContainText('WebGL 2 ·');
let data=()=>page.evaluate(()=>canvas.toDataURL());let before=await data();const b=await page.locator('canvas').boundingBox();await page.mouse.move(b.x+b.width*.3,b.y+b.height*.5);await page.mouse.down();await page.mouse.move(b.x+b.width*.7,b.y+b.height*.4,{steps:20});await page.mouse.up();await page.waitForTimeout(200);let after=await data();expect(after).not.toBe(before);await page.waitForTimeout(150);expect(await data()).not.toBe(after);
await page.click('#pause');let frozen=await data();await page.waitForTimeout(200);expect(await data()).toBe(frozen);await page.click('#clear');expect(await data()).toBe(before);
await page.selectOption('#resolution','96');expect(await page.evaluate(()=>Math.max(sw,sh))).toBe(96);expect(await page.evaluate(()=>resources.length)).toBe(7);expect(await page.evaluate(()=>gl.getError())).toBe(0);
let download=page.waitForEvent('download');await page.click('#shot');expect((await download).suggestedFilename()).toContain('.png');
});
test('流体: 不支持 WebGL 时显示错误',async({page})=>{await page.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>null});await page.goto(entry('fluid-simulation'));await expect(page.locator('#status')).toContainText('WebGL 2 不可用');});

test('移动端: 地图画笔、寻路编辑与流体触摸拖动',async({browser,baseURL})=>{
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage();const cdp=await context.newCDPSession(page);
async function touchDrag(){await page.locator('canvas').scrollIntoViewIfNeeded();const b=await page.locator('canvas').boundingBox(),x=b.x+b.width*.4,y=b.y+b.height*.5;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+i*5,y:y-i*3}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
await page.goto(new URL(entry('fantasy-map-generator'),baseURL+'/').href);await page.selectOption('#tool','raise');let terrain=await page.evaluate(()=>Array.from(heights));await touchDrag();expect(await page.evaluate(()=>Array.from(heights))).not.toEqual(terrain);
await page.goto(new URL(entry('pathfinding-lab'),baseURL+'/').href);await touchDrag();expect(await page.evaluate(()=>grid.filter(v=>v===1).length)).toBeGreaterThan(0);
await page.goto(new URL(entry('fluid-simulation'),baseURL+'/').href);await expect(page.locator('#status')).toContainText('WebGL 2 ·');let blank=await page.evaluate(()=>canvas.toDataURL());await touchDrag();await page.waitForTimeout(200);expect(await page.evaluate(()=>canvas.toDataURL())).not.toBe(blank);await context.close();
});
