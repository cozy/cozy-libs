const j = require('jscodeshift')

const {
  before,
  after,
  JSXElementWithoutClosingElement,
  JSXElementWithClosingElement,
  JSXElementWithChildren,
  JSXElementWithAttribute
} = require('./__mocks__/imports')
const { simplify, makeJSXElement, makeAttribute } = require('./imports')
require('@testing-library/jest-dom')

describe('transform imports', () => {
  describe('simplify', () => {
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

  describe('makeJSXElement', () => {
    const child = makeJSXElement({ name: 'Child' })
    const mockAttr = makeAttribute({ name: 'attr0', value: '0' })

    it.each`
      attrs                                                     | result
      ${{ name: 'SomeElement' }}                                | ${JSXElementWithoutClosingElement}
      ${{ name: 'SomeElement', children: [] }}                  | ${JSXElementWithoutClosingElement}
      ${{ name: 'SomeElement', autoClose: true }}               | ${JSXElementWithoutClosingElement}
      ${{ name: 'SomeElement', children: [], autoClose: true }} | ${JSXElementWithoutClosingElement}
    `(
      `should make a JSX element that close automatically when passed argument: $attrs`,
      ({ attrs, result }) => {
        expect(makeJSXElement(attrs)).toEqual(expect.objectContaining(result))
      }
    )

    it.each`
      attrs                                                           | result
      ${{ name: 'SomeElement', autoClose: false }}                    | ${JSXElementWithClosingElement}
      ${{ name: 'SomeElement', children: [child] }}                   | ${JSXElementWithChildren}
      ${{ name: 'SomeElement', children: [child], autoClose: true }}  | ${JSXElementWithChildren}
      ${{ name: 'SomeElement', children: [child], autoClose: false }} | ${JSXElementWithChildren}
    `(
      `should make a JSX element that does not close automatically when passed argument: $attrs`,
      ({ attrs, result }) => {
        expect(makeJSXElement(attrs)).toEqual(expect.objectContaining(result))
      }
    )

    it('should make a JSX element with attributes when passed "attributes" argument', () => {
      const attrs = { name: 'SomeElement', attributes: [mockAttr] }

      expect(makeJSXElement(attrs)).toEqual(
        expect.objectContaining(JSXElementWithAttribute)
      )
    })
  })
})
