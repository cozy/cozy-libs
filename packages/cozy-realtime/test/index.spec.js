import cozySocketTests from './cozySocketTests'
import subscribeTests from './subscribeTests'

describe('cozy-realtime lib: ', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })
  describe('cozySocket handling and getCozySocket: ', cozySocketTests)
  describe('subscribeWhenReady: ', subscribeTests)
})
