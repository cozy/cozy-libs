import { mockConnection } from '../../../tests'
import { WebviewService } from '../../api'

describe('WebviewService', () => {
  it('Should handle call', async () => {
    const webviewService = new WebviewService(mockConnection)
    const remote = mockConnection.remoteHandle()

    await webviewService.call('logout')

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(remote.call).toHaveBeenCalledWith('logout')
  })

  it('Should handle closeMessenger', async () => {
    const webviewService = new WebviewService(mockConnection)

    webviewService.closeMessenger()

    await webviewService.call('logout')

    expect(mockConnection.close).toHaveBeenCalled()
  })
})
