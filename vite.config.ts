import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Required for this GitHub repository: https://abduysfzix1.github.io/Type-your-Mind/
  base: '/Type-your-Mind/',
})