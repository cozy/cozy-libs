import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import TwoFAModal from './TwoFAModal'
import AppLike from '../../test/AppLike'
import ConnectionFlow from '../models/ConnectionFlow'

jest.mock('./KonnectorIcon', () => () => null)

describe('TwoFAModal', () => {
  const setup = ({ konnectorSlug, account }) => {
    const client = {
      on: jest.fn(),
      plugins: {
        realtime: {
          subscribe: jest.fn(),
          unsubscribe: jest.fn()
        }
      }
    }

    const trigger = {
      _id: 'triggerid',
      current_state: {
        last_executed_job_id: 'testjobid'
      }
    }
    const konnector = {
      slug: konnectorSlug
    }
    const flow = new ConnectionFlow(client, trigger, konnector)

    flow.getAccount = () => account
    flow.getKonnectorSlug = () => konnectorSlug

    const root = render(
      <AppLike client={client}>
        <TwoFAModal
          dismissAction={jest.fn()}
          flow={flow}
          breakpoints={{ isMobile: true }}
          account={account}
          client={client}
        />
      </AppLike>
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
        `You need to open your provider's app to confirm your authentication. In some cases, you will have to validate two times.`
      )
    )
  })

  it('should work for several two fa requests', async () => {
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
    const button = root.getByText('Validate').closest('button')
    expect(button.getAttribute('aria-disabled')).toBe(null)
    fireEvent.click(button)

    // 2nd 2FA request
    flow.emit('twoFARequest')

    expect(getInputValue(root)).toBe('')
    expect(
      root.getByText(
        'The second code received on your mobile phone or by email enables you to finalize your connexion.'
      )
    ).toBeTruthy()

    expect(root.getByText('Second code')).toBeTruthy()
    const input2 = root.getByPlaceholderText('')
    fireEvent.change(input2, { target: { value: 'abcd' } })
    await waitFor(() =>
      expect(
        root
          .getByText('Validate')
          .closest('button')
          .getAttribute('aria-disabled')
      ).toBe(null)
    )
    flow.emit('twoFARequest')

    // 3rd 2FA (should not happen, hypothetical case)
    flow.emit('twoFARequest')

    expect(getInputValue(root)).toBe('')
    const input3 = root.getByPlaceholderText('')
    fireEvent.change(input3, { target: { value: 'abcd' } })
    await waitFor(() =>
      expect(
        root
          .getByText('Validate')
          .closest('button')
          .getAttribute('aria-disabled')
      ).toBe(null)
    )
    // First attempt translations are re-used
    expect(
      root.getByText('This code enables you to finish your connexion.')
    ).toBeTruthy()
    expect(root.getByText('code (4)')).toBeTruthy()
    flow.emit('twoFARequest')
  })
})
