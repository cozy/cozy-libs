import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import VaultCiphersList from './VaultCiphersList'
import AppLike from '../../../test/AppLike'

jest.mock('cozy-ui-plus/dist/AppIcon', () => () => null)

describe('when there is some ciphers', () => {
  it('should handle cipher select', async () => {
    const onSelect = jest.fn()
    const ciphers = [
      {
        id: 'alan',
        name: 'Alan',
        login: {
          username: 'isabelledurand'
        }
      }
    ]
    const client = {}

    const { getByText } = render(
      <AppLike client={client}>
        <VaultCiphersList
          konnector={{ vendor_link: 'https://alan.com' }}
          onSelect={onSelect}
          ciphers={ciphers}
        />
      </AppLike>
    )

    const node = await getByText('isabelledurand')
    fireEvent.click(node)

    expect(onSelect).toHaveBeenCalledWith(ciphers[0])
  })

  it('should ignore soft deleted ciphers', async () => {
    const onSelect = jest.fn()
    const ciphers = [
      {
        id: 'alan',
        name: 'Alan',
        login: {
          username: 'isabelledurand'
        }
      },
      {
        id: 'trashed',
        name: 'trash',
        login: {
          username: 'toignore'
        },
        deletedDate: '2020-11-03'
      }
    ]
    const { queryByText } = render(
      <AppLike client={{}}>
        <VaultCiphersList
          konnector={{ vendor_link: 'https://alan.com' }}
          ciphers={ciphers}
          onSelect={onSelect}
          t={key => key}
        />
      </AppLike>
    )

    const node = await queryByText('toignore')
    expect(node).toBe(null)
  })

  it('should handle "other account" select', async () => {
    const onSelect = jest.fn()
    const ciphers = [
      {
        id: 'alan',
        name: 'Alan',
        login: {
          username: 'isabelledurand'
        }
      }
    ]

    const { getByText } = render(
      <AppLike client={{}}>
        <VaultCiphersList
          konnector={{ vendor_link: 'https://alan.com' }}
          onSelect={onSelect}
          ciphers={ciphers}
        />
      </AppLike>
    )

    const node = await getByText(/from another account/i)
    fireEvent.click(node)

    expect(onSelect).toHaveBeenCalledWith(null)
  })
})

describe('when there is no cipher', () => {
  it('should handle "other account" select', async () => {
    const onSelect = jest.fn()

    const { getByText } = render(
      <AppLike client={{}}>
        <VaultCiphersList
          konnector={{ vendor_link: 'https://alan.com' }}
          onNoCiphers={() => {}}
          ciphers={[]}
          onSelect={onSelect}
        />
      </AppLike>
    )

    const node = await getByText(/from another account/i)
    fireEvent.click(node)

    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
