// Presets are functions of the exports of rstack/lint, which define.lint()
// passes to its callback: this package does not depend on rstack.

export const testFiles = [
  '**/*.spec.{js,jsx,ts,tsx}',
  '**/*.test.{js,jsx,ts,tsx}',
  '**/__tests__/**/*.{js,jsx,ts,tsx}'
]

export const noUnusedVarsOptions = {
  caughtErrorsIgnorePattern: '^_',
  ignoreRestSiblings: true
}

export const importOrderOptions = {
  alphabetize: { order: 'asc' },
  groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
  pathGroups: [
    {
      pattern: '{cozy-*,cozy-*/**,twake-*,twake-*/**,@linagora/**}',
      group: 'external',
      position: 'after'
    },
    {
      pattern: '**/*.styles',
      group: 'index',
      position: 'after'
    },
    // ESLint could not resolve the @/ alias and sorted it last: keep that order
    {
      pattern: '@/**',
      group: 'index',
      position: 'after'
    }
  ],
  distinctGroup: true,
  pathGroupsExcludedImportTypes: [
    '{cozy-*,cozy-*/**,twake-*,twake-*/**,@linagora/**}'
  ],
  'newlines-between': 'always',
  warnOnUnassignedImports: true
}

export default function basics({ js, promisePlugin, globals }) {
  return [
    js.configs.recommended,
    promisePlugin.configs.recommended,
    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.jest,
          ...globals.node,
          ...globals.es2021
        }
      },
      plugins: ['import'],
      rules: {
        'no-console': 'error',
        'no-param-reassign': 'warn',
        'no-unused-vars': ['error', noUnusedVarsOptions],
        'import/order': ['warn', importOrderOptions]
      }
    },
    // Out of tests, the jest rules mistake a regex .test() call for a test
    {
      files: testFiles,
      plugins: ['jest'],
      rules: {
        'jest/no-focused-tests': 'error',
        'jest/no-disabled-tests': 'warn'
      }
    }
  ]
}
