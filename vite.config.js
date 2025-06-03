import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: '0.0.0.0', // Доступ с любого IP (или укажите конкретный, например 'localhost')
    port: 3000,      // Опционально: можно также изменить порт
  },
})
