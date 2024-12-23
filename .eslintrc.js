/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking', // https://github.com/ota-meshi/eslint-plugin-jsonc/issues/245
    'plugin:react/recommended',
    'plugin:jsonc/prettier',
    'plugin:jsonc/recommended-with-json',
    'eslint-config-prettier',
    'plugin:prettier/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
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
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object', 'type'],
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/sort-prop-types': ['error', {
      'callbacksLast': true,
      'ignoreCase': true,
      'requiredFirst': true,
      'sortShapeProp': true,
      'noSortAlphabetically': false
    }],
    'react/jsx-sort-props': ['error', {
      'callbacksLast': true,
      'shorthandFirst': true,
      'shorthandLast': true,
      'ignoreCase': true,
      'noSortAlphabetically': false,
      'reservedFirst': ['ref'],
    }]
  },
  overrides: [
    {
      files: ['*.json'],
      parser: 'jsonc-eslint-parser',
      extends: ['plugin:jsonc/recommended-with-json'],
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            pathPattern: '.*', // Hits the all properties
            order: { type: 'asc' },
          },
        ],
        'jsonc/sort-array-values': [
          'error',
          {
            pathPattern: '.*', // Hits the all properties
            order: { type: 'asc' },
          },
        ],
      },
    },
    {
      files: ['package.json'],
      parser: 'jsonc-eslint-parser',
      extends: ['plugin:jsonc/recommended-with-json'],
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies|scripts$',
            order: { type: 'asc' },
          },
        ],
      },
    },
  ],
  settings: {
    tailwindcss: {
      classRegex: "^style", // I have hope https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/254
    },
    react: {
      version: 'detect',
    },
  },
  reportUnusedDisableDirectives: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json',
  },
  ignorePatterns: ['node_modules', 'package-lock.json'],
};
