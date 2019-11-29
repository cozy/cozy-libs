import React from 'react'
import { mount } from 'enzyme'
import KonnectorMaintenance from 'components/Maintenance'

describe('KonnectorMaintenance', () => {
  it('should match the snapshot', () => {
    const component = mount(
      <KonnectorMaintenance
        maintenanceMessages={{
          en: {
            long_message: 'long_message',
            short_message: 'short_message'
          }
        }}
      />,
      {
        context: { t: s => s, lang: 'en' }
      }
    )
    expect(component.html()).toMatchSnapshot()
  })
})
