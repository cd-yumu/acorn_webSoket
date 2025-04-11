import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    open:true,
    proxy:{
      "/api":{ // localhost |
        target:"http://192.168.0.107:9000",
        changeOrigin: true,
        // api 로 시작하는 요청은 target 경로로 요청이 간다.
        //rewrite: (path) => path.replace(/^\/api_server/, ''),
      },
      "/upload":{
        target:"http://192.168.0.107:9000",
        changeOrigin: true,
      }
    }
  }
})
