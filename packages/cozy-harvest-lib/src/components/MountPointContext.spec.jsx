import React from 'react'
import { shallow } from 'enzyme'
import { RawMountPointProvider } from 'components/MountPointContext'

describe('MountPointProvider', () => {
  const historyMock = { replace: jest.fn() }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should push to the correct route', () => {
    const component = shallow(
      <RawMountPointProvider baseRoute="/root" history={historyMock} />
    )

    component.instance().replaceHistory('/one')
    expect(historyMock.replace).toHaveBeenCalledWith('/root/one')

    component.instance().replaceHistory('/one/two')
    expect(historyMock.replace).toHaveBeenCalledWith('/root/one/two')

    component.instance().replaceHistory('no/slash')
    expect(historyMock.replace).toHaveBeenCalledWith('/root/no/slash')

    component.instance().replaceHistory('too/many///slashes')
    expect(historyMock.replace).toHaveBeenCalledWith('/root/too/many/slashes')
  })

  it('should handle a trailing slash in the base route', () => {
    const component = shallow(
      <RawMountPointProvider baseRoute="/root/" history={historyMock} />
    )

    component.instance().replaceHistory('/one')
    expect(historyMock.replace).toHaveBeenCalledWith('/root/one')

    component.instance().replaceHistory('no/slash')
    expect(historyMock.replace).toHaveBeenCalledWith('/root/no/slash')
  })

  it('should handle a base route with multiple segments', () => {
    const component = shallow(
      <RawMountPointProvider baseRoute="/base/route/" history={historyMock} />
    )

    component.instance().replaceHistory('/one')
    expect(historyMock.replace).toHaveBeenCalledWith('/base/route/one')

    component.instance().replaceHistory('/one/two')
    expect(historyMock.replace).toHaveBeenCalledWith('/base/route/one/two')
  })
})
