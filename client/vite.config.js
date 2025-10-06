import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    react(),
     tailwindcss(),
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
      ],
      dts: './auto-imports.d.ts', // generates types for TS/JS projects
    }),
  ],
  theme:{
    
  }
})
