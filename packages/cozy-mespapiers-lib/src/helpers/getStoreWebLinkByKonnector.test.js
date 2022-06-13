import { getStoreWebLinkByKonnector } from './getStoreWebLinkByKonnector'

const setup = ({ konnectorName, konnectorCategory } = {}) => {
  const mockClient = {
    getStackClient: jest.fn(() => ({ uri: 'http://cozy.localhost:8080' })),
    getInstanceOptions: jest.fn(() => ({ subdomain: 'nested' }))
  }

  return getStoreWebLinkByKonnector({
    client: mockClient,
    konnectorName,
    konnectorCategory
  })
}

describe('getStoreWebLinkByKonnector', () => {
  it('should be "null" if no information on the konnector is passed', () => {
    const res = setup()

    expect(res).toBeNull()
  })

  it('should be correct link when konnectorName passed', () => {
    const res = setup({ konnectorName: 'caf' })

    expect(res).toBe('http://store.cozy.localhost:8080/#/discover/caf')
  })

  it('should be correct link when konnectorCategory passed', () => {
    const res = setup({ konnectorCategory: 'impots' })

    expect(res).toBe(
      'http://store.cozy.localhost:8080/#/discover?type=konnector&category=impots'
    )
  })
})
