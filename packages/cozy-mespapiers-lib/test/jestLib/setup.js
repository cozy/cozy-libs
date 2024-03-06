// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/polyfill')

// polyfill for requestAnimationFrame
/* istanbul ignore next */
global.requestAnimationFrame = cb => {
  setTimeout(cb, 0)
}

// Fix error "Cannot use import statement outside a module"
jest.mock('flexsearch/dist/module/lang/latin/balance', () => ({
  encode: jest.fn()
}))

// Don't print console.warn, console.error, console.info & console.debug in tests
global.console = {
  ...global.console,
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
}
