import { getStoreWebLinkByKonnector } from './getStoreWebLinkByKonnector'

const setup = ({ konnectorName, konnectorCategory, redirectionPath } = {}) => {
  const mockClient = {
    getStackClient: jest.fn(() => ({ uri: 'http://cozy.localhost:8080' })),
    getInstanceOptions: jest.fn(() => ({
      subdomain: 'nested',
      app: { slug: 'mespapiers' }
    }))
  }

  return getStoreWebLinkByKonnector({
    client: mockClient,
    konnectorName,
    konnectorCategory,
    redirectionPath
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
    const res = setup({ konnectorCategory: 'energy' })

    expect(res).toBe(
      'http://store.cozy.localhost:8080/#/discover?type=konnector&category=energy'
    )
  })

  it('should be correct link when redirectionPath passed with konnectorName', () => {
    const res = setup({
      konnectorName: 'impots',
      redirectionPath: '/paper/files/tax_return/harvest/impots'
    })

    expect(res).toBe(
      'http://store.cozy.localhost:8080/#/discover/impots?redirectAfterInstall=http%3A%2F%2Fmespapiers.cozy.localhost%3A8080%2F%23%2Fpaper%2Ffiles%2Ftax_return%2Fharvest%2Fimpots'
    )
  })

  it('should be correct link when redirectionPath passed with konnectorCategory', () => {
    const res = setup({
      konnectorCategory: 'energy',
      redirectionPath: '/paper/files/tax_return/harvest/'
    })

    expect(res).toBe(
      'http://store.cozy.localhost:8080/#/discover?type=konnector&category=energy&redirectAfterInstall=http%3A%2F%2Fmespapiers.cozy.localhost%3A8080%2F%23%2Fpaper%2Ffiles%2Ftax_return%2Fharvest%2F'
    )
  })
})
