/* eslint-env jest */
import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TriggerSuccessMessage } from 'components/TriggerSuccessMessage'

configure({ adapter: new Adapter() })

const t = jest.fn().mockImplementation(key => key)
const onDoneMock = jest.fn()

describe('TriggerSuccessMessage', () => {
  beforeEach(() => {
    onDoneMock.mockClear()
  })

  it('should render', () => {
    const component = shallow(
      <TriggerSuccessMessage onDone={onDoneMock} t={t} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should call this.onClick on Button click', () => {
    const wrapper = shallow(<TriggerSuccessMessage onDone={onDoneMock} t={t} />)
    wrapper.instance().onClick = jest.fn()
    wrapper.instance().forceUpdate()
    wrapper.find('DefaultButton').simulate('click')
    expect(wrapper.instance().onClick).toHaveBeenCalled()
  })

  it('should not call onDone twice', () => {
    const wrapper = shallow(<TriggerSuccessMessage onDone={onDoneMock} t={t} />)
    wrapper.find('DefaultButton').simulate('click')
    wrapper.find('DefaultButton').simulate('click')
    expect(onDoneMock).toHaveBeenCalledTimes(1)
  })

  it('should disable button after click', () => {
    const wrapper = shallow(<TriggerSuccessMessage onDone={onDoneMock} t={t} />)
    wrapper.find('DefaultButton').simulate('click')
    const component = wrapper.getElement()
    expect(component).toMatchSnapshot()
  })
})
