import React from 'react'
import CozyClient, { useQuery } from 'cozy-client'
import { render, fireEvent, act } from '@testing-library/react'

import AppLike from '../../../../test/AppLike'

import bankAccount from './bank-account-fixture.json'
import EditContract from './EditContract'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

jest.mock(
  './SyncContractSwitch',
  () =>
    function SyncContractSwitch() {
      return <input type="checkbox" role="sync-contract-switch" />
    }
)

jest.mock('cozy-flags', () => name => {
  if (name == 'harvest.toggle-contract-sync') {
    return true
  } else {
    return false
  }
})

describe('EditContract', () => {
  const setup = ({ konnector } = {}) => {
    const client = new CozyClient({})
    client.save = jest.fn()
    client.destroy = jest.fn()
    useQuery.mockReturnValue({ data: {}, fetchStatus: 'loaded' })

    const mockKonnector = konnector || {
      slug: 'mock-konnector'
    }
    const root = render(
      <AppLike client={client}>
        <EditContract
          konnector={mockKonnector}
          accountId={bankAccount._id}
          TitleWrapper="div"
          FormControlsWrapper="div"
          onSuccess={() => {}}
          onClose={() => {}}
          contract={bankAccount}
        />
      </AppLike>
    )
    return { root, client }
  }

  it('should show fields of the bank account', () => {
    const { root } = setup()
    expect(root.getByPlaceholderText('Label').value).toBe(
      'Mon compte sociétaire'
    )
    expect(root.getByPlaceholderText('Bank').value).toBe(
      "Caisse d'Épargne Particuliers"
    )
  })

  it('can edit the label', () => {
    const { root, client } = setup()
    const labelInput = root.getByPlaceholderText('Label')
    fireEvent.change(labelInput, {
      target: { value: 'Mes actions sociétaire' }
    })
    const btn = root.getByText('Apply').closest('button')
    fireEvent.click(btn)
    expect(client.save).toHaveBeenCalledWith(
      expect.objectContaining({
        shortLabel: 'Mes actions sociétaire'
      })
    )
  })

  it('should show sync contract switch if the konnector policy supports it', () => {
    const { root } = setup({
      konnector: {
        slug: 'banking-konnector',
        partnership: {
          domain: 'budget-insight.com'
        }
      }
    })
    expect(root.getByRole('sync-contract-switch')).not.toBeUndefined()
  })

  it('shows confirmation deletion and allows to delete contract', async () => {
    const { root, client } = setup()
    const btn = root.getByText('Remove the account')
    fireEvent.click(btn)
    const confirmBtn = root.getByText('Confirm account deletion')
    expect(client.destroy).not.toHaveBeenCalled()
    await act(async () => {
      fireEvent.click(confirmBtn)
    })
    expect(client.destroy).toHaveBeenCalled()
  })

  it('should not show sync contract switch if the konnector policy does not support it', () => {
    const { root } = setup({ konnector: null })
    expect(root.queryByRole('sync-contract-switch')).toBe(null)
  })
})
