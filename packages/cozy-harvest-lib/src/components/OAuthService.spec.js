import util from 'util'

import { openOAuthWindow, OAUTH_SERVICE_OK } from 'components/OAuthService'
import MicroEE from 'microee'

import { isFlagshipApp } from 'cozy-device-helper'

import { OAUTH_REALTIME_CHANNEL, terminateOAuth } from '../helpers/oauth'
import PopupMock from '../helpers/windowWrapperMocks'

jest.mock('../helpers/oauth', () => {
  return {
    ...jest.requireActual('../helpers/oauth'),
    terminateOAuth: jest.fn()
  }
})

const mockPopup = new PopupMock()
jest.mock('../helpers/windowWrapper', () => ({
  windowOpen: jest.fn().mockImplementation(() => {
    return mockPopup
  })
}))
jest.mock('uuid/v4', () => {
  return () => 'someuuid'
})

function CozyRealtimeMock() {
  this.subscribe = jest
    .fn()
    .mockImplementation((eventType, doctype, channel, fn) => {
      this.on(eventType + doctype + channel, fn)
    })
  this.unsubscribe = jest.fn().mockImplementation(() => {
    this.removeAllListeners()
  })

  this.emitRealtimeEvent = (eventType, doctype, channel, event) => {
    this.emit(eventType + doctype + channel, event)
  }

  this.clear = () => {
    this.removeAllListeners()
    this.subscribe.mockClear()
    this.unsubscribe.mockClear()
  }
}
MicroEE.mixin(CozyRealtimeMock)

const mockCozyRealtime = new CozyRealtimeMock()

const client = {
  stackClient: {
    uri: 'https://claud.mycozy.cloud'
  },
  appMetadata: { slug: 'home' },
  plugins: {
    realtime: mockCozyRealtime
  }
}

jest.mock('cozy-device-helper', () => ({
  isFlagshipApp: jest.fn()
}))

describe('OAuthService', () => {
  describe('openOAuthWindow', () => {
    beforeEach(() => {
      mockPopup.clear()
      mockCozyRealtime.clear()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('on Flagship app', () => {
      beforeEach(() => {
        isFlagshipApp.mockReturnValue(true)
      })

      it('should render', async () => {
        const webviewIntent = {
          call: jest.fn().mockImplementation(fnName => {
            if (fnName === 'fetchSessionCode') {
              return Promise.resolve('somesessioncode')
            } else if (fnName === 'showInAppBrowser') {
              return Promise.resolve({ result: 'dismiss' })
            } else if (fnName === 'closeInAppBrowser') {
              return Promise.resolve()
            }
          })
        }
        const promise = openOAuthWindow({
          client,
          konnector: { slug: 'ameli' },
          redirectSlug: 'home',
          extraParams: { extraParam1: 'extraParamValue' },
          title: 'popup title',
          account: { _id: 'someaccountid' },
          webviewIntent
        })

        expect(isPending(promise)).toBe(true)
        expect(terminateOAuth).not.toHaveBeenCalled()

        mockCozyRealtime.emitRealtimeEvent(
          'notified',
          'io.cozy.accounts',
          OAUTH_REALTIME_CHANNEL,
          {
            _id: 'oauth-popup',
            data: {
              error: null,
              finalLocation: 'connection_id=194&state=someuuid',
              key: null,
              oAuthStateKey: 'someuuid'
            }
          }
        )
        const result = await promise
        expect(result).toStrictEqual({
          result: OAUTH_SERVICE_OK,
          key: null,
          data: {
            error: null,
            finalLocation: 'connection_id=194&state=someuuid',
            key: null,
            oAuthStateKey: 'someuuid'
          }
        })

        expect(terminateOAuth).toHaveBeenCalled()
      })
    })

    describe('on web', () => {
      beforeEach(() => {
        isFlagshipApp.mockReturnValue(false)
      })

      it('should render', async () => {
        const promise = openOAuthWindow({
          client,
          konnector: { slug: 'ameli' },
          redirectSlug: 'home',
          extraParams: { extraParam1: 'extraParamValue' },
          title: 'popup title',
          account: { _id: 'someaccountid' }
        })

        expect(isPending(promise)).toBe(true)
        expect(terminateOAuth).not.toHaveBeenCalled()

        mockCozyRealtime.emitRealtimeEvent(
          'notified',
          'io.cozy.accounts',
          OAUTH_REALTIME_CHANNEL,
          {
            _id: 'oauth-popup',
            data: {
              error: null,
              finalLocation: 'connection_id=194&state=someuuid',
              key: null,
              oAuthStateKey: 'someuuid'
            }
          }
        )
        const result = await promise
        expect(result).toStrictEqual({
          result: OAUTH_SERVICE_OK,
          key: null,
          data: {
            error: null,
            finalLocation: 'connection_id=194&state=someuuid',
            key: null,
            oAuthStateKey: 'someuuid'
          }
        })

        expect(terminateOAuth).toHaveBeenCalled()
      })
    })
  })
})

const isPending = promise => {
  return util.inspect(promise).includes('pending')
}
