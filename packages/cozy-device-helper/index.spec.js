import {
  isWebApp,
  isMobileApp,
  isIOSApp,
  isAndroidApp,
  getPlatform
} from '.'

describe('platforms', () => {
  it('should identify is a web application', () => {
    expect(isWebApp()).toBeTruthy()
  })
  it('should identify is a mobile application', () => {
    window.cordova = true
    expect(isMobileApp()).toBeTruthy()
    window.cordova = undefined
    expect(isMobileApp()).toBeFalsy()
  })
  it('should identify is an iOS or Android application', () => {
    window.cordova = { platformId: 'ios' }
    expect(isIOSApp()).toBeTruthy()
    expect(isAndroidApp()).toBeFalsy()
    window.cordova = { platformId: 'android' }
    expect(isIOSApp()).toBeFalsy()
    expect(isAndroidApp()).toBeTruthy()
  })
  it('should return platform', () => {
    window.cordova = undefined
    expect(getPlatform()).toEqual('web')
    window.cordova = { platformId: 'ios' }
    expect(getPlatform()).toEqual('ios')
    window.cordova = { platformId: 'android' }
    expect(getPlatform()).toEqual('android')
  })
})
