import React from 'react'

import { FieldTemplate } from './FieldTemplate'
import tMock from '../../../test/__mocks__/tMock'

describe('FieldTemplate component', () => {
  it('should match snapshot', () => {
    const props = {
      id: '123',
      label: 'My field',
      t: tMock
    }
    const component = shallow(
      <FieldTemplate {...props}>
        <input name="foobar" />
      </FieldTemplate>
    )
    expect(component).toMatchSnapshot()
  })
})
