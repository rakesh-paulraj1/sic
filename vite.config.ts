import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the PHP backend running on XAMPP
      '/webdev': {
        target: 'http://localhost', // Address where your XAMPP server is running
        changeOrigin: true,         // Modify the `Origin` header to the target server
        secure: false,              // Disable SSL (for local testing without HTTPS)
        rewrite: (path) => path.replace(/^\/webdev/, ''), // Rewrite the URL path to remove `/webdev`
      },
    },
  },
})
