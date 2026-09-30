import fs from 'node:fs';
import { build } from 'esbuild';
const result=await build({entryPoints:['scene.js'],bundle:true,format:'iife',minify:true,write:false,platform:'browser'});
const script=result.outputFiles[0].text.replace(/[ \t]+(?=\r?$)/gm,'').replace(/<\/script/gi,'<\\/script');
const html=fs.readFileSync('template.html','utf8').replace('<!-- SCENE -->',()=>`<script>${script}</script>`);
fs.writeFileSync('index.html',html);
