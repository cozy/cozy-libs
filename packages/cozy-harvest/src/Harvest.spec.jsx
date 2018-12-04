import React from 'react'
import Harvest from './Harvest'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('Harvest', () => {
  it('shoul render a div', () => {
    const component = shallow(<Harvest />).getElement()
    expect(component).toMatchSnapshot()
  })
})
