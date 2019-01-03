import {
  isSecureProtocol,
  getNodeCozyURL,
  getBrowserCozyURL,
  getCozyDomain,
  getProtocol,
  getCozyURL
} from '../src/cozy-urls'

const cozyDomain = 'cozy.tools:8080'
const fullCozyUrlNoSSL = 'http://cozy.tools:8080'
const fullCozyUrlWithSSL = 'https://cozy.tools:8080'
const prodUrl = 'https://prod.mycozy.cloud'

const SECURED_PROTOCOL = 'https:'
const UNSECURED_PROTOCOL = 'http:'

describe('cozy-urls', () => {
  it('should return browser cozy url', () => {
    expect(() => getBrowserCozyURL()).toThrowErrorMatchingSnapshot()
    document.querySelector = jest
      .fn()
      .mockImplementation(() => ({ dataset: { cozyDomain } }))
    window.location.protocol = 'http:'
    expect(getBrowserCozyURL().origin).toBe(fullCozyUrlNoSSL)
    document.querySelector.mockReset()
  })

  it('should return node cozy url', () => {
    process.env.COZY_URL = undefined
    expect(() => getNodeCozyURL()).toThrowErrorMatchingSnapshot()
    process.env.COZY_URL = fullCozyUrlNoSSL
    expect(getNodeCozyURL().origin).toBe(fullCozyUrlNoSSL)
  })

  it('should return cozy url', () => {
    expect(getCozyURL().origin).toBe(fullCozyUrlNoSSL)
  })

  it('should return cozy domain', () => {
    expect(getCozyDomain()).toBe(cozyDomain)
    expect(getCozyDomain(fullCozyUrlNoSSL)).toBe(cozyDomain)
    expect(getCozyDomain(fullCozyUrlWithSSL)).toBe(cozyDomain)
    expect(getCozyDomain(prodUrl)).toBe('prod.mycozy.cloud')

    expect(() => getCozyDomain('not-url')).toThrowErrorMatchingSnapshot()
  })

  it('should return protocol', () => {
    expect(getProtocol()).toBe(UNSECURED_PROTOCOL)
    expect(getProtocol(fullCozyUrlNoSSL)).toBe(UNSECURED_PROTOCOL)
    expect(getProtocol(fullCozyUrlWithSSL)).toBe(SECURED_PROTOCOL)
    expect(getProtocol(prodUrl)).toBe(SECURED_PROTOCOL)

    expect(() => getProtocol('not-url')).toThrowErrorMatchingSnapshot()
  })

  it('should return if secure protocol is used', () => {
    expect(isSecureProtocol()).toBe(false)
    expect(isSecureProtocol(fullCozyUrlNoSSL)).toBe(false)
    expect(isSecureProtocol(fullCozyUrlWithSSL)).toBe(true)
    expect(isSecureProtocol(prodUrl)).toBe(true)
  })
})
