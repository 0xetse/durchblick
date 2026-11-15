import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig(
  { ignores: ['dist/', '.astro/', 'node_modules/', 'playwright-report/', 'test-results/', 'public/sw.js', '**/*.tmp.mjs'] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.tsx'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // Preact uses `class`; the consent dialog's autofocus is a deliberate,
      // user-triggered focus move.
      'jsx-a11y/no-autofocus': 'off',
    },
  },
  {
    rules: {
      'no-restricted-globals': ['error', { name: 'fetch', message: 'Durchblick makes no runtime network requests from app code.' }],
      'no-restricted-syntax': [
        'error',
        { selector: "NewExpression[callee.name='XMLHttpRequest']", message: 'No runtime network requests.' },
        { selector: "NewExpression[callee.name='WebSocket']", message: 'No runtime network requests.' },
        { selector: "MemberExpression[property.name='sendBeacon']", message: 'No beacons.' },
      ],
    },
  },
);
