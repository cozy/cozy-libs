import React from 'react'
import { CozyProvider } from 'cozy-client'
import { render, fireEvent } from '@testing-library/react'

import I18n from 'cozy-ui/transpiled/react/I18n'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import en from 'locales/en.json'

import bankAccount from './bank-account-fixture.json'
import EditContract from './EditContract'

describe('EditContract', () => {
  const setup = () => {
    const client = {
      save: jest.fn()
    }
    const root = render(
      <CozyProvider client={client}>
        <I18n lang="en" dictRequire={() => en}>
          <BreakpointsProvider>
            <EditContract
              account={bankAccount}
              TitleWrapper="div"
              FormControlsWrapper="div"
              onSuccess={() => {}}
              onCancel={() => {}}
              contract={bankAccount}
            />
          </BreakpointsProvider>
        </I18n>
      </CozyProvider>
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
})
