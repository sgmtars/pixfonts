import { defineConfig } from 'vite';

export default defineConfig({
  base: '/pixfonts/',
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ')),
  },
});
