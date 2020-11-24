import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import I18n from 'cozy-ui/transpiled/react/I18n'

import TwoFAModal from './TwoFAModal'
import ConnectionFlow from '../models/ConnectionFlow'

jest.mock('./KonnectorIcon', () => () => null)

describe('TwoFAModal', () => {
  const setup = ({ konnectorSlug, account }) => {
    const client = {
      on: jest.fn()
    }

    const trigger = {}
    const flow = new ConnectionFlow(client, trigger)

    flow.getAccount = () => account
    flow.getKonnectorSlug = () => konnectorSlug

    const root = render(
      <I18n dictRequire={() => {}} lang="en">
        <TwoFAModal
          dismissAction={jest.fn()}
          flow={flow}
          breakpoints={{ isMobile: true }}
          account={account}
          client={client}
        />
      </I18n>
    )
    return { root, flow }
  }

  const getInputValue = root => root.getByPlaceholderText('').value

  it('should work even with unknown 2FA', () => {
    const opts = {
      account: {
        state: 'TWO_FA_NEEDED.UNKNOWN'
      },
      konnectorSlug: 'boursoma83'
    }
    const { root } = setup(opts)

    // show an input by default
    expect(root.getByPlaceholderText('')).toBeTruthy()
    expect(
      root.getByText('This code enables you to finish your connexion.')
    ).toBeTruthy()
  })

  it('should work', () => {
    const opts = {
      account: {
        state: 'TWO_FA_NEEDED.APP'
      },
      konnectorSlug: 'boursoma83'
    }
    const { root } = setup(opts)
    // no input for app two fa
    expect(root.queryByPlaceholderText('')).toBeFalsy()
    expect(
      root.getByText(
        `You need to open your provider's app and/or click on a notification to confirm your authentication.`
      )
    )
  })

  it('should work for several two fa requests', () => {
    const opts = {
      account: {
        state: 'TWO_FA_NEEDED.SMS'
      },
      konnectorSlug: 'boursoma83'
    }
    const { root, flow } = setup(opts)

    const input = root.getByPlaceholderText('')
    expect(input).toBeTruthy()

    // expect(inp.length).toBe(1)
    // expect((root)).toBe('')
    expect(
      root.getByText('This code enables you to finish your connexion.')
    ).toBeTruthy()

    expect(root.getByText('code')).toBeTruthy()

    fireEvent.change(input, { target: { value: 'abcd' } })

    // 2nd 2FA request
    flow.emit('twoFARequest')

    expect(getInputValue(root)).toBe('')
    expect(
      root.getByText(
        'The second code received on your mobile phone or by email enables you to finalize your connexion.'
      )
    ).toBeTruthy()

    expect(root.getByText('Second code')).toBeTruthy()
    flow.emit('twoFARequest')

    // 3rd 2FA (should not happen, hypothetical case)
    flow.emit('twoFARequest')

    expect(getInputValue(root)).toBe('')
    // First attempt translations are re-used
    expect(
      root.getByText('This code enables you to finish your connexion.')
    ).toBeTruthy()
    expect(root.getByText('code (4)')).toBeTruthy()
    flow.emit('twoFARequest')
  })
})
