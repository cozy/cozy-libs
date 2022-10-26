import React from 'react'
import CozyClient from 'cozy-client'
import { render, fireEvent, act, waitFor } from '@testing-library/react'

import AppLike from '../../../../test/AppLike'

const fetchExtraOAuthUrlParams = jest.fn()
const refreshContracts = jest.fn()
jest.mock('../../../konnector-policies', () => ({
  findKonnectorPolicy: jest.fn()
}))
jest.mock('../../Popup', () => jest.fn())
jest.mock('../../InAppBrowser', () => {
  return jest.fn().mockImplementation(({ onClose }) => {
    setTimeout(onClose, 1)
    return null
  })
})
jest.mock('../../../helpers/oauth')
jest.mock('cozy-device-helper')
import BIContractActivationWindow from './BiContractActivationWindow'
import { findKonnectorPolicy } from '../../../konnector-policies'
import Popup from '../../Popup'
import InAppBrowser from '../../InAppBrowser'
import { isFlagshipApp } from 'cozy-device-helper'
import { prepareOAuth, checkOAuthData } from '../../../helpers/oauth'
import CozyRealtime from 'cozy-realtime'
findKonnectorPolicy.mockImplementation(() => ({
  fetchExtraOAuthUrlParams,
  refreshContracts
}))
jest.mock('cozy-realtime', () => {
  const result = function Realtime() {}
  result.prototype.subscribe = jest.fn()
  result.prototype.unsubscribeAll = jest.fn()
  return result
})

const mockKonnector = { slug: 'mockkonnector' }
const mockAccount = {}

let sendMessageFn = null
CozyRealtime.prototype.subscribe = (notified, doctype, channel, callback) => {
  sendMessageFn = callback
}

const onAccountDeleted = jest.fn()

const setup = () => {
  const client = new CozyClient({})
  return render(
    <AppLike client={client}>
      <BIContractActivationWindow
        konnector={mockKonnector}
        account={mockAccount}
        onAccountDeleted={onAccountDeleted}
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
    Popup.mockImplementation(({ onClose }) => {
      setTimeout(onClose, 1)
      return null
    })
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
    Popup.mockImplementation(({ onClose }) => {
      setTimeout(onClose, 1)
      return null
    })
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
  it('should show account delete dialog after BI connection removed and close harvest', async () => {
    Popup.mockImplementation(() => null)
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
    })

    checkOAuthData.mockImplementation(() => true)
    await act(async () => {
      sendMessageFn({
        data: {
          oAuthStateKey: 'statekey',
          finalLocation: 'connection_deleted=true'
        }
      })
      await waitFor(() =>
        expect(
          getByRole('button', { name: 'Close dialog' })
        ).toBeInTheDocument()
      )
      fireEvent.click(getByRole('button', { name: 'Close dialog' }))
    })
    expect(onAccountDeleted).toHaveBeenCalled()
  })
})
