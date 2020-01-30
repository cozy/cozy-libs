import React from 'react'
import { shallow } from 'enzyme'
import { DataTab } from 'components/KonnectorConfiguration/DataTab'
import LaunchTriggerCard from 'components/cards/LaunchTriggerCard'
import DocumentsLinkCard from 'components/cards/DocumentsLinkCard'

describe('DataTab', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  const setup = customProps => {
    const props = {
      konnector: {},
      trigger: {},
      error: null,
      client: {},
      shouldDisplayError: false,
      hasLoginError: false,
      ...customProps
    }
    return shallow(<DataTab {...props} />)
  }

  it('should show the launch card', () => {
    const component = setup()
    expect(component.find(LaunchTriggerCard).length).toEqual(1)
  })

  describe('links to other apps', () => {
    it('should show the link to drive when the konnector saves files', () => {
      const withoutFolder = setup({ trigger: { message: {} } })
      expect(withoutFolder.find(DocumentsLinkCard).length).toEqual(0)

      const withFolder = setup({
        trigger: { message: { folder_to_save: '123' } }
      })
      expect(withFolder.find(DocumentsLinkCard).length).toEqual(1)

      const withEmptyFolder = setup({
        trigger: { message: { folder_to_save: '' } }
      })
      expect(withEmptyFolder.find(DocumentsLinkCard).length).toEqual(0)
    })
  })
})
