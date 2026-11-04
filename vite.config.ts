import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/watsonx': {
        target: 'https://us-south.ml.cloud.ibm.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/watsonx/, ''),
        secure: true,
      },
      '/api/ibm-iam': {
        target: 'https://iam.cloud.ibm.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ibm-iam/, ''),
        secure: true,
      }
    }
  }
})
