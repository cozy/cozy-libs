import React from 'react'

import ObjectFieldTemplate from './ObjectFieldTemplate'

describe('ObjectFieldTemplate component', () => {
  it('should match snapshot', () => {
    const props = {
      properties: [
        {
          content: <span>Foo</span>,
          name: 'foo'
        },
        {
          content: <span>Bar</span>,
          name: 'bar'
        }
      ]
    }
    const component = shallow(
      <ObjectFieldTemplate {...props}>
        <input name="foobar" />
      </ObjectFieldTemplate>
    )
    expect(component).toMatchSnapshot()
  })
})
