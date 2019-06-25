import React from 'react'

import tMock from '../../../test/__mocks__/tMock'
import { InputWithUnit } from './InputWithUnit'

describe('InputWithUnit component', () => {
  it('should match snapshot', () => {
    const onChangeSpy = jest.fn()
    const props = {
      onChange: onChangeSpy,
      options: {
        unit: '€'
      },
      t: tMock
    }
    const component = shallow(<InputWithUnit {...props} />)
    expect(component).toMatchSnapshot()
  })
})
