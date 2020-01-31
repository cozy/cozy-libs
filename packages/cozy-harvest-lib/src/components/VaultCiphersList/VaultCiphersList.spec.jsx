import { DumbVaultCiphersList } from './VaultCiphersList'
import { render, waitForElement, fireEvent } from '@testing-library/react'
import React from 'react'
import I18n from 'cozy-ui/transpiled/react/I18n'

jest.mock('cozy-ui/transpiled/react/AppIcon', () => () => null)

describe('when there is some ciphers', () => {
  it('should handler cipher select', async () => {
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
      <I18n lang="en" dictRequire={() => {}}>
        <DumbVaultCiphersList
          konnector={{ vendor_link: 'https://alan.com' }}
          onSelect={onSelect}
          ciphers={ciphers}
          t={key => key}
        />
      </I18n>
    )

    const node = await waitForElement(() => getByText('isabelledurand'))
    fireEvent.click(node)

    expect(onSelect).toHaveBeenCalledWith(ciphers[0])
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
      <I18n lang="en" dictRequire={() => {}}>
        <DumbVaultCiphersList
          konnector={{ vendor_link: 'https://alan.com' }}
          onSelect={onSelect}
          ciphers={ciphers}
          t={key => key}
        />
      </I18n>
    )

    const node = await waitForElement(() => getByText(/from another account/i))
    fireEvent.click(node)

    expect(onSelect).toHaveBeenCalledWith(null)
  })
})

describe('when there is no cipher', () => {
  it('should handle "other account" select', async () => {
    const onSelect = jest.fn()

    const { getByText } = render(
      <I18n lang="en" dictRequire={() => {}}>
        <DumbVaultCiphersList
          konnector={{ vendor_link: 'https://alan.com' }}
          onNoCiphers={() => {}}
          ciphers={[]}
          onSelect={onSelect}
          t={key => key}
        />
      </I18n>
    )

    const node = await waitForElement(() => getByText(/from another account/i))
    fireEvent.click(node)

    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
