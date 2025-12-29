import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Validate required environment variables
  const required = ['APP_CLIENT_ID', 'AUTH_SERVER_URL', 'APP_URL']
  const missing = required.filter(key => !env[key])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  const basePath = env.BASE_PATH || '/bodhi-js-sample-app/'

  return {
    plugins: [react()],
    base: basePath,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_APP_CLIENT_ID': JSON.stringify(env.APP_CLIENT_ID),
      'import.meta.env.VITE_AUTH_SERVER_URL': JSON.stringify(env.AUTH_SERVER_URL),
      'import.meta.env.VITE_APP_URL': JSON.stringify(env.APP_URL),
      'import.meta.env.VITE_BASE_PATH': JSON.stringify(basePath),
    },
  }
})
