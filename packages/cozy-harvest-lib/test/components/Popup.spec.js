import React from 'react'
import { shallow } from 'enzyme'

import { Popup } from 'components/Popup'

const props = {
  height: 500,
  width: 500,
  url: 'http://cozy.tools:8080'
}

const windowMock = {
  focus: jest.fn(),
  location: {}
}

describe('Popup', () => {
  beforeEach(() => {
    windowMock.location = {}
    jest.spyOn(global, 'open').mockImplementation(() => windowMock)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render', () => {
    const component = shallow(<Popup {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should open new window', () => {
    shallow(<Popup {...props} />)
    expect(global.open).toHaveBeenCalledWith(
      props.url,
      expect.anything(),
      expect.anything()
    )
    expect(windowMock.focus).toHaveBeenCalled()
  })
})
