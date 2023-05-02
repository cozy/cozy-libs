import { historyAction } from './withRouter'

describe('historyAction', () => {
  const historyMock = { replace: jest.fn(), push: jest.fn() }

  const setup = ({ baseRoute, route, method = 'replace' } = {}) => {
    historyAction({ baseRoute }, historyMock)(route, method)
  }
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should push the correct route', () => {
    setup({ baseRoute: '/root', route: '/one' })
    expect(historyMock.replace).toHaveBeenCalledWith('/root/one')
    historyMock.replace.mockReset()

    setup({ baseRoute: '/root', route: '/one/two' })
    expect(historyMock.replace).toHaveBeenCalledWith('/root/one/two')
    historyMock.replace.mockReset()

    setup({ baseRoute: '/root', route: 'no/slash' })
    expect(historyMock.replace).toHaveBeenCalledWith('/root/no/slash')
    historyMock.replace.mockReset()

    setup({ baseRoute: '/root', route: 'too/many///slashes' })
    expect(historyMock.replace).toHaveBeenCalledWith('/root/too/many/slashes')
    historyMock.replace.mockReset()
  })

  it('should handle a trailing slash in the base route', () => {
    setup({ baseRoute: '/root/', route: '/one' })
    expect(historyMock.replace).toHaveBeenCalledWith('/root/one')
    historyMock.replace.mockReset()

    setup({ baseRoute: '/root/', route: 'no/slash' })
    expect(historyMock.replace).toHaveBeenCalledWith('/root/no/slash')
    historyMock.replace.mockReset()
  })

  it('should handle a base route with multiple segments', () => {
    setup({ baseRoute: '/base/route/', route: '/one' })
    expect(historyMock.replace).toHaveBeenCalledWith('/base/route/one')
    historyMock.replace.mockReset()

    setup({ baseRoute: '/base/route/', route: '/one/two' })
    expect(historyMock.replace).toHaveBeenCalledWith('/base/route/one/two')
    historyMock.replace.mockReset()
  })

  it('should handle even if no base route', () => {
    setup({ baseRoute: undefined, route: '/one' })
    expect(historyMock.replace).toHaveBeenCalledWith('/one')
    historyMock.replace.mockReset()
  })
})
