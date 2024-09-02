import { DataTab } from 'components/KonnectorConfiguration/DataTab'
import AppLinkCard from 'components/cards/AppLinkCard'
import LaunchTriggerCard from 'components/cards/LaunchTriggerCard'
import useMaintenanceStatus from 'components/hooks/useMaintenanceStatus'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('components/hooks/useMaintenanceStatus')
jest.mock('cozy-ui/transpiled/react/providers/Breakpoints', () => () => ({
  isMobile: false
}))

describe('DataTab', () => {
  beforeEach(() => {
    // LaunchTriggerCard inside DataTab will emit propType errors because there is no I18n wrapper, but we're not interested in testing LaunchTriggerCard here.
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  const setup = (
    customProps,
    { isError = false, isInMaintenance = false } = {}
  ) => {
    useMaintenanceStatus.mockReturnValue({
      data: { isInMaintenance, message: '' }
    })

    const props = {
      konnector: {
        attributes: {}
      },
      trigger: {},
      client: {
        appMetadata: {
          slug: 'notes'
        }
      },
      flow: {
        getState: () => ({
          error: isError
            ? {
                isTermsVersionMismatchError: jest.fn(),
                isSolvableViaReconnect: jest.fn()
              }
            : null,
          running: false
        })
      },
      ...customProps
    }
    return shallow(<DataTab {...props} />)
  }

  it('should show the launch card', () => {
    const component = setup()
    expect(component.find(LaunchTriggerCard).length).toEqual(1)
  })

  describe('links to other apps', () => {
    it('should show the link to banks', () => {
      const withoutAccounts = setup({
        konnector: { data_types: ['something', 'else'], attributes: {} }
      })
      expect(withoutAccounts.find(AppLinkCard).length).toEqual(0)

      const withAccounts = setup({
        konnector: { data_types: ['bankAccounts'], attributes: {} }
      })
      expect(withAccounts.find(AppLinkCard).length).toEqual(1)
      expect(withAccounts.find(AppLinkCard).prop('slug')).toEqual('banks')

      const withAccountsAndOthers = setup({
        konnector: {
          data_types: ['bankAccounts', 'something', 'else'],
          attributes: {}
        }
      })
      expect(withAccountsAndOthers.find(AppLinkCard).length).toEqual(1)
      expect(withAccountsAndOthers.find(AppLinkCard).prop('slug')).toEqual(
        'banks'
      )
    })

    it('should show the link to contacts', () => {
      const withoutContacts = setup({
        konnector: { attributes: {}, data_types: ['something', 'else'] }
      })
      expect(withoutContacts.find(AppLinkCard).length).toEqual(0)

      const withContacts = setup({
        konnector: { attributes: {}, data_types: ['contact'] }
      })
      expect(withContacts.find(AppLinkCard).length).toEqual(1)
      expect(withContacts.find(AppLinkCard).prop('slug')).toEqual('contacts')

      const withContactsAndOthers = setup({
        konnector: {
          attributes: {},
          data_types: ['contact', 'something', 'else']
        }
      })
      expect(withContactsAndOthers.find(AppLinkCard).length).toEqual(1)
      expect(withContactsAndOthers.find(AppLinkCard).prop('slug')).toEqual(
        'contacts'
      )
    })

    it('should show all links at once', () => {
      const withEverything = setup({
        konnector: { data_types: ['contact', 'bankAccounts'], attributes: {} },
        trigger: { message: { folder_to_save: '123' } }
      })
      expect(withEverything.find(AppLinkCard).length).toEqual(2)
    })
  })
})
