import util from 'util'

import { openWindow } from 'components/PopupService'

import PopupMock from '../helpers/windowWrapperMocks'

const mockPopup = new PopupMock()
jest.mock('../helpers/windowWrapper', () => ({
  windowOpen: jest.fn().mockImplementation(() => {
    return mockPopup
  })
}))

describe('PopupService', () => {
  describe('openWindow', () => {
    const unregisterRealtime = jest.fn()
    const registerRealtime = jest.fn().mockReturnValue(unregisterRealtime)

    beforeEach(() => {
      mockPopup.clear()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('on web', () => {
      it('should render', async () => {
        const promise = openWindow(
          'http://cozy.tools',
          'SOME_TITLE',
          'SOME_OPTIONS'
        )

        expect(mockPopup.focus).toHaveBeenCalled()

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
          registerRealtime
        })

        expect(isPending(promise)).toBeTruthy()

        expect(registerRealtime).toHaveBeenCalledTimes(1)
        expect(unregisterRealtime).not.toHaveBeenCalled()

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
