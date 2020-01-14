import React from 'react'
import { mount } from 'enzyme'
import KonnectorMaintenance from 'components/Maintenance'
import { I18n } from 'cozy-ui/transpiled/react'

describe('KonnectorMaintenance', () => {
  it('should match the snapshot', () => {
    const component = mount(
      <I18n lang="en" dictRequire={() => {}}>
        <KonnectorMaintenance
          maintenanceMessages={{
            en: {
              long_message: 'long_message',
              short_message: 'short_message'
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
