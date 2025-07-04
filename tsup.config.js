import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: 'esm',
})