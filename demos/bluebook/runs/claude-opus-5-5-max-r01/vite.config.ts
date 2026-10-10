import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The preview build passes `--base=./` so the output works from any sub-directory.
export default defineConfig({
  plugins: [react()],
});
