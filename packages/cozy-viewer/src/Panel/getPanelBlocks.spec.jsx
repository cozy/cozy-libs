import React from 'react'

import getPanelBlocks, { getPanelBlocksSpecs } from './getPanelBlocks'

jest.mock('./Sharing', () => () => <div data-testid="SharingBlock" />)

jest.mock('cozy-harvest-lib/dist/components/KonnectorBlock', () => jest.fn())
const block1Component = jest.fn()
const block2Component = jest.fn()

describe('getPanelBlocks', () => {
  it('should return only blocks with truthy condition', () => {
    // with two truthy component
    expect(
      getPanelBlocks({
        panelBlocksSpecs: {
          block1: {
            condition: () => true,
            component: block1Component
          },
          block2: {
            condition: () => true,
            component: block2Component
          }
        }
      })
    ).toMatchObject([block1Component, block2Component])

    // with one truthy component
    expect(
      getPanelBlocks({
        panelBlocksSpecs: {
          block1: {
            condition: () => false,
            component: block1Component
          },
          block2: {
            condition: () => true,
            component: block2Component
          }
        }
      })
    ).toMatchObject([block2Component])

    // with no truthy component
    expect(
      getPanelBlocks({
        panelBlocksSpecs: {
          block1: {
            condition: () => false,
            component: block1Component
          },
          block2: {
            condition: () => false,
            component: block2Component
          }
        }
      })
    ).toMatchObject([])

    // with no specs
    expect(getPanelBlocks({ panelBlocksSpecs: {} })).toMatchObject([])
  })
})

describe('getPanelBlocksSpecs', () => {
  it('should return the specs of the blocks to display in the panel', () => {
    expect(getPanelBlocksSpecs()).toEqual({
      qualifications: {
        condition: expect.any(Function),
        component: expect.anything()
      },
      summary: {
        condition: expect.any(Function),
        component: expect.anything()
      },
      konnector: {
        condition: expect.any(Function),
        component: expect.anything()
      },
      informations: {
        condition: expect.any(Function),
        component: expect.anything()
      },
      sharing: {
        condition: expect.any(Function),
        component: expect.anything()
      }
    })
  })
})
