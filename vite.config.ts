import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Matches the repository name, so the GitHub Pages build resolves assets.
  base: '/advisorCRM/',
  plugins: [react()],
})
