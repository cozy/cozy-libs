import React from 'react'
import { mount } from 'enzyme'
import KonnectorMaintenance from 'components/Maintenance'
import { I18n } from 'cozy-ui/transpiled/react'
import enLocale from 'locales/en.json'

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
