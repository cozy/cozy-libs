import React from 'react'
import CozyClient from 'cozy-client'
import { render, fireEvent, act, waitFor } from '@testing-library/react'

import AppLike from '../../../../test/AppLike'

import BIContractActivationWindow from './BiContractActivationWindow'
const fetchContractSynchronizationUrl = jest.fn()
const refreshContracts = jest.fn()
jest.mock('../../../konnector-policies', () => ({
  findKonnectorPolicy: jest.fn()
}))
jest.mock('cozy-ui/transpiled/react/Popup', () => {
  return jest.fn().mockImplementation(({ onClose }) => {
    setTimeout(onClose, 1)
    return null
  })
})
import { findKonnectorPolicy } from '../../../konnector-policies'
import Popup from 'cozy-ui/transpiled/react/Popup'
findKonnectorPolicy.mockImplementation(() => ({
  fetchContractSynchronizationUrl,
  refreshContracts
}))

describe('BIContractActivationWindow', () => {
  const mockKonnector = { slug: 'mockkonnector' }
  const mockAccount = {}
  const setup = () => {
    const client = new CozyClient({})
    const root = render(
      <AppLike client={client}>
        <BIContractActivationWindow
          konnector={mockKonnector}
          account={mockAccount}
        />
      </AppLike>
    )
    return { root }
  }

  it('should display popup with url from policy and update contract after popup is closed', async () => {
    fetchContractSynchronizationUrl.mockResolvedValue('bi url')
    let root
    await act(async () => {
      const res = setup()
      root = res.root
      const button = root.getByRole('button')
      await waitFor(() => {
        expect(button.getAttribute('class')).not.toContain('Mui-disabled')
      })
    })

    await act(async () => {
      const button = root.getByRole('button')
      fireEvent.click(button)
      await waitFor(() => {
        expect(refreshContracts).toHaveBeenCalled()
      })
    })

    await expect(fetchContractSynchronizationUrl).toHaveBeenCalled()
    await expect(Popup).toHaveBeenCalledWith(
      expect.objectContaining({
        initialUrl: 'bi url'
      }),
      expect.anything()
    )
  })
})
