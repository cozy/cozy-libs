import {
  isWebApp,
  isMobileApp,
  isIosApp,
  isAndroidApp,
  getDeviceName
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
    expect(isIosApp()).toBeTruthy()
    expect(isAndroidApp()).toBeFalsy()
    window.cordova = { platformId: 'android' }
    expect(isIosApp()).toBeFalsy()
    expect(isAndroidApp()).toBeTruthy()
  })
})
