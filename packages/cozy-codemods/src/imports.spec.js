const j = require('jscodeshift')
const { simplify } = require('./imports')
const { before, after } = require('./__mocks__/imports')
require('@testing-library/jest-dom')

describe('transform imports', () => {
  it('should transform imports according to options', () => {
    const root = j(before)

    simplify(root, {
      imports: {
        Dialog: {
          importPath: 'cozy-ui/transpiled/react/Dialog',
          defaultImport: true
        },
        DialogFile: {
          importPath: 'cozy-ui/transpiled/react/Dialog',
          defaultImport: false
        },
        DialogContent: {
          importPath: 'cozy-ui/transpiled/react/Dialog',
          defaultImport: false
        }
      }
    })

    expect(root.toSource()).toEqual(after)
  })
})
