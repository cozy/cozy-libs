import merge from 'lodash/merge'
import defaultConfig from '@commitlint/config-conventional'

export const TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'test',
  'chore'
]

const cozyConfig = merge(defaultConfig, {
  rules: {
    'type-enum': [2, 'always', TYPES],
    'subject-case': [2, 'always', ['sentence-case']],
    'scope-case': [0],
    'header-max-length': [2, 'always', 50],
    'body-max-length': [2, 'always', 72]
  }
})

export default cozyConfig
