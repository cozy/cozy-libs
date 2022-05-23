export const before = `
import React from 'react'
import 'side-effect-package'
import DialogFile from 'cozy-ui/transpiled/react/DialogFile'
import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import Tabs, { TabPanels, TabPanel } from 'cozy-ui/transpiled/react/Tabs'
`

export const after = `
import React from 'react'
import 'side-effect-package'
import Dialog, { DialogFile, DialogContent } from "cozy-ui/transpiled/react/Dialog";
import Tabs, { TabPanels, TabPanel } from 'cozy-ui/transpiled/react/Tabs'
`
