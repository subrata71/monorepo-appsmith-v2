import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import zustandRules from './lint-rules/eslint-plugin-zustand-rules/index.js';
import reactUseMemo from '@arthurgeron/eslint-plugin-react-usememo';

export default tseslint.config(
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,
  {
    ignores: ['dist/**', 'eslint.config.js', 'lint-rules/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'zustand-rules': zustandRules,
      '@arthurgeron/react-usememo': reactUseMemo,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json',
        },
      },
    },
    rules: {
      // Enforce consistent type imports to prevent verbatimModuleSyntax errors
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],
      // Ensure type-only imports are marked as type-only
      '@typescript-eslint/no-import-type-side-effects': 'error',
      // Allow shadcn UI components to export utilities alongside components
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: [
            'cn',
            'buttonVariants',
            'badgeVariants',
            'toggleVariants',
            'navigationMenuTriggerStyle',
          ],
        },
      ],
      // Import plugin rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-duplicates': 'warn',
      '@arthurgeron/react-usememo/require-usememo': 'error',
      '@arthurgeron/react-usememo/require-memo': 'error',
      // Custom rules
      'zustand-rules/no-multiple-selectors': 'error',
    },
  },
  {
    files: ['src/shared/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
      '@arthurgeron/react-usememo/require-usememo': 'off',
      '@arthurgeron/react-usememo/require-memo': 'off',
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/main.tsx'],
    rules: {
      '@arthurgeron/react-usememo/require-usememo': 'off',
      '@arthurgeron/react-usememo/require-memo': 'off',
    },
  }
);
