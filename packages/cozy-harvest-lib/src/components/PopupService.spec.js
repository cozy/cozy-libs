import util from 'util'

import { openWindow } from 'components/PopupService'

import { isMobileApp } from 'cozy-device-helper'

import PopupMock from '../helpers/windowWrapperMocks'

const mockPopup = new PopupMock()
jest.mock('../helpers/windowWrapper', () => ({
  windowOpen: jest.fn().mockImplementation(() => {
    return mockPopup
  })
}))

jest.mock('cozy-device-helper', () => ({
  isMobileApp: jest.fn()
}))

describe('PopupService', () => {
  describe('openWindow', () => {
    const handleUrlChange = jest.fn()
    const handleUrlChangeWrapper = jest.fn().mockReturnValue(handleUrlChange)
    const unregisterRealtime = jest.fn()
    const registerRealtime = jest.fn().mockReturnValue(unregisterRealtime)

    beforeEach(() => {
      mockPopup.clear()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('on Cordova', () => {
      beforeEach(() => {
        isMobileApp.mockReturnValue(true)
      })

      it('should render', async () => {
        const promise = openWindow({
          url: 'http://cozy.tools',
          title: 'SOME_TITLE',
          width: '20',
          height: '30',
          handleUrlChange: handleUrlChangeWrapper
        })

        expect(mockPopup.focus).toHaveBeenCalled()
        expect(mockPopup.addEventListener).toHaveBeenCalledWith(
          'loadstart',
          expect.anything()
        )
        expect(mockPopup.addEventListener).toHaveBeenCalledWith(
          'exit',
          expect.anything()
        )

        expect(isPending(promise)).toBeTruthy()

        mockPopup.emit('exit', { POPUP: 'data' })
        const result = await promise

        expect(result).toStrictEqual({ POPUP: 'data' })
      })

      it('should call handUrlChange', async () => {
        const promise = openWindow({
          url: 'http://cozy.tools',
          title: 'SOME_TITLE',
          width: '20',
          height: '30',
          handleUrlChange: handleUrlChangeWrapper
        })

        expect(isPending(promise)).toBeTruthy()

        mockPopup.emit('loadstart', 'HELLO')
        expect(handleUrlChangeWrapper).toHaveBeenCalled()
        expect(handleUrlChange).toHaveBeenCalledWith('HELLO')

        mockPopup.emit('exit', { POPUP: 'data' })
        const result = await promise
        expect(result).toStrictEqual({ POPUP: 'data' })
      })
    })

    describe('on web', () => {
      beforeEach(() => {
        isMobileApp.mockReturnValue(false)
      })

      it('should render', async () => {
        const promise = openWindow(
          'http://cozy.tools',
          'SOME_TITLE',
          'SOME_OPTIONS'
        )

        expect(mockPopup.focus).toHaveBeenCalled()
        expect(mockPopup.addEventListener).not.toHaveBeenCalledWith(
          'loadstart',
          expect.anything()
        )
        expect(mockPopup.addEventListener).not.toHaveBeenCalledWith(
          'exit',
          expect.anything()
        )

        expect(isPending(promise)).toBeTruthy()

        mockPopup.close()
        const result = await promise
        expect(result).toStrictEqual({ result: 'CLOSED' })
      })

      it('should accept registerRealtime parameter', async () => {
        const promise = openWindow({
          url: 'http://cozy.tools',
          title: 'SOME_TITLE',
          width: '20',
          height: '30',
          handleUrlChange: handleUrlChangeWrapper,
          registerRealtime
        })

        expect(isPending(promise)).toBeTruthy()

        expect(registerRealtime).toHaveBeenCalledTimes(1)
        expect(unregisterRealtime).not.toHaveBeenCalled()

        mockPopup.emit('loadstart', 'HELLO')
        expect(handleUrlChange).not.toHaveBeenCalled()

        mockPopup.close()
        const result = await promise
        expect(result).toStrictEqual({ result: 'CLOSED' })
        expect(unregisterRealtime).toHaveBeenCalledTimes(1)
      })
    })
  })
})

const isPending = promise => {
  return util.inspect(promise).includes('pending')
}
