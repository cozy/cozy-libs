import { getLauncher, konnectorPolicy } from './clisk'
import { KonnectorJobError } from '../helpers/konnectors'

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

  it('should send konnector slug when launcher is react-native', async () => {
    await Promise.all([
      konnectorPolicy.onLaunch({
        konnector: { slug: 'testkonnectorslug' }
      }),
      new Promise(resolve => {
        setImmediate(() => {
          window.postMessage(
            JSON.stringify({
              type: 'Clisk',
              message: 'launchResult'
            }),
            '*'
          )
          resolve()
        })
      })
    ])
    expect(window.ReactNativeWebView.postMessage).toHaveBeenCalledWith(
      JSON.stringify({
        message: 'startLauncher',
        value: {
          connector: { slug: 'testkonnectorslug' },
          konnector: { slug: 'testkonnectorslug' },
          DEBUG: false
        }
      })
    )
  })

  it('should also send account and trigger when available when launcher is react-native', async () => {
    await Promise.all([
      konnectorPolicy.onLaunch({
        konnector: { slug: 'testkonnectorslug' },
        account: { _id: 'testaccountid' },
        trigger: { _id: 'testtriggerid' }
      }),
      new Promise(resolve => {
        setImmediate(() => {
          window.postMessage(
            JSON.stringify({
              type: 'Clisk',
              message: 'launchResult'
            }),
            '*'
          )
          resolve()
        })
      })
    ])
    expect(window.ReactNativeWebView.postMessage).toHaveBeenCalledWith(
      JSON.stringify({
        message: 'startLauncher',
        value: {
          connector: { slug: 'testkonnectorslug' },
          konnector: { slug: 'testkonnectorslug' },
          account: { _id: 'testaccountid' },
          trigger: { _id: 'testtriggerid' },
          DEBUG: false
        }
      })
    )
  })
  it('should return any error message sent from the launcher', async () => {
    const flow = {
      triggerEvent: jest.fn()
    }
    await Promise.all([
      konnectorPolicy.onLaunch({
        konnector: { slug: 'testkonnectorslug' },
        flow
      }),
      new Promise(resolve => {
        setImmediate(() => {
          window.postMessage(
            JSON.stringify({
              type: 'Clisk',
              message: 'launchResult',
              param: { errorMessage: 'test error message' }
            }),
            '*'
          )
          resolve()
        })
      })
    ])
    expect(flow.triggerEvent).toHaveBeenCalledWith(
      'error',
      new KonnectorJobError('test error message')
    )
  })
})
