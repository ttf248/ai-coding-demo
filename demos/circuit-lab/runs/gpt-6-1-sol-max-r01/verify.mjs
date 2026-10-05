import assert from 'node:assert/strict';
import { verifyDemo } from './verification-helper.mjs';

await verifyDemo(import.meta.url, async ({page, check}) => {
  const measurements = () => page.evaluate(() => Object.fromEntries(state.solution.results));
  const near = (actual, expected) => assert.ok(Math.abs(actual-expected)<1e-9, actual+' != '+expected);
  await check('12V + 100Ω + 200Ω 串联为 0.04A，元件电压为 4V / 8V', async () => {
    const r=await measurements(); near(r.c1.i,-.04); near(r.c2.i,.04); near(r.c3.i,.04); near(r.c2.v,4); near(r.c3.v,8);
  });
  await check('并联支路 0.12A / 0.06A，总电流 0.18A', async () => {
    await page.locator('#parallel').click(); const r=await measurements(); near(r.c2.i,.12);near(r.c3.i,.06);near(r.c1.i,-.18);
  });
  await check('通过控件断开开关后电流归零', async () => {
    await page.locator('[data-comp="c4"]').click();await page.locator('#toggleSwitch').click();
    const r=await measurements();for(const item of Object.values(r))near(item.i,0);
  });
  await check('拖动元件保持连接和计算结果', async () => {
    await page.locator('#series').click();const before=await page.evaluate(()=>({x:state.components[1].x,wires:JSON.stringify(state.wires)}));
    const box=await page.locator('[data-comp="c2"] rect').boundingBox();
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+48,box.y+box.height/2+35,{steps:6});await page.mouse.up();
    const after=await page.evaluate(()=>({x:state.components[1].x,wires:JSON.stringify(state.wires)}));assert.notEqual(after.x,before.x);assert.equal(after.wires,before.wires);near((await measurements()).c2.i,.04);
  });
  await check('删除元件移除关联导线', async () => {
    await page.locator('#delete').click();assert.equal(await page.evaluate(()=>state.components.some(c=>c.id==='c2')),false);assert.equal(await page.evaluate(()=>state.wires.some(w=>w.a.startsWith('c2:')||w.b.startsWith('c2:'))),false);
  });
  await check('元件参数修改影响求解，非法电阻提示并保留原值', async () => {
    await page.locator('#series').click();await page.locator('[data-comp="c2"]').click();await page.locator('#componentValue').fill('400');await page.locator('#componentValue').press('Tab');near((await measurements()).c2.i,.02);
    await page.locator('#componentValue').fill('0');await page.locator('#componentValue').press('Tab');assert.match(await page.locator('#editError').textContent(),/请输入/);near((await measurements()).c2.i,.02);
  });
  await check('电源短路明确提示且不输出有限伪电流', async () => {
    await page.locator('#shortPreset').click();assert.match(await page.locator('#status').textContent(),/短路/);assert.match(await page.locator('#results').textContent(),/无法求解/);assert.doesNotMatch(await page.locator('#results').textContent(),/NaN|Infinity/);
  });
  await check('混合电路：100Ω 串联两个并联 200Ω，总电流 0.06A', async () => {
    const r=await page.evaluate(()=>{state.components=[];state.wires=[];state.next=1;const b=add('battery',140,100,12),a=add('resistor',350,100,100),r1=add('resistor',530,220,200),r2=add('resistor',530,380,200);link(b,'a',a,'a');link(a,'b',r1,'a');link(r1,'a',r2,'a');link(r1,'b',r2,'b');link(r2,'b',b,'b');state.pending=null;update();return Object.fromEntries(state.solution.results);});near(r.c1.i,-.06);near(r.c3.i,.03);near(r.c4.i,.03);
  });
  await check('相互冲突的理想电源与无唯一解分别提示', async () => {
    const message=await page.evaluate(()=>{state.components=[];state.wires=[];state.next=1;const a=add('battery',150,150,12),b=add('battery',450,150,5);link(a,'a',b,'a');link(a,'b',b,'b');update();return state.solution.error;});assert.match(message,/冲突/);
    const redundant=await page.evaluate(()=>{state.components[1].value=12;update();return state.solution.error;});assert.match(redundant,/无唯一解/);
  });
  await check('断开的独立元件无电流且跨独立电路电压未定义', async () => {
    const result=await page.evaluate(()=>{state.components=[];state.wires=[];state.next=1;const s=add('switch',220,180);s.on=false;add('resistor',480,180,100);update();return Object.fromEntries(state.solution.results);});near(result.c1.i,0);assert.equal(result.c1.v,null);near(result.c2.i,0);
  });
  await check('灯泡消耗功率由实际电压与电阻计算', async () => {
    const r=await page.evaluate(()=>{state.components=[];state.wires=[];state.next=1;const b=add('battery',170,130,12),l=add('lamp',470,250,60);link(b,'a',l,'a');link(b,'b',l,'b');update();return state.solution.results.get(l.id);});near(r.i,.2);near(r.p,2.4);
  });
  await page.locator('#reset').click();
});
