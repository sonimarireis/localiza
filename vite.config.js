import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,       // força a porta
    strictPort: true  // se estiver ocupada, dá erro em vez de escolher outra
  }
});
