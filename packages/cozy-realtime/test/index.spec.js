import cozySocketTests from './cozySocketTests'

describe('cozy-realtime lib: ', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })
  describe('cozySocket handling and getCozySocket: ', cozySocketTests)
})
