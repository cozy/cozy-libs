import React from 'react'
import { render, waitFor } from '@testing-library/react'
import InAppBrowser from './InAppBrowser'
import { WebviewIntentProvider } from 'cozy-intent'

describe('InAppBrowser', () => {
  it('should call fetchSessionCode and showInAppBrowser', async () => {
    const url = 'https://test.url'
    const intentCall = jest.fn()
    const webviewService = {
      call: intentCall
    }
    intentCall
      .mockResolvedValueOnce('sessioncode')
      .mockResolvedValueOnce({ type: 'dismiss' })
    render(
      <WebviewIntentProvider webviewService={webviewService}>
        <InAppBrowser url={url} />
      </WebviewIntentProvider>
    )

    await waitFor(() => expect(webviewService.call).toHaveBeenCalled())

    expect(webviewService.call).toHaveBeenNthCalledWith(1, 'fetchSessionCode')
    expect(webviewService.call).toHaveBeenNthCalledWith(2, 'showInAppBrowser', {
      url: url + '/?session_code=sessioncode'
    })
  })
  it('should call onClose when user closes the inAppBrowser in app', async () => {
    const url = 'https://test.url'
    const intentCall = jest.fn()
    const webviewService = {
      call: intentCall
    }
    const onClose = jest.fn()

    intentCall.mockResolvedValue({ type: 'cancel' })
    render(
      <WebviewIntentProvider webviewService={webviewService}>
        <InAppBrowser url={url} onClose={onClose} />
      </WebviewIntentProvider>
    )

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
    expect(onClose).toHaveBeenCalledWith()
  })
  it('should call closeInAppBrowser when the component is unmounted', async () => {
    const url = 'https://test.url'
    const intentCall = jest.fn()
    const webviewService = {
      call: intentCall
    }
    intentCall.mockResolvedValue({ type: 'dismiss' })
    const { unmount } = render(
      <WebviewIntentProvider webviewService={webviewService}>
        <InAppBrowser url={url} />
      </WebviewIntentProvider>
    )

    unmount()
    expect(webviewService.call).toHaveBeenNthCalledWith(2, 'closeInAppBrowser')
  })
})
