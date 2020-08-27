import React from 'react'
import { shallow } from 'enzyme'
import I18n from 'cozy-ui/transpiled/react/I18n'

import WebsiteLinkCard from './WebsiteLinkCard'
import enLocale from '../../locales/en'

describe('WebsiteLinkCard', () => {
  it('should render', () => {
    const wrapper = shallow(
      <I18n dictRequire={() => enLocale} lang="en">
        <WebsiteLinkCard link="https://fc.assure.ameli.fr/FRCO-app/login" />
      </I18n>
    )
    const component = wrapper.shallow()
    expect(component.getElement()).toMatchSnapshot()
  })
})
