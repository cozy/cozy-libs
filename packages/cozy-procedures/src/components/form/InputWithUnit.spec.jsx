import React from 'react'

import { InputWithUnit } from './InputWithUnit'
import tMock from '../../../test/__mocks__/tMock'

describe('InputWithUnit component', () => {
  it('should match snapshot', () => {
    const onChangeSpy = jest.fn()
    const props = {
      onChange: onChangeSpy,
      options: {
        unit: '€'
      },
      t: tMock,
      schema: {
        type: 'integer'
      }
    }
    const component = shallow(<InputWithUnit {...props} />)
    expect(component).toMatchSnapshot()
  })
})
