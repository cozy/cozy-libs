import cozySocketTests from './cozySocketTests'
import subscribeTests from './subscribeTests'
import connectWebSocketTests from './connectWebSocketTests'

describe('cozy-realtime lib: ', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })
  describe('cozySocket handling and getCozySocket: ', cozySocketTests)
  describe('subscribeWhenReady: ', subscribeTests)
  describe('connectWebSocket: ', connectWebSocketTests)
})
