const j = require('jscodeshift')
const transformImports = require('./transform-imports')

const before = `
import React from 'react'
import 'side-effect-package'
import DialogFile from 'cozy-ui/transpiled/react/DialogFile'
import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import Tabs, { TabPanels, TabPanel } from 'cozy-ui/transpiled/react/Tabs'
`

const after = `
import React from 'react'
import 'side-effect-package'
import Dialog, { DialogFile, DialogContent } from "cozy-ui/transpiled/react/Dialog";
import Tabs, { TabPanels, TabPanel } from 'cozy-ui/transpiled/react/Tabs'
`

describe('transform imports', () => {
  it('should transform imports according to options', () => {
    const root = j(before)

    transformImports(j, root, {
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
