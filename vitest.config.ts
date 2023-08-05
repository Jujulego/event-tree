import { swc } from 'rollup-plugin-swc3';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    cache: { dir: '.vitest' },
    coverage: {
      include: ['src/**'],
      reporter: ['text', 'lcovonly'],
    },
    typecheck: {
      tsconfig: 'tests/tsconfig.json',
    }
  },
  plugins: [
    swc({
      jsc: {
        target: 'esnext',
        parser: {
          syntax: 'typescript'
        },
        paths: {
          '@/src': ['./src']
        }
      },
      module: {
        type: 'es6'
      }
    })
  ]
});
