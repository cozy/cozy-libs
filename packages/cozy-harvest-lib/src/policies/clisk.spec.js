import { getLauncher, konnectorPolicy } from './clisk'

describe('getLauncher', () => {
  it('should get the current Launcher from the given window object', () => {
    const cozy = {
      ClientConnectorLauncher: 'test-react-native'
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
    ClientConnectorLauncher: 'test-react-native'
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
