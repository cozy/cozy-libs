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
jest.mock('../../InAppBrowser', () => {
  return jest.fn().mockImplementation(({ onClose }) => {
    setTimeout(onClose, 1)
    return null
  })
})

jest.mock('cozy-device-helper')
import { findKonnectorPolicy } from '../../../konnector-policies'
import Popup from 'cozy-ui/transpiled/react/Popup'
import InAppBrowser from '../../InAppBrowser'
import { isFlagshipApp } from 'cozy-device-helper'
findKonnectorPolicy.mockImplementation(() => ({
  fetchContractSynchronizationUrl,
  refreshContracts
}))

const mockKonnector = { slug: 'mockkonnector' }
const mockAccount = {}

const setup = () => {
  const client = new CozyClient({})
  return render(
    <AppLike client={client}>
      <BIContractActivationWindow
        konnector={mockKonnector}
        account={mockAccount}
      />
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

  it('should display popup with url from policy and update contract after popup is closed', async () => {
    isFlagshipApp.mockImplementation(() => false)
    fetchContractSynchronizationUrl.mockResolvedValue('bi url')
    const { getByRole } = setup()
    await act(async () => {
      await waitFor(() => {
        expect(getByRole('button').getAttribute('class')).not.toContain(
          'Mui-disabled'
        )
      })
    })

    await act(async () => {
      fireEvent.click(getByRole('button'))
      await waitFor(() => {
        expect(refreshContracts).toHaveBeenCalled()
      })
    })

    expect(fetchContractSynchronizationUrl).toHaveBeenCalled()
    expect(refreshContracts).toHaveBeenCalledTimes(1)
    expect(Popup).toHaveBeenCalledWith(
      expect.objectContaining({
        initialUrl: 'bi url'
      }),
      expect.anything()
    )
  })
  it('should call InAppBrowser display if in flagship app context', async () => {
    isFlagshipApp.mockImplementation(() => true)
    fetchContractSynchronizationUrl.mockResolvedValue('bi url')
    const { getByRole } = setup()
    await act(async () => {
      await waitFor(() => {
        expect(getByRole('button').getAttribute('class')).not.toContain(
          'Mui-disabled'
        )
      })
    })

    await act(async () => {
      fireEvent.click(getByRole('button'))
      await waitFor(() => {
        expect(refreshContracts).toHaveBeenCalled()
      })
    })

    expect(fetchContractSynchronizationUrl).toHaveBeenCalled()
    expect(refreshContracts).toHaveBeenCalledTimes(1)
    expect(InAppBrowser).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'bi url'
      }),
      expect.anything()
    )
  })
})
