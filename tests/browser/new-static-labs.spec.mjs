import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolveLocal } from "../../scripts/lib.mjs";

test("circuit handles conflicting sources and mixed resistor networks",async({page})=>{
await page.goto(entry("circuit-lab"));
const result=await page.evaluate(()=>{
lab.preset("parallel");const ps=lab.parts.filter(p=>p.type==="resistor");const sw=lab.parts.find(p=>p.type==="switch");let r=lab.add("resistor",650,400,50);
for(let k=lab.wires.length-1;k>=0;k--)if(lab.wires[k].some(t=>t===sw.id+":0"))lab.wires.splice(k,1);
lab.wires.push([ps[1].id+":1",r.id+":0"],[r.id+":1",sw.id+":0"]);lab.solve();const mixed=Math.abs(lab.results[1].i);
lab.preset("series");const battery=lab.parts[0],second=lab.add("battery",700,300,9);lab.wires.push([battery.id+":0",second.id+":0"],[battery.id+":1",second.id+":1"]);lab.solve();return {mixed,conflict:lab.error};
});expect(result.mixed).toBeCloseTo(12/(50+1/(1/100+1/200)),8);expect(result.conflict).toContain("无唯一解");
});
test("touch edits terrain and connects circuit terminals",async({browser,baseURL})=>{
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();const errors=[];page.on("pageerror",e=>errors.push(e.message));
await page.goto(new URL(entry("pathfinding-lab"),baseURL).href);await page.locator("#board").scrollIntoViewIfNeeded();let box=await page.locator("#board").boundingBox();await page.touchscreen.tap(box.x+box.width*.45,box.y+box.height*.325);expect(await page.evaluate(()=>lab.state.terrain[6*28+12])).toBe(0);
await page.goto(new URL(entry("circuit-lab"),baseURL).href);await page.click("#add");await page.locator("#board").scrollIntoViewIfNeeded();let count=await page.evaluate(()=>lab.wires.length);
for(const selector of ["#board g:first-of-type circle:first-of-type","#board g:last-of-type circle:last-of-type"]){const b=await page.locator(selector).boundingBox();await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2)}
expect(await page.evaluate(()=>lab.wires.length)).toBe(count+1);expect(errors).toEqual([]);await context.close();
});

const ids=["fantasy-map-generator","pathfinding-lab","fluid-simulation","circuit-lab"];
const entry=id=>"demos/"+id+"/runs/gpt-6-1-sol-low-r01/index.html";
for(const id of ids){
test(id+" opens offline and on mobile without overflow",async({page,baseURL})=>{
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 for(const address of [new URL(entry(id),baseURL).href,pathToFileURL(resolveLocal(entry(id))).href]){
 await page.setViewportSize({width:390,height:844});await page.goto(address);await expect(page.locator("#status")).not.toBeEmpty();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 if(id==="fluid-simulation")expect(await page.evaluate(()=>lab.ready)).toBeTruthy();
 }expect(errors).toEqual([]);
});
}
test("pathfinding searches match weighted and unreachable cases",async({page})=>{
await page.goto(entry("pathfinding-lab"));
const result=await page.evaluate(()=>{
 function run(mode,kind){document.querySelector("#algo").value=mode;lab.preset(kind);for(let i=0;i<1000&&!lab.state.search?.done;i++)lab.step();const s=lab.state;return {steps:s.search.path.length-1,cost:s.search.path.slice(1).reduce((a,i)=>a+s.terrain[i],0),done:s.search.done,status:document.querySelector("#status").textContent}}
 return {a:run("astar","weighted"),d:run("dijkstra","weighted"),b:run("bfs","weighted"),empty:run("astar","empty"),closed:run("astar","closed")};
});
expect(result.a.cost).toBe(result.d.cost);expect(result.b.steps).toBe(23);expect(result.b.cost).toBeGreaterThan(result.a.cost);expect(result.empty.steps).toBe(23);expect(result.closed.status).toContain("不可达");
await page.selectOption("#preset","empty");await page.click("#step");expect(await page.evaluate(()=>lab.state.search.closed.size)).toBe(1);
await page.click("#pause");let count=await page.evaluate(()=>lab.state.search.closed.size);await page.waitForTimeout(100);expect(await page.evaluate(()=>lab.state.search.closed.size)).toBe(count);
await page.setViewportSize({width:390,height:844});let box=await page.locator("#board").boundingBox();await page.mouse.click(box.x+box.width*.4,box.y+box.height*.25);expect(await page.evaluate(()=>lab.state.search)).toBeNull();
});
test("map is deterministic, editable and drains downhill",async({page})=>{
await page.goto(entry("fantasy-map-generator"));
let result=await page.evaluate(()=>{
 const a=lab.heights;lab.generate();let same=JSON.stringify(a)===JSON.stringify(lab.heights);
 document.querySelector("#seed").value="另一座岛";lab.generate();let different=JSON.stringify(a)!==JSON.stringify(lab.heights);
 let h=lab.heights;let downhill=lab.rivers.every(r=>r.path.slice(1).every((v,k)=>h[v]<h[r.path[k]]));
 document.querySelector("#tool").value="raise";lab.brush({x:384,y:384});let edited=JSON.stringify(h)!==JSON.stringify(lab.heights);return {same,different,downhill,edited};
});expect(result).toEqual({same:true,different:true,downhill:true,edited:true});
await page.click("#in");expect(await page.locator("#zoomtext").textContent()).toBe("1.3×");
const download=page.waitForEvent("download");await page.click("#export");expect((await download).suggestedFilename()).toContain(".png");
});
test("circuit solves series, parallel, open and short circuits",async({page})=>{
await page.goto(entry("circuit-lab"));
const result=await page.evaluate(()=>{
lab.preset("series");let series=Object.values(lab.results).map(v=>v.i).filter(v=>v!==null);
lab.preset("parallel");let parallel=Object.values(lab.results).map(v=>Math.abs(v.i)).filter(v=>v!==0);
lab.parts.find(p=>p.type==="switch").closed=false;lab.solve();let open=Object.values(lab.results).filter(v=>v.i!==null).every(v=>Math.abs(v.i)<1e-8);
lab.preset("series");let battery=lab.parts.find(p=>p.type==="battery");lab.wires.push([battery.id+":0",battery.id+":1"]);lab.solve();return {series,parallel,open,error:lab.error};
});result.series.forEach(v=>expect(Math.abs(v)).toBeCloseTo(.04,8));expect(result.parallel).toEqual(expect.arrayContaining([expect.closeTo(.12,8),expect.closeTo(.06,8),expect.closeTo(.18,8)]));expect(result.open).toBeTruthy();expect(result.error).toContain("短路");
await page.click("#series");await page.selectOption("#mode","delete");await page.locator("#board g rect").first().click();expect(await page.evaluate(()=>lab.parts.length)).toBe(3);expect(await page.evaluate(()=>lab.wires.some(w=>w.some(t=>t.startsWith("1:"))))).toBeFalsy();
});
test("fluid computes evolving finite fields and handles pause, clear, resize",async({page})=>{
await page.goto(entry("fluid-simulation"));expect(await page.evaluate(()=>lab.ready)).toBeTruthy();await page.click("#pause");
const result=await page.evaluate(()=>{
 let a=lab.readDye();lab.tick(.016);let b=lab.readDye();return {finite:b.every(Number.isFinite),changed:a.some((v,i)=>Math.abs(v-b[i])>1e-7),nonzero:b.some(v=>v>.01),error:lab.glError};
});expect(result).toEqual({finite:true,changed:true,nonzero:true,error:0});
const a=await page.evaluate(()=>lab.readDye());await page.waitForTimeout(150);expect(await page.evaluate(()=>lab.readDye())).toEqual(a);
await page.click("#clear");expect(await page.evaluate(()=>lab.readDye().every(v=>v===0))).toBeTruthy();
await page.selectOption("#resolution","96");expect(await page.evaluate(()=>lab.dimensions)).toEqual([96,60]);
await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>lab.glError)).toBe(0);
const download=page.waitForEvent("download");await page.click("#shot");expect((await download).suggestedFilename()).toContain(".png");
});
test("fluid gives a clear unsupported WebGL message",async({page})=>{
await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==="webgl2"?null:original.call(this,type,...args)}});
await page.goto(entry("fluid-simulation"));await expect(page.locator("#status")).toContainText("不支持 WebGL2");await expect(page.locator("#pause")).toBeDisabled();
});
