import { createMockClient } from 'cozy-client'

import konnectorBlock from './konnectorBlock'

const client = createMockClient({})
client.getStackClient = jest.fn(() => ({ uri: 'http://cozy.tools:8080' }))
client.fetchJSON = jest.fn()
client.query = jest.fn()
client.getQueryFromState = jest.fn()

const setup = async ({
  isAccountConnected = true,
  isInMaintenance = false,
  isInError = { error: null }
} = {}) => {
  jest
    .spyOn(konnectorBlock, 'isAccountConnected')
    .mockResolvedValue(isAccountConnected)
  jest
    .spyOn(konnectorBlock, 'isInMaintenance')
    .mockResolvedValue(isInMaintenance)
  jest.spyOn(konnectorBlock, 'isInError').mockResolvedValue(isInError)

  return await konnectorBlock.fetchKonnectorData({
    client,
    t: jest.fn(x => x),
    slug: 'pajemploi',
    sourceAccount: '012345'
  })
}

describe('fetchKonnectorData', () => {
  let konnector = {
    attributes: {
      name: 'Pajemploi',
      vendor_link: 'https://www.pajemploi.urssaf.fr/'
    }
  }

  beforeEach(() => {
    jest.spyOn(konnectorBlock, 'fetchKonnector').mockResolvedValue(konnector)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return appropriate response if nothing goes wrong', async () => {
    const res = await setup()

    expect(res).toMatchObject({
      name: 'Pajemploi',
      link:
        'https://links.mycozy.cloud/home/connected/pajemploi/accounts/012345?fallback=http%3A%2F%2Fcozy-home.tools%3A8080%2F%23%2Fconnected%2Fpajemploi%2Faccounts%2F012345',
      vendorLink: {
        component: 'a',
        href: 'https://www.pajemploi.urssaf.fr/',
        target: '_blank'
      },
      iconStatus: undefined,
      message: undefined
    })
  })

  it('should return appropriate response if everything goes wrong', async () => {
    const error = new Error('Not Found')
    error.status = 404
    jest.spyOn(konnectorBlock, 'fetchKonnector').mockRejectedValue(error)

    const res = await setup()
    expect(res).toMatchObject({ not404Error: 'konnectorBlock.not404Error' })
  })

  it('should return appropriate response if stack returns other error than 404', async () => {
    const error = new Error('Not Found')
    error.status = 403
    jest.spyOn(konnectorBlock, 'fetchKonnector').mockRejectedValue(error)

    const res = await setup()
    expect(res).toMatchObject({ not404Error: 'konnectorBlock.not404Error' })
  })

  it('should return appropriate response from the registry', async () => {
    const error = new Error('Not Found')
    error.status = 404
    const spy = jest.spyOn(konnectorBlock, 'fetchKonnector')
    spy.mockRejectedValueOnce(error).mockResolvedValue(konnector)

    const res = await setup()
    const firstResponseArg = spy.mock.calls[0][1]
    expect(firstResponseArg.definition.sources).toStrictEqual(['stack'])
    const secondResponseArg = spy.mock.calls[1][1]
    expect(secondResponseArg.definition.sources).toStrictEqual(['registry'])
    expect(res).toMatchObject({
      name: 'Pajemploi',
      link:
        'https://links.mycozy.cloud/store/discover/pajemploi?fallback=http%3A%2F%2Fcozy-store.tools%3A8080%2F%23%2Fdiscover%2Fpajemploi',
      vendorLink: {
        component: 'a',
        href: 'https://www.pajemploi.urssaf.fr/',
        target: '_blank'
      },
      iconStatus: 'disabled',
      message: undefined
    })
  })

  it('should return appropriate response if account is not connected', async () => {
    const res = await setup({ isAccountConnected: false })

    expect(res).toMatchObject({
      name: 'Pajemploi',
      link:
        'https://links.mycozy.cloud/home/connected/pajemploi/new?fallback=http%3A%2F%2Fcozy-home.tools%3A8080%2F%23%2Fconnected%2Fpajemploi%2Fnew',
      vendorLink: {
        component: 'a',
        href: 'https://www.pajemploi.urssaf.fr/',
        target: '_blank'
      },
      iconStatus: 'disabled',
      message: { text: 'konnectorBlock.disconnected' }
    })
  })

  it('should return appropriate response if konnector is in maintenance', async () => {
    const res = await setup({ isInMaintenance: true })

    expect(res).toMatchObject({
      name: 'Pajemploi',
      link:
        'https://links.mycozy.cloud/home/connected/pajemploi?fallback=http%3A%2F%2Fcozy-home.tools%3A8080%2F%23%2Fconnected%2Fpajemploi',
      vendorLink: {
        component: 'a',
        href: 'https://www.pajemploi.urssaf.fr/',
        target: '_blank'
      },
      iconStatus: 'disabled',
      message: { text: 'konnectorBlock.inMaintenance' }
    })
  })

  it('should return appropriate response if konnector has actionable error', async () => {
    const res = await setup({
      isInError: { error: { message: 'errorMessage', isActionable: true } }
    })

    expect(res).toMatchObject({
      name: 'Pajemploi',
      link:
        'https://links.mycozy.cloud/home/connected/pajemploi?fallback=http%3A%2F%2Fcozy-home.tools%3A8080%2F%23%2Fconnected%2Fpajemploi',
      vendorLink: {
        component: 'a',
        href: 'https://www.pajemploi.urssaf.fr/',
        target: '_blank'
      },
      iconStatus: 'disabled',
      message: { text: 'error.job.errorMessage.title', color: 'error' }
    })
  })

  it('should return appropriate response if konnector has not actionable error', async () => {
    const res = await setup({
      isInError: { error: { message: 'errorMessage', isActionable: false } }
    })

    expect(res).toMatchObject({
      name: 'Pajemploi',
      link:
        'https://links.mycozy.cloud/home/connected/pajemploi?fallback=http%3A%2F%2Fcozy-home.tools%3A8080%2F%23%2Fconnected%2Fpajemploi',
      vendorLink: {
        component: 'a',
        href: 'https://www.pajemploi.urssaf.fr/',
        target: '_blank'
      },
      iconStatus: 'disabled',
      message: { text: 'error.job.errorMessage.title', color: 'textSecondary' }
    })
  })

  it('should return appropriate response if konnector has a new version available', async () => {
    jest.spyOn(konnectorBlock, 'fetchKonnector').mockResolvedValue({
      attributes: {
        name: 'Pajemploi',
        vendor_link: 'https://www.pajemploi.urssaf.fr/'
      },
      available_version: true
    })

    const res = await setup()

    expect(res).toMatchObject({
      name: 'Pajemploi',
      link:
        'https://links.mycozy.cloud/home/connected/pajemploi?fallback=http%3A%2F%2Fcozy-home.tools%3A8080%2F%23%2Fconnected%2Fpajemploi',
      vendorLink: {
        component: 'a',
        href: 'https://www.pajemploi.urssaf.fr/',
        target: '_blank'
      },
      iconStatus: undefined,
      message: {
        color: 'primary',
        text: 'konnectorBlock.hasNewVersionAvailable'
      }
    })
  })
})
