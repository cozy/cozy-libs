import {
  getNodeCozyURL,
  getBrowserCozyURL,
  getCozyDomain,
  getProtocol,
  useSSL,
  getCozyURL
} from '../src/cozy-urls'

const cozyDomain = 'cozy.tools:8080'
const cozyDomainWithSlashes = '//cozy.tools:8080'
const fullCozyUrlNoSSL = 'http://cozy.tools:8080'
const fullCozyUrlWithSSL = 'https://cozy.tools:8080'
const prodUrl = 'https://prod.mycozy.cloud'

const SECURED_PROTOCOL = 'https:'
const UNSECURED_PROTOCOL = 'http:'

describe('cozy-urls', () => {
  it('should return browser cozy url', () => {
    document.querySelector = jest
      .fn()
      .mockImplementation(() => ({ dataset: { cozyDomain } }))
    window.location.protocol = 'http:'
    expect(getBrowserCozyURL()).toBe(fullCozyUrlNoSSL)
    document.querySelector.mockReset()
  })

  it('should return node cozy url', () => {
    process.env.COZY_URL = fullCozyUrlNoSSL
    expect(getNodeCozyURL()).toBe(fullCozyUrlNoSSL)
  })

  it('should return cozy url', () => {
    expect(getCozyURL()).toBe(fullCozyUrlNoSSL)
  })

  it('should return cozy domain', () => {
    expect(getCozyDomain()).toBe(cozyDomain)
    expect(getCozyDomain(cozyDomain)).toBe(cozyDomain)
    expect(getCozyDomain(cozyDomainWithSlashes)).toBe(cozyDomain)
    expect(getCozyDomain(fullCozyUrlNoSSL)).toBe(cozyDomain)
    expect(getCozyDomain(fullCozyUrlWithSSL)).toBe(cozyDomain)
    expect(getCozyDomain(prodUrl)).toBe('prod.mycozy.cloud')
  })

  it('should return protocol', () => {
    expect(getProtocol()).toBe(UNSECURED_PROTOCOL)
    expect(getProtocol(fullCozyUrlNoSSL)).toBe(UNSECURED_PROTOCOL)
    expect(getProtocol(fullCozyUrlWithSSL)).toBe(SECURED_PROTOCOL)
    expect(getProtocol(prodUrl)).toBe(SECURED_PROTOCOL)

    // throw error
    jest.spyOn(console, 'warn').mockReturnValue(null)
    expect(() =>
      getProtocol(cozyDomainWithSlashes)
    ).toThrowErrorMatchingSnapshot()
    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalled()
    // eslint-disable-next-line no-console
    console.warn.mockReset()
  })

  it('should return if use SSL', () => {
    expect(useSSL()).toBe(false)
    expect(useSSL(fullCozyUrlNoSSL)).toBe(false)
    expect(useSSL(fullCozyUrlWithSSL)).toBe(true)
    expect(useSSL(prodUrl)).toBe(true)

    // throw error
    jest.spyOn(console, 'warn').mockReturnValue(null)
    expect(() => useSSL(cozyDomainWithSlashes)).toThrowErrorMatchingSnapshot()
    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalled()
    // eslint-disable-next-line no-console
    console.warn.mockReset()
  })
})
