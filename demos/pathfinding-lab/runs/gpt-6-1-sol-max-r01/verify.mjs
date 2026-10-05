import assert from 'node:assert/strict';
import { verifyDemo } from './verification-helper.mjs';

await verifyDemo(import.meta.url, async ({page, check}) => {
  async function finish(algo,presetName) {
    if(presetName)await page.locator('#preset').selectOption(presetName);
    await page.locator('[data-algorithm="'+algo+'"]').click();
    return page.evaluate(()=>{initSearch();let safety=N*3;while(!search.done&&safety-->0)advance();stats();draw();return {done:search.done,found:search.found,steps:path.length-1,cost:search.distance[goal],path:[...path],visited:search.visited,front:marks.reduce((n,m)=>n+(m===1),0)};});
  }
  await check('空白网格三种算法均返回 17 步、代价 17 的四方向路径', async () => {
    for(const a of ['bfs','dijkstra','astar']){const r=await finish(a,'empty');assert.equal(r.steps,17);assert.equal(r.cost,17);assert.equal(r.found,true);for(let k=1;k<r.path.length;k++){const p=r.path[k-1],q=r.path[k];assert.equal(Math.abs(p%24-q%24)+Math.abs(Math.floor(p/24)-Math.floor(q/24)),1);}}
  });
  await check('加权地图 BFS 为 17 步 / 61 代价，Dijkstra 与 A* 均为 19 代价', async () => {
    const bfs=await finish('bfs','weighted');assert.equal(bfs.steps,17);assert.equal(bfs.cost,61);const d=await finish('dijkstra','weighted'),a=await finish('astar','weighted');assert.equal(d.cost,19);assert.equal(a.cost,19);assert.ok(d.steps>bfs.steps);
  });
  await check('封闭终点不可达且前沿耗尽', async () => {
    for(const a of ['bfs','dijkstra','astar']){const r=await finish(a,'blocked');assert.equal(r.found,false);assert.equal(r.done,true);assert.equal(r.front,0);assert.match(await page.locator('#status').textContent(),/不可达/);}
  });
  await check('起点位于高代价格时起点代价仍不计入', async () => {
    const r=await page.evaluate(()=>{preset('empty');terrain[start]=2;algorithm='dijkstra';initSearch();while(!search.done)advance();return search.distance[goal];});assert.equal(r,17);
  });
  await check('单步展开一个节点，暂停后不继续搜索', async () => {
    await page.locator('#preset').selectOption('weighted');await page.locator('#clearSearch').click();await page.locator('#step').click();assert.equal(await page.evaluate(()=>search.visited),1);await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>search.visited),1);await page.locator('#step').click();assert.equal(await page.evaluate(()=>search.visited),2);
    await page.locator('#run').click();await page.waitForTimeout(170);await page.locator('#pause').click();const count=await page.evaluate(()=>search.visited);await page.waitForTimeout(170);assert.equal(await page.evaluate(()=>search.visited),count);await page.locator('#step').click();assert.equal(await page.evaluate(()=>search.visited),count+1);
  });
  await check('编辑正在运行的地图停止并清除旧搜索', async () => {
    await page.locator('#run').click();await page.locator('[data-tool="wall"]').click();const box=await page.locator('#grid').boundingBox();await page.mouse.click(box.x+box.width*2.5/24,box.y+box.height*2.5/18);assert.equal(await page.evaluate(()=>running),false);assert.equal(await page.evaluate(()=>search),null);assert.equal(await page.evaluate(()=>terrain[2*COLS+2]),1);
  });
  await check('擦除和高代价格工具生效，起终点不可被障碍覆盖', async () => {
    const box=await page.locator('#grid').boundingBox(),point=(x,y)=>({x:box.x+box.width*(x+.5)/24,y:box.y+box.height*(y+.5)/18});let p=point(2,2);await page.locator('[data-tool="erase"]').click();await page.mouse.click(p.x,p.y);assert.equal(await page.evaluate(()=>terrain[2*COLS+2]),0);await page.locator('[data-tool="weight"]').click();await page.mouse.click(p.x,p.y);assert.equal(await page.evaluate(()=>terrain[2*COLS+2]),2);await page.locator('[data-tool="wall"]').click();p=point(3,9);await page.mouse.click(p.x,p.y);p=point(20,9);await page.mouse.click(p.x,p.y);assert.equal(await page.evaluate(()=>terrain[start]+terrain[goal]),0);
  });
  await check('拖动起点更新位置，重置重新加载相同预设', async () => {
    const box=await page.locator('#grid').boundingBox();await page.mouse.move(box.x+box.width*3.5/24,box.y+box.height*9.5/18);await page.mouse.down();await page.mouse.move(box.x+box.width*4.5/24,box.y+box.height*9.5/18,{steps:4});await page.mouse.up();assert.equal(await page.evaluate(()=>start),9*24+4);await page.locator('#reset').click();const first=await page.evaluate(()=>JSON.stringify([...terrain]));await page.locator('#reset').click();assert.equal(await page.evaluate(()=>JSON.stringify([...terrain])),first);assert.equal(await page.evaluate(()=>start),9*24+3);
  });
  await page.locator('[data-algorithm="astar"]').click();await finish('astar','weighted');
});
