const eslintParser = require('@babel/eslint-parser')
const eslintPluginTypescriptEslint = require('@typescript-eslint/eslint-plugin')
const typescriptEslintParser = require('@typescript-eslint/parser')
const eslintPluginImport = require('eslint-plugin-import')
const eslintPluginJest = require('eslint-plugin-jest')
const eslintPluginPrettier = require('eslint-plugin-prettier')
const eslintPluginPromise = require('eslint-plugin-promise')
const eslintPluginReact = require('eslint-plugin-react')
const eslintPluginReactHooks = require('eslint-plugin-react-hooks')

const config = [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: eslintParser,
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    plugins: {
      prettier: eslintPluginPrettier,
      promise: eslintPluginPromise,
      jest: eslintPluginJest,
      import: eslintPluginImport
    },
    rules: {
      'no-console': 'error',
      'no-param-reassign': 'warn',
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          endOfLine: 'auto',
          semi: false,
          singleQuote: true,
          trailingComma: 'none'
        }
      ],
      'spaced-comment': ['error', 'always', { block: { exceptions: ['*'] } }],
      'jest/no-focused-tests': 'error',
      'jest/no-disabled-tests': 'warn',
      'import/order': [
        'warn',
        {
          alphabetize: { order: 'asc' },
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index']
          ],
          pathGroups: [
            {
              pattern: '{cozy-*,cozy-*/**}',
              group: 'external',
              position: 'after'
            },
            {
              pattern: '**/*.styles',
              group: 'index',
              position: 'after'
            }
          ],
          distinctGroup: true,
          pathGroupsExcludedImportTypes: ['{cozy-*,cozy-*/**}'],
          'newlines-between': 'always',
          warnOnUnassignedImports: true
        }
      ],
      'import/no-extraneous-dependencies': ['warn']
    }
  },

  // Extended settings for React (JSX)
  {
    files: ['**/*.jsx', '**/*.tsx'],
    settings: {
      react: { version: 'detect' }
    },
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks
    }
  },

  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: 'packages/**/tsconfig.json',
        tsconfigRootDir: './'
      }
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescriptEslint
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true }
      ]
    }
  },

  // Specific rules for test files
  {
    files: ['**/*.spec.jsx', '**/*.spec.js', '**/*.spec.tsx', '**/*.spec.ts'],
    rules: {
      'react/display-name': 'off'
    }
  }
]

const ignores = [
  '**/node_modules/**',
  '**/dist/**',
  '**/coverage/**',
  '**/__testfixtures__/**'
]

module.exports = [
  ...config,
  {
    ignores: [...ignores]
  }
]
