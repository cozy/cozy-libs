/* eslint-env jest */
import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import CozyClient from 'cozy-client'

import { KonnectorModal } from 'components/KonnectorModal'
import { fetchAccount } from 'connections/accounts'
import AppLike from '../../test/AppLike'

jest.mock(
  './KonnectorConfiguration/ConfigurationTab/index',
  () =>
    function ConfigurationTab() {
      return <p>ConfigurationTab</p>
    }
)
jest.mock('connections/accounts', () => ({
  fetchAccount: jest.fn()
}))

const t = key => key

beforeEach(() => {
  fetchAccount.mockImplementation(() => ({
    _id: '123',
    doctype: 'io.cozy.accounts'
  }))
})

describe('KonnectorModal', () => {
  let mockKonnector, props, shallowOptions

  beforeEach(() => {
    mockKonnector = {
      slug: 'mock',
      name: 'Mock',
      attributes: {},
      triggers: {
        data: [
          { _id: 784, doctype: 'io.cozy.triggers', arguments: '* * * * *' }
        ]
      }
    }
    props = {
      onClose: jest.fn(),
      onSuccess: jest.fn(),
      konnector: mockKonnector,
      t
    }
    shallowOptions = {
      context: {
        client: {
          stackClient: {}
        }
      }
    }
  })

  const setup = extraProps => {
    const finalProps = {
      ...props,
      ...extraProps
    }
    const client = new CozyClient()
    const root = render(
      <AppLike client={client}>
        <KonnectorModal {...finalProps} />
      </AppLike>,
      shallowOptions
    )
    return { root }
  }

  it('should show a spinner while loading', async () => {
    const { root } = setup()
    return waitFor(() => root.getByRole('progressbar'))
  })

  it('should show an error view', async () => {
    fetchAccount.mockImplementation(() => {
      throw new Error('nope')
    })
    const { root } = setup()
    await waitFor(() => root.getByText('Unable to retrieve your account'))
  })

  it('should show the data view of a single account', async () => {
    const { root } = setup()
    await waitFor(() => root.getByText('Once a week'))
  })

  it('should render the selected account via a prop', async () => {
    mockKonnector.triggers.data = [
      { _id: '784', doctype: 'io.cozy.triggers', arguments: '* * * * *' },
      { _id: '872', doctype: 'io.cozy.triggers', arguments: '* * 1 1 1' }
    ]
    const { root } = await setup({
      accountId: '123'
    })
    await waitFor(() => root.getByText('Once a week'))
  })

  it('should show the list of accounts', async () => {
    mockKonnector.triggers.data = [
      { _id: '784', doctype: 'io.cozy.triggers' },
      { _id: '872', doctype: 'io.cozy.triggers' }
    ]
    const { root } = setup()

    await waitFor(() => root.queryByText('123'))
  })

  it('should request account creation', async () => {
    mockKonnector.triggers.data = [
      { _id: '784', doctype: 'io.cozy.triggers' },
      { _id: '872', doctype: 'io.cozy.triggers' }
    ]
    const createAction = jest.fn()
    const { root } = setup({
      createAction
    })
    const btnText = await waitFor(() => root.getByText('Add an account'))
    const btn = btnText.closest('button')
    fireEvent.click(btn)
    expect(createAction).toHaveBeenCalled()
  })
})
