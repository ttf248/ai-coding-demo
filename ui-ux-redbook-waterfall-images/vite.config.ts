import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

// 自定义插件：复制 images 文件夹到 dist
const copyImagesPlugin = () => {
  return {
    name: 'copy-images',
    writeBundle() {
      const sourceDir = 'images'
      const targetDir = 'dist/images'
      
      // 检查源目录是否存在
      if (!existsSync(sourceDir)) {
        console.warn('Warning: images directory not found')
        return
      }
      
      // 创建目标目录
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true })
      }
      
      // 复制所有图片文件
      try {
        const files = readdirSync(sourceDir)
        files.forEach(file => {
          if (file.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            copyFileSync(join(sourceDir, file), join(targetDir, file))
            console.log(`Copied: ${file} to dist/images/`)
          }
        })
        console.log(`✅ Successfully copied ${files.length} images to dist/images/`)
      } catch (error) {
        console.error('Error copying images:', error)
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyImagesPlugin()],
  server: {
    port: 5173,
    open: true
  },
//   base: '/ai-coding-demo/ui-ux-redbook-waterfall-images/dist',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  // 确保 images 目录被包含在静态资源中
  publicDir: 'public',
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.webp']
})
