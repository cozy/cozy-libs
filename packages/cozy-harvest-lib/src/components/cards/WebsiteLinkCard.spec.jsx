import React from 'react'
import { mount } from 'enzyme'
import I18n from 'cozy-ui/transpiled/react/I18n'

import WebsiteLinkCard from './WebsiteLinkCard'
import enLocale from '../../locales/en'

describe('WebsiteLinkCard', () => {
  it('should render', () => {
    const link = 'https://fc.assure.ameli.fr/FRCO-app/login'
    const wrapper = mount(
      <I18n dictRequire={() => enLocale} lang="en">
        <WebsiteLinkCard link={link} />)
      </I18n>
    )
    const component = wrapper.find(WebsiteLinkCard)
    expect(component.find('ButtonLink').props().href).toEqual(link)
    expect(component.find('ButtonLink').props().label).toEqual(
      'fc.assure.ameli.fr'
    )
  })
})
