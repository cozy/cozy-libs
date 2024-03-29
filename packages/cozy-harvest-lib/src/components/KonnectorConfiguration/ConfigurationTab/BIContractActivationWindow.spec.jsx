import { render, fireEvent, act, waitFor } from '@testing-library/react'
import { openOAuthWindow } from 'components/OAuthService'
import React from 'react'

import CozyClient from 'cozy-client'
import { WebviewIntentProvider } from 'cozy-intent'

import BIContractActivationWindow from './BiContractActivationWindow'
import AppLike from '../../../../test/AppLike'
import { findKonnectorPolicy } from '../../../konnector-policies'
import { CozyConfirmDialogProvider } from '../../CozyConfirmDialogProvider'

const fetchExtraOAuthUrlParams = jest.fn()
const refreshContracts = jest.fn()
jest.mock('../../../konnector-policies', () => ({
  findKonnectorPolicy: jest.fn()
}))
jest.mock('../../../helpers/oauth')
jest.mock('cozy-device-helper')
jest.mock('../../OAuthService')

findKonnectorPolicy.mockImplementation(() => ({
  fetchExtraOAuthUrlParams,
  refreshContracts
}))

const mockKonnector = { slug: 'mockkonnector' }
const mockAccount = {}

const onAccountDeleted = jest.fn()

const setup = () => {
  const client = new CozyClient({})
  const webviewService = {
    call: jest
      .fn()
      .mockResolvedValueOnce('sessioncode')
      .mockResolvedValueOnce({ type: 'dismiss' })
  }

  return render(
    <AppLike client={client}>
      <CozyConfirmDialogProvider>
        <WebviewIntentProvider webviewService={webviewService}>
          <BIContractActivationWindow
            konnector={mockKonnector}
            account={mockAccount}
            onAccountDeleted={onAccountDeleted}
          />
        </WebviewIntentProvider>
      </CozyConfirmDialogProvider>
    </AppLike>
  )
}

describe('BIContractActivationWindow', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should call OAuthService and update contract after OAuthWindow is closed', async () => {
    openOAuthWindow.mockResolvedValue({})
    fetchExtraOAuthUrlParams.mockResolvedValue({})
    const { getByRole } = setup()

    await act(async () => {
      await waitFor(() => {
        return expect(getByRole('button').getAttribute('class')).not.toContain(
          'Mui-disabled'
        )
      })
    })

    await act(async () => {
      fireEvent.click(getByRole('button'))
      await waitFor(() => {
        return expect(refreshContracts).toHaveBeenCalled()
      })
    })

    expect(fetchExtraOAuthUrlParams).toHaveBeenCalled()
    expect(refreshContracts).toHaveBeenCalledTimes(1)
    expect(openOAuthWindow).toHaveBeenCalledTimes(1)
    expect(openOAuthWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        konnector: { slug: 'mockkonnector' },
        manage: true
      })
    )
  })

  it('should show account delete dialog after BI connection removed and close harvest', async () => {
    openOAuthWindow.mockResolvedValue({
      data: { finalLocation: 'connection_deleted=true' }
    })
    fetchExtraOAuthUrlParams.mockResolvedValue({})
    const { getByRole, getByText } = setup()
    await act(async () => {
      await waitFor(() => {
        return expect(getByRole('button').getAttribute('class')).not.toContain(
          'Mui-disabled'
        )
      })
    })

    await act(async () => {
      fireEvent.click(getByRole('button'))
    })

    await act(async () => {
      await waitFor(() =>
        expect(
          getByRole('button', { name: 'Close dialog' })
        ).toBeInTheDocument()
      )
    })

    expect(
      getByText('Your request has been recorded', { exact: false })
    ).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Close dialog' }))
    })
    expect(onAccountDeleted).toHaveBeenCalled()
  })
})
