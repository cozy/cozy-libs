import KonnectorMaintenance from 'components/Maintenance'
import { mount } from 'enzyme'
import enLocale from 'locales/en.json'
import React from 'react'

import I18n from 'cozy-ui/transpiled/react/providers/I18n'

describe('KonnectorMaintenance', () => {
  it('should match the snapshot', () => {
    const component = mount(
      <I18n lang="en" dictRequire={() => enLocale}>
        <KonnectorMaintenance
          maintenanceMessages={{
            en: {
              long_message: 'A long message',
              short_message: 'A shorter message'
            }
          }}
        />
      </I18n>,
      {
        context: { t: s => s, lang: 'en' }
      }
    )
    expect(component.html()).toMatchSnapshot()
  })
})
