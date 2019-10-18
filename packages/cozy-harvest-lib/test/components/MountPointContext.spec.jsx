import React from 'react'
import { shallow } from 'enzyme'
import { RawMountPointProvider } from 'components/MountPointContext'

describe('MountPointProvider', () => {
  const historyMock = { push: jest.fn() }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should push to the correct route', () => {
    const component = shallow(
      <RawMountPointProvider baseRoute="/root" history={historyMock} />
    )

    component.instance().pushHistory('/one')
    expect(historyMock.push).toHaveBeenCalledWith('/root/one')

    component.instance().pushHistory('/one/two')
    expect(historyMock.push).toHaveBeenCalledWith('/root/one/two')

    component.instance().pushHistory('no/slash')
    expect(historyMock.push).toHaveBeenCalledWith('/root/no/slash')

    component.instance().pushHistory('too/many///slashes')
    expect(historyMock.push).toHaveBeenCalledWith('/root/too/many/slashes')
  })

  it('should handle a trailing slash in the base route', () => {
    const component = shallow(
      <RawMountPointProvider baseRoute="/root/" history={historyMock} />
    )

    component.instance().pushHistory('/one')
    expect(historyMock.push).toHaveBeenCalledWith('/root/one')

    component.instance().pushHistory('no/slash')
    expect(historyMock.push).toHaveBeenCalledWith('/root/no/slash')
  })

  it('should handle a base route with multiple segments', () => {
    const component = shallow(
      <RawMountPointProvider baseRoute="/base/route/" history={historyMock} />
    )

    component.instance().pushHistory('/one')
    expect(historyMock.push).toHaveBeenCalledWith('/base/route/one')

    component.instance().pushHistory('/one/two')
    expect(historyMock.push).toHaveBeenCalledWith('/base/route/one/two')
  })
})
