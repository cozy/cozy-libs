import React from 'react'
import KonnectorIcon from './KonnectorIcon'
import CozyClient, { CozyProvider } from 'cozy-client'
import { mount } from 'enzyme'

describe('KonnectorIcon', () => {
  let originalConsoleError

  beforeEach(() => {
    // eslint-disable-next-line no-console
    originalConsoleError = console.error
    // eslint-disable-next-line no-console
    console.error = jest.fn(function () {
      throw new Error('console.error should not be called during tests')
    })
  })

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = originalConsoleError
  })

  const setup = ({ konnector, konnectorSlug } = {}) => {
    const client = new CozyClient()
    const root = mount(
      <CozyProvider client={client}>
        <KonnectorIcon
          client={client}
          konnector={konnector}
          konnectorSlug={konnectorSlug}
        />
      </CozyProvider>
    )
    return { root }
  }

  it('should render correctly with konnector prop', () => {
    const { root } = setup({ konnector: { slug: 'konn-1' } })
    expect(root.find('svg').length).toBe(1)
  })

  it('should render correctly with konnectorSlug prop', () => {
    const { root } = setup({ konnectorSlug: 'konn-1' })
    expect(root.find('svg').length).toBe(1)
  })

  it('should require either konnector or konnectorSlug', () => {
    try {
      setup()
    } catch {} // eslint-disable-line no-empty
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        "Failed prop type: One of props 'konnector' or 'konnectorSlug' was not specified in 'KonnectorIcon'."
      )
    )
  })
})
