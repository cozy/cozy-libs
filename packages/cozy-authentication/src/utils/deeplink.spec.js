import deeplink from './deeplink'
describe('deeplink', () => {
  const appInfo = {
    protocol: 'cozyfake://',
    universalLinkDomain: 'https://ul.mycozy.cloud',
    appSlug: 'fake'
  }

  it('should generate route from an universal link correctly', () => {
    const url = 'https://ul.mycozy.cloud/fake'
    const path = deeplink.generateRoute(url, appInfo)
    expect(path).toEqual('')
  })

  it('should generate route from an universal link correctly even with fallback', () => {
    const url =
      'https://ul.mycozy.cloud/fake?fallback=https://fake.mycozy.cloud/fake'
    const path = deeplink.generateRoute(url, appInfo)
    expect(path).toEqual('')
  })

  it('should generate a real path from an universal link correctly even with fallback', () => {
    const url =
      'https://ul.mycozy.cloud/fake/file/1?fallback=https://fake.mycozy.cloud/fake/file/1'
    const path = deeplink.generateRoute(url, appInfo)
    expect(path).toEqual('file/1')
  })

  it('should works has expected with custom scheme also', () => {
    const url = 'cozyfake://file/1'
    const path = deeplink.generateRoute(url, appInfo)
    expect(path).toEqual('file/1')
  })
})
