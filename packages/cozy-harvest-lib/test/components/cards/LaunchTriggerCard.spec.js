import React from 'react'
import { shallow } from 'enzyme'

import LaunchTriggerCard from 'components/cards/LaunchTriggerCard'

const fixtures = {
  trigger: {
    _id: 'd861818b62204988bf0bb78c182a9149'
  }
}

const props = {
  trigger: fixtures.trigger,
  t: key => key
}

describe('LaunchTriggerCard', () => {
  it('should render', () => {
    const component = shallow(<LaunchTriggerCard {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })
})
