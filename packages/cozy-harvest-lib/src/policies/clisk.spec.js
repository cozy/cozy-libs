import { getLauncher, konnectorPolicy } from './clisk'

describe('getLauncher', () => {
  it('should get the current Launcher from the given window object', () => {
    const cozy = {
      ClientKonnectorLauncher: 'test-react-native'
    }
    window.cozy = cozy
    expect(getLauncher()).toEqual('test-react-native')
    delete window.cozy
  })
  it('should should return null if no launcher is available', () => {
    expect(getLauncher()).toBe(null)
  })
})

describe('isRunnable', () => {
  const cozy = {
    ClientKonnectorLauncher: 'test-react-native'
  }
  it('should return true if a launcher is available', () => {
    window.cozy = cozy
    expect(konnectorPolicy.isRunnable()).toBe(true)
    delete window.cozy
  })
  it('should should return false if a launcher is not available', () => {
    expect(konnectorPolicy.isRunnable()).toBe(false)
  })
})

describe('onLaunch', () => {
  const cozy = {
    ClientKonnectorLauncher: 'react-native'
  }
  beforeEach(() => {
    window.cozy = cozy
    window.ReactNativeWebView = {
      postMessage: jest.fn()
    }
  })
  afterEach(() => {
    delete window.cozy
    jest.clearAllMocks()
    delete window.ReactNativeWebView
  })

  it('should send konnector when launcher is react-native', () => {
    konnectorPolicy.onLaunch({
      konnector: { slug: 'testkonnectorslug' }
    })
    expect(window.ReactNativeWebView.postMessage).toHaveBeenCalledWith(
      JSON.stringify({
        message: 'startLauncher',
        value: {
          connector: { slug: 'testkonnectorslug' },
          konnector: { slug: 'testkonnectorslug' }
        }
      })
    )
  })

  it('should also send account and trigger when available when launcher is react-native', () => {
    konnectorPolicy.onLaunch({
      konnector: {
        slug: 'testkonnectorslug'
      },
      account: { _id: 'testaccountid' },
      trigger: { _id: 'testtriggerid' }
    })
    expect(window.ReactNativeWebView.postMessage).toHaveBeenCalledWith(
      JSON.stringify({
        message: 'startLauncher',
        value: {
          connector: { slug: 'testkonnectorslug' },
          konnector: { slug: 'testkonnectorslug' },
          account: { _id: 'testaccountid' },
          trigger: { _id: 'testtriggerid' }
        }
      })
    )
  })
})
