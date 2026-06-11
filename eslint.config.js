const { fixupPluginRules } = require('@eslint/compat');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const jsoncPlugin = require('eslint-plugin-jsonc');
const prettierPlugin = require('eslint-plugin-prettier');
const reactPlugin = require('eslint-plugin-react');
const tailwindPlugin = require('eslint-plugin-tailwindcss');

const TS_FILES = ['**/*.{ts,tsx,js}'];
const tsFlat = tsPlugin.configs['flat/recommended'];
const twFlat = tailwindPlugin.configs['flat/recommended'];

module.exports = [
  // --- Ignores ---
  { ignores: ['node_modules/**', 'package-lock.json'] },

  // --- Linter options ---
  { linterOptions: { reportUnusedDisableDirectives: true } },

  // --- TypeScript: base (parser + plugin) scoped to TS/JS files ---
  { ...tsFlat[0], files: TS_FILES },
  // TypeScript: eslint-recommended overrides (already scoped to *.ts/tsx by the plugin)
  tsFlat[1],
  // TypeScript: recommended rules scoped to TS/JS files
  { ...tsFlat[2], files: TS_FILES },

  // --- Tailwind CSS (scoped to TS/JS files) ---
  { ...twFlat[0], files: TS_FILES },
  { ...twFlat[1], files: TS_FILES },

  // --- Main rules for TS/JS files ---
  {
    files: TS_FILES,
    plugins: {
      prettier: prettierPlugin,
      import: fixupPluginRules(importPlugin),
      react: fixupPluginRules(reactPlugin),
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
    settings: {
      tailwindcss: {
        classRegex: '^style',
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      // react/recommended
      ...reactPlugin.configs.recommended.rules,

      // Prettier
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'always',
          bracketSameLine: true,
          htmlWhitespaceSensitivity: 'ignore',
          printWidth: 100,
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'all',
          endOfLine: 'auto',
        },
      ],

      // TypeScript overrides
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],

      // Import order
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          groups: [
            'index',
            'sibling',
            'parent',
            'internal',
            'external',
            'builtin',
            'object',
            'type',
          ],
        },
      ],

      // React
      'react/react-in-jsx-scope': 'off',
      'react/sort-prop-types': [
        'error',
        {
          callbacksLast: true,
          ignoreCase: true,
          requiredFirst: true,
          sortShapeProp: true,
          noSortAlphabetically: false,
        },
      ],
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          shorthandLast: true,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: ['ref'],
        },
      ],
    },
  },

  // --- Prettier: disable conflicting formatting rules ---
  prettierConfig,

  // --- JSON files ---
  ...jsoncPlugin.configs['flat/recommended-with-json'],
  {
    files: ['**/*.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          pathPattern: '.*',
          order: { type: 'asc' },
        },
      ],
      'jsonc/sort-array-values': [
        'error',
        {
          pathPattern: '.*',
          order: { type: 'asc' },
        },
      ],
    },
  },
  {
    files: ['package.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies|scripts$',
          order: { type: 'asc' },
        },
      ],
      'jsonc/sort-array-values': 'off',
    },
  },
];
