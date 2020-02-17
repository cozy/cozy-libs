import React from 'react'
import { shallow } from 'enzyme'

import I18n from 'cozy-ui/transpiled/react/I18n'
import LaunchTriggerCard from 'components/cards/LaunchTriggerCard'

const fixtures = {
  trigger: {
    _id: 'd861818b62204988bf0bb78c182a9149'
  }
}

const props = {
  trigger: fixtures.trigger
}

describe('LaunchTriggerCard', () => {
  it('should render', () => {
    const component = shallow(
      <I18n dictRequire={() => {}} lang="en">
        <LaunchTriggerCard {...props} />
      </I18n>
    )
      .dive()
      .dive()
      .getElement()
    expect(component).toMatchSnapshot()
  })
})
