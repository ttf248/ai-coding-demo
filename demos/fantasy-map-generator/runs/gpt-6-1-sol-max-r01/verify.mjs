import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { verifyDemo } from './verification-helper.mjs';

await verifyDemo(import.meta.url, async ({page, check}) => {
  const png=()=>page.evaluate(()=>atlas.toDataURL('image/png'));
  const signature=async()=>createHash('sha256').update(await png()).digest('hex');
  let baseline;
  await check('相同种子与参数生成完全相同的地形和 PNG 像素', async () => {
    baseline=await signature();await page.locator('#generate').click();assert.equal(await signature(),baseline);
  });
  await check('改变种子产生不同地形，恢复种子可复现原地图', async () => {
    await page.locator('#seed').fill('验收种子-20261005');await page.locator('#generate').click();assert.notEqual(await signature(),baseline);await page.locator('#reset').click();assert.equal(await signature(),baseline);
  });
  await check('所有流向严格下降，已绘河流最终进入海洋或内陆湖', async () => {
    const issues=await page.evaluate(()=>{const issues=[];for(let i=0;i<SIZE;i++){if(down[i]>=0&&!(heights[down[i]]<heights[i]))issues.push('uphill '+i);if(heights[i]>sea&&flow[i]>18){let j=i,count=0;while(down[j]>=0&&heights[j]>sea&&count++<SIZE)j=down[j];if(count>=SIZE||heights[j]>sea&&!lakes[j])issues.push('invalid terminus '+i);}}return issues;});assert.deepEqual(issues,[]);
  });
  await check('海平面和粗糙度控制真实影响地图', async () => {
    await page.locator('#sea').fill('55');await page.locator('#sea').dispatchEvent('input');const flooded=await signature();assert.notEqual(flooded,baseline);assert.ok(await page.evaluate(()=>landCells/SIZE)<.5);
    await page.locator('#reset').click();await page.locator('#rough').fill('100');await page.locator('#rough').dispatchEvent('input');assert.notEqual(await signature(),baseline);await page.locator('#reset').click();
  });
  await check('缩放后的画笔修改正确世界坐标且更新海岸水系', async () => {
    await page.locator('#zoomIn').click();await page.locator('#zoomIn').click();await page.locator('[data-tool="lower"]').click();
    const box=await page.locator('#map').boundingBox(),x=box.x+box.width*.6,y=box.y+box.height*.55;
    const before=await page.evaluate(({x,y})=>{const p=point({clientX:x,clientY:y}),w=world(p),i=Math.floor(w.y)*NX+Math.floor(w.x);return {i,h:heights[i],sum:heights.reduce((a,b)=>a+b,0),coast:landCells};},{x,y});
    await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+12,y+10,{steps:8});await page.mouse.up();await page.waitForTimeout(50);
    const after=await page.evaluate(i=>({h:heights[i],sum:heights.reduce((a,b)=>a+b,0)}),before.i);assert.ok(after.h<before.h);assert.ok(after.sum<before.sum);assert.notEqual(await signature(),baseline);assert.match(await page.locator('#status').textContent(),/地形已编辑/);
  });
  await check('撤销恢复地形与地图像素，城镇标签可隐藏', async () => {
    await page.locator('#undo').click();assert.equal(await signature(),baseline);await page.locator('#labels').uncheck();assert.notEqual(await signature(),baseline);await page.locator('#labels').check();assert.equal(await signature(),baseline);
  });
  await check('平移与适合窗口改变视图', async () => {
    await page.locator('[data-tool="pan"]').click();const box=await page.locator('#map').boundingBox();const before=await page.evaluate(()=>({x:view.x,y:view.y}));await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+60,box.y+box.height/2+40,{steps:5});await page.mouse.up();const after=await page.evaluate(()=>({x:view.x,y:view.y}));assert.notDeepEqual(after,before);await page.locator('#fit').click();assert.equal(await page.evaluate(()=>view.scale),1);
  });
  await check('PNG 导出包含当前完整地图，文件像素与画布一致', async () => {
    const expected=Buffer.from((await png()).split(',')[1],'base64');const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise,actual=await fs.readFile(await download.path());assert.equal(createHash('sha256').update(actual).digest('hex'),createHash('sha256').update(expected).digest('hex'));assert.equal(actual.readUInt32BE(16),1200);assert.equal(actual.readUInt32BE(20),900);
  });
  await check('空种子有明确提示且不更改已有地图', async () => {
    await page.locator('#seed').fill(' ');await page.locator('#generate').click();assert.match(await page.locator('#status').textContent(),/请填写/);assert.equal(await signature(),baseline);
  });
  await page.locator('#reset').click();
});
