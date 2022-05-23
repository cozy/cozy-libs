const defineTest = require('jscodeshift/dist/testUtils').defineTest
defineTest(
  __dirname,
  'transform-viewer',
  null,
  'transform-viewer-without-sharing'
)
defineTest(__dirname, 'transform-viewer', null, 'transform-viewer-with-sharing')
