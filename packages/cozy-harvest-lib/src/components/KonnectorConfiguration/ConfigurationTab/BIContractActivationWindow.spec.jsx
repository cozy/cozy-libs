import React from 'react'
import CozyClient from 'cozy-client'
import { render, fireEvent, act, waitFor } from '@testing-library/react'

import AppLike from '../../../../test/AppLike'

const fetchExtraOAuthUrlParams = jest.fn()
const refreshContracts = jest.fn()
jest.mock('../../../konnector-policies', () => ({
  findKonnectorPolicy: jest.fn()
}))
jest.mock('../../Popup', () => {
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
jest.mock('../../../helpers/oauth')
jest.mock('cozy-realtime')
jest.mock('cozy-device-helper')
import BIContractActivationWindow from './BiContractActivationWindow'
import { findKonnectorPolicy } from '../../../konnector-policies'
import Popup from '../../Popup'
import InAppBrowser from '../../InAppBrowser'
import { isFlagshipApp } from 'cozy-device-helper'
import { prepareOAuth } from '../../../helpers/oauth'
findKonnectorPolicy.mockImplementation(() => ({
  fetchExtraOAuthUrlParams,
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
    prepareOAuth.mockImplementation(() => ({ oAuthUrl: 'https://test.url' }))
    isFlagshipApp.mockImplementation(() => false)
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
    expect(Popup).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://test.url'
      }),
      {}
    )
  })
  it('should call InAppBrowser display if in flagship app context', async () => {
    isFlagshipApp.mockImplementation(() => true)
    prepareOAuth.mockImplementation(() => ({ oAuthUrl: 'https://testiab.url' }))
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
    expect(InAppBrowser).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://testiab.url'
      }),
      expect.anything()
    )
  })
})
