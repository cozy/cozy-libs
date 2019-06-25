import React from 'react'

import tMock from '../../../test/__mocks__/tMock'
import { InputAdapter } from './InputAdapter'

describe('InputAdapter component', () => {
  it('should match snapshot', () => {
    const onChangeSpy = jest.fn()
    const props = {
      onChange: onChangeSpy,
      t: tMock
    }
    const component = shallow(<InputAdapter {...props} />)
    expect(component).toMatchSnapshot()
  })
})
