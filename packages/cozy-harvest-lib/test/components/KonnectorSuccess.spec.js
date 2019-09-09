import React from 'react'
import { mount } from 'enzyme'

import CozyClient, { CozyProvider } from 'cozy-client'
import KonnectorSuccess, {
  BanksLink,
  DriveLink
} from 'components/KonnectorSuccess'

describe('KonnectorSuccess', () => {
  let root

  const setup = ({ isBankingKonnector, folder_to_save } = {}) => {
    const client = new CozyClient({})
    const konnector = isBankingKonnector
      ? {
          name: 'test-konnector',
          vendor_link: 'test konnector link',
          data_types: ['bankAccounts']
        }
      : {
          name: 'test-konnector',
          vendor_link: 'test konnector link'
        }
    const message = folder_to_save ? { folder_to_save: '/path' } : {}
    root = mount(
      <CozyProvider client={client}>
        <KonnectorSuccess
          accounts={[
            {
              account: { _id: 'account-1' },
              trigger: {
                _id: 'trigger-1',
                message: message
              }
            },
            {
              account: { _id: 'account-2' },
              trigger: { _id: 'trigger-2' }
            }
          ]}
          konnector={konnector}
          accountId="account-1"
          title="Fake title"
          successButtonLabel="Fake label"
          error={null}
          onDone={() => {}}
        />
      </CozyProvider>
    )
  }

  it('should not show drive if trigger has no folder_to_save', () => {
    setup()
    expect(root.find(DriveLink).length).toBe(0)
  })

  it('should show drive if trigger has a folder_to_save', () => {
    setup({ folder_to_save: 'jjj' })
    expect(root.find(DriveLink).length).toBe(1)
  })

  it('should show banks if connector has datatypes with bankAccounts', () => {
    setup({ isBankingKonnector: true })
    expect(root.find(DriveLink).length).toBe(0)
    expect(root.find(BanksLink).length).toBe(1)
  })
})
