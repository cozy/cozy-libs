import { getSSL, getUrlAndHost, getAppName } from '../src/helpers'
import cozyURLs from '../src/cozy-urls'

const cozyDomain = 'cozy.tools:8080'
const cozyDomainWithSlashes = '//cozy.tools:8080'
const fullCozyUrlNoSSL = 'http://cozy.tools:8080'
const fullCozyUrlWithSSL = 'https://cozy.tools:8080'

const oldWindow = window.location

function setWindowLocationProcotol(protocol) {
  delete window.location
  window.location = {
    ...oldWindow,
    protocol
  }
}

const SECURED_PROTOCOL = 'https:'
const UNSECURED_PROTOCOL = 'http:'

describe('getSSL', () => {
  beforeAll(() => {
    global.__DEVELOPMENT__ = true
  })

  afterEach(() => {
    jest.resetAllMocks()
    window.location = oldWindow
  })

  it('should return SSL boolean correctly if ssl option provided with a domain', () => {
    expect(getSSL(cozyDomain, false)).toBe(false)
    expect(getSSL(cozyDomain, true)).toBe(true)
  })

  it('should return SSL boolean correctly if full URL provided', () => {
    expect(getSSL(fullCozyUrlWithSSL, null)).toBe(true)
    expect(getSSL(fullCozyUrlNoSSL, null)).toBe(false)
  })

  it('should return SSL boolean correctly based on window.location if no full URL and no ssl option provided', () => {
    setWindowLocationProcotol(UNSECURED_PROTOCOL)
    expect(getSSL(cozyDomain, null)).toBe(false)
    setWindowLocationProcotol(SECURED_PROTOCOL)
    expect(getSSL(cozyDomain, null)).toBe(true)
  })

  it('should handle URLs with slashes', () => {
    setWindowLocationProcotol(UNSECURED_PROTOCOL)
    expect(getSSL(cozyDomainWithSlashes, null)).toBe(false)
    setWindowLocationProcotol(SECURED_PROTOCOL)
    expect(getSSL(cozyDomainWithSlashes, null)).toBe(true)
  })

  it('should return true by default', () => {
    delete window.location
    expect(getSSL(cozyDomain, null)).toBe(true)
  })
})

describe('getUrlAndHost', () => {
  beforeAll(() => {
    global.__DEVELOPMENT__ = true
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  // the outputs are always the same here
  const expectedNoSSL = { url: fullCozyUrlNoSSL, host: cozyDomain }
  const expectedWithSSL = { url: fullCozyUrlWithSSL, host: cozyDomain }

  it('should return the full URL if ssl and domain provided', () => {
    expect(getUrlAndHost(cozyDomain, false)).toStrictEqual(expectedNoSSL)
    expect(getUrlAndHost(cozyDomain, true)).toStrictEqual(expectedWithSSL)
  })

  it('should handle domain with slashes', () => {
    expect(getUrlAndHost(cozyDomainWithSlashes, false)).toStrictEqual(
      expectedNoSSL
    )
    expect(getUrlAndHost(cozyDomainWithSlashes, true)).toStrictEqual(
      expectedWithSSL
    )
  })

  it('should handle full provided without ssl option', () => {
    expect(getUrlAndHost(fullCozyUrlNoSSL, null)).toStrictEqual(expectedNoSSL)
    expect(getUrlAndHost(fullCozyUrlWithSSL, null)).toStrictEqual(
      expectedWithSSL
    )
  })

  it('should not use SSL if no ssl option provided', () => {
    expect(getUrlAndHost(cozyDomain)).toStrictEqual(expectedNoSSL)
  })
})

describe('getProps', () => {
  beforeAll(() => {
    global.__DEVELOPMENT__ = false
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  // the outputs are always the same here
  const expectedNoSSL = { ssl: false, url: fullCozyUrlNoSSL, host: cozyDomain }
  const expectedWithSSL = {
    ssl: true,
    url: fullCozyUrlWithSSL,
    host: cozyDomain
  }

  it('should return the full URL if ssl and domain provided', () => {
    expect(cozyURLs.getProps(cozyDomain, false)).toStrictEqual(expectedNoSSL)
    expect(cozyURLs.getProps(cozyDomain, true)).toStrictEqual(expectedWithSSL)
  })

  it('should handle domain with slashes', () => {
    expect(cozyURLs.getProps(cozyDomainWithSlashes, false)).toStrictEqual(
      expectedNoSSL
    )
    expect(cozyURLs.getProps(cozyDomainWithSlashes, true)).toStrictEqual(
      expectedWithSSL
    )
  })

  it('should handle full provided without ssl option', () => {
    expect(cozyURLs.getProps(fullCozyUrlNoSSL, null)).toStrictEqual(
      expectedNoSSL
    )
    expect(cozyURLs.getProps(fullCozyUrlWithSSL, null)).toStrictEqual(
      expectedWithSSL
    )
  })

  it('should use SSL by default', () => {
    expect(cozyURLs.getProps(cozyDomain)).toStrictEqual(expectedNoSSL)
  })
})

describe('setApplicationName', () => {
  it('should set correctly the app name', () => {
    const name = 'Test-app'
    cozyURLs.setAppName(name)
    expect(getAppName()).toBe(name)
  })
})
