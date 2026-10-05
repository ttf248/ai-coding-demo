import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { verifyDemo } from './verification-helper.mjs';

await verifyDemo(import.meta.url, async ({page, browser, url, check}) => {
  await page.waitForFunction(()=>ready,null,{timeout:10000});
  const png=()=>page.evaluate(()=>canvas.toDataURL('image/png'));
  const signature=async()=>createHash('sha256').update(await png()).digest('hex');
  await check('WebGL 2 半浮点纹理与求解程序成功初始化', async () => {
    assert.equal(await page.locator('#fallback').isVisible(),false);assert.equal(await page.evaluate(()=>ready&&is2&&fields.targets.length===8),true);
  });
  await page.locator('#pause').click();
  await page.evaluate(()=>{
    window.fieldStats=t=>{const values=new Float32Array(t.w*t.h*4);gl.bindFramebuffer(gl.FRAMEBUFFER,t.fbo);gl.readPixels(0,0,t.w,t.h,gl.RGBA,gl.FLOAT,values);const error=gl.getError();gl.bindFramebuffer(gl.FRAMEBUFFER,null);let x=0,y=0,abs=0,scalar=0,invalid=0;for(let i=0;i<values.length;i+=4){x+=values[i];y+=values[i+1];scalar+=Math.abs(values[i]);abs+=Math.abs(values[i])+Math.abs(values[i+1])+Math.abs(values[i+2]);if(!Number.isFinite(values[i]+values[i+1]+values[i+2]))invalid++;}return {x,y,abs,scalar,mean:abs/(t.w*t.h),invalid,error};};
  });
  await check('暂停冻结画面，拖动也不注入', async () => {
    const before=await signature();await page.waitForTimeout(160);assert.equal(await signature(),before);const b=await page.locator('#fluid').boundingBox();await page.mouse.move(b.x+b.width*.3,b.y+b.height*.5);await page.mouse.down();await page.mouse.move(b.x+b.width*.6,b.y+b.height*.5,{steps:8});await page.mouse.up();assert.equal(await signature(),before);
  });
  await check('清空移除速度、染料与压力场', async () => {
    await page.locator('#clear').click();const stats=await page.evaluate(()=>[fieldStats(fields.velocity.read),fieldStats(fields.dye.read),fieldStats(fields.pressure.read)]);for(const s of stats){assert.equal(s.abs,0);assert.equal(s.error,0);}
  });
  await check('注入动量进入真实速度纹理且方向正确', async () => {
    const s=await page.evaluate(()=>{addDye(.5,.5,70,0,[1,0,0]);render();return {velocity:fieldStats(fields.velocity.read),dye:fieldStats(fields.dye.read)};});assert.ok(s.velocity.x>0);assert.equal(s.velocity.y,0);assert.ok(s.dye.x>0);assert.equal(s.velocity.invalid,0);assert.equal(s.dye.error,0);
  });
  await check('压力迭代和速度投影降低速度场散度', async () => {
    const norms=await page.evaluate(()=>{const f=fields,t=[1/f.w,1/f.h];drawPass('divergence',f.divergence,{uVelocity:f.velocity.read,uTexel:t});const before=fieldStats(f.divergence).scalar;drawPass('clear',f.pressure.read);for(let i=0;i<60;i++){drawPass('pressure',f.pressure.write,{uPressure:f.pressure.read,uDivergence:f.divergence,uTexel:t});f.pressure.swap();}drawPass('project',f.velocity.write,{uVelocity:f.velocity.read,uPressure:f.pressure.read,uTexel:t});f.velocity.swap();drawPass('divergence',f.divergence,{uVelocity:f.velocity.read,uTexel:t});return {before,after:fieldStats(f.divergence).scalar};});assert.ok(norms.before>0);assert.ok(norms.after<norms.before*.95,JSON.stringify(norms));
  });
  await check('压力迭代参数决定实际 GPU 压力 pass 次数', async () => {
    const counts=await page.evaluate(()=>{const original=drawPass;let pressureCount=0;drawPass=(name,...args)=>{if(name==='pressure')pressureCount++;original(name,...args);};try{$('iterations').value=8;step(1/60);const eight=pressureCount;pressureCount=0;$('iterations').value=40;step(1/60);return [eight,pressureCount];}finally{drawPass=original;}});assert.deepEqual(counts,[8,40]);
  });
  await check('染料随平流演化，消散参数改变染料衰减', async () => {
    const result=await page.evaluate(()=>{clearFields();$('vorticity').value=0;$('dissipation').value=0;addDye(.5,.5,0,0,[1,.5,0]);const before=fieldStats(fields.dye.read).abs;for(let i=0;i<12;i++)step(1/30);const kept=fieldStats(fields.dye.read).abs;$('dissipation').value=150;for(let i=0;i<12;i++)step(1/30);return {before,kept,decayed:fieldStats(fields.dye.read).abs};});assert.ok(result.kept>result.before*.97);assert.ok(result.decayed<result.kept*.7);
    const advected=await page.evaluate(()=>{clearFields();$('dissipation').value=0;addDye(.5,.5,90,30,[0,1,.5]);render();const before=canvas.toDataURL();for(let i=0;i<8;i++)step(1/30);render();return {changed:canvas.toDataURL()!==before,invalid:fieldStats(fields.dye.read).invalid};});assert.equal(advected.changed,true);assert.equal(advected.invalid,0);
  });
  await check('分辨率重建清空场并释放旧纹理及 framebuffer', async () => {
    await page.evaluate(()=>window.oldTargets=[...fields.targets]);await page.locator('#resolution').selectOption('64');const r=await page.evaluate(()=>({w:fields.w,h:fields.h,released:oldTargets.every(t=>!gl.isTexture(t.texture)&&!gl.isFramebuffer(t.fbo)),sum:fieldStats(fields.dye.read).abs}));assert.ok(Math.max(r.w,r.h)===64);assert.equal(r.released,true);assert.equal(r.sum,0);
  });
  await check('窗口尺寸变化保留染料且释放被替换的 GPU 资源', async () => {
    await page.evaluate(()=>{addDye(.5,.5,0,0,[1,1,0]);render();window.oldTargets=[...fields.targets];});await page.setViewportSize({width:1000,height:740});await page.waitForTimeout(60);const r=await page.evaluate(()=>({released:oldTargets.every(t=>!gl.isTexture(t.texture)&&!gl.isFramebuffer(t.fbo)),mean:fieldStats(fields.dye.read).mean,ratio:canvas.width/canvas.clientWidth}));assert.equal(r.released,true);assert.ok(r.mean>0);assert.ok(r.ratio<=1.51);
  });
  await check('PNG 截图下载且包含当前画布', async () => {
    const expected=await png(),promise=page.waitForEvent('download');await page.locator('#capture').click();const download=await promise,actual=await fs.readFile(await download.path());
    const equal=await page.evaluate(async ({expected,actual})=>{async function pixels(src){const image=new Image();image.src=src;await image.decode();const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const context=c.getContext('2d');context.drawImage(image,0,0);return context.getImageData(0,0,c.width,c.height).data;}const a=await pixels(expected),b=await pixels(actual);return a.length===b.length&&a.every((v,i)=>v===b[i]);},{expected,actual:'data:image/png;base64,'+actual.toString('base64')});assert.equal(equal,true);assert.equal(actual.readUInt32BE(16),await page.evaluate(()=>canvas.width));
  });
  await check('真实鼠标拖动注入染料，颜色与力度控件可修改', async () => {
    await page.locator('#clear').click();await page.locator('[data-color="#ff709f"]').click();assert.equal(await page.locator('#color').inputValue(),'#ff709f');await page.locator('#force').fill('80');await page.locator('#force').dispatchEvent('input');assert.match(await page.locator('#forceValue').textContent(),/80/);const before=await signature();await page.locator('#pause').click();const b=await page.locator('#fluid').boundingBox();await page.mouse.move(b.x+b.width*.2,b.y+b.height*.45);await page.mouse.down();await page.mouse.move(b.x+b.width*.7,b.y+b.height*.5,{steps:12});await page.mouse.up();await page.locator('#pause').click();assert.notEqual(await signature(),before);const r=await page.evaluate(()=>fieldStats(fields.velocity.read));assert.ok(r.x>0);
  });
  await check('缺少 WebGL 或半浮点渲染扩展时显示明确错误', async () => {
    for(const mode of ['no-webgl','no-float']){const context=await browser.newContext();const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(mode=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(mode==='no-webgl'&&type.startsWith('webgl'))return null;const value=original.call(this,type,...args);if(mode==='no-float'&&type==='webgl2'&&value){const ext=value.getExtension.bind(value);value.getExtension=name=>name==='EXT_color_buffer_float'?null:ext(name);}return value;};},mode);await p.goto(url);assert.equal(await p.locator('#fallback').isVisible(),true);assert.match(await p.locator('#fallbackMessage').textContent(),mode==='no-webgl'?/WebGL/:/EXT_color_buffer_float/);assert.deepEqual(errors,[]);await context.close();}
  });
  await check('WebGL 1 降级路径可运行', async () => {
    const context=await browser.newContext(),p=await context.newPage();await p.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:original.call(this,type,...args);};});await p.goto(url);await p.waitForFunction(()=>ready,null,{timeout:10000});assert.equal(await p.locator('#fallback').isVisible(),false);assert.match(await p.locator('#gpuBadge').textContent(),/WebGL 1/);await context.close();
  });
  await check('GPU 上下文丢失有提示且恢复后可继续', async () => {
    await page.evaluate(()=>{window.loss=gl.getExtension('WEBGL_lose_context');loss.loseContext();});await page.waitForFunction(()=>ctxLost);assert.equal(await page.locator('#fallback').isVisible(),true);await page.evaluate(()=>loss.restoreContext());await page.waitForFunction(()=>ready);assert.equal(await page.locator('#fallback').isVisible(),false);
  });
  await page.setViewportSize({width:1440,height:1050});await page.locator('#reset').click();await page.waitForTimeout(250);
});
