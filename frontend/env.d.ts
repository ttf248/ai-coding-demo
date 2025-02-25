// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    // 定义你需要的环境变量
    VITE_API_BASE_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }