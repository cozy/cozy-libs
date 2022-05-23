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

export const JSXElementWithoutClosingElement = {
  openingElement: expect.any(Object),
  closingElement: null,
  attributes: [],
  children: [],
  name: expect.objectContaining({
    name: 'SomeElement',
    type: 'JSXIdentifier'
  }),
  selfClosing: true,
  type: 'JSXElement'
}

export const JSXElementWithClosingElement = {
  openingElement: expect.any(Object),
  closingElement: expect.any(Object),
  attributes: [],
  children: [],
  name: expect.objectContaining({
    name: 'SomeElement',
    type: 'JSXIdentifier'
  }),
  selfClosing: false,
  type: 'JSXElement'
}

export const JSXElementWithChildren = {
  openingElement: expect.any(Object),
  closingElement: expect.any(Object),
  attributes: [],
  children: expect.arrayContaining([
    expect.objectContaining({
      openingElement: expect.any(Object),
      closingElement: null,
      attributes: [],
      children: [],
      name: expect.objectContaining({
        name: 'Child',
        type: 'JSXIdentifier'
      }),
      selfClosing: true,
      type: 'JSXElement'
    })
  ]),
  name: expect.objectContaining({
    name: 'SomeElement',
    type: 'JSXIdentifier'
  }),
  selfClosing: false,
  type: 'JSXElement'
}

export const JSXElementWithAttribute = {
  attributes: expect.arrayContaining([
    expect.objectContaining({
      name: expect.objectContaining({
        name: 'attr0',
        type: 'JSXIdentifier'
      }),
      type: 'JSXAttribute',
      value: expect.objectContaining({
        regex: null,
        type: 'Literal',
        value: '0'
      })
    })
  ]),
  children: [],
  closingElement: null,
  name: expect.objectContaining({
    name: 'SomeElement',
    type: 'JSXIdentifier'
  }),
  openingElement: expect.objectContaining({
    attributes: expect.arrayContaining([
      expect.objectContaining({
        name: expect.objectContaining({
          name: 'attr0',
          type: 'JSXIdentifier'
        }),
        value: expect.objectContaining({
          regex: null,
          type: 'Literal',
          value: '0'
        }),
        type: 'JSXAttribute'
      })
    ])
  }),
  selfClosing: true,
  type: 'JSXElement'
}
