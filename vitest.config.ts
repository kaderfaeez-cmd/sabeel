import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Native tsconfig path resolution — no plugin needed, so `@/…` imports in tests
  // resolve exactly the way they do in the Next build.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      // Static config tables with no logic to exercise.
      exclude: ['src/lib/navigation.ts', 'src/lib/fonts.ts', 'src/lib/**/*.test.ts'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
