import React from 'react'
import { mount } from 'enzyme'
import { TwoFAModal } from './TwoFAModal'

jest.mock('./KonnectorIcon', () => () => null)

describe('TwoFAModal', () => {
  const setup = ({ konnectorSlug, account }) => {
    const konnJob = {
      isTwoFARetry: jest.fn(),
      getKonnectorSlug: () => konnectorSlug,
      on: jest.fn(),
      isTwoFARunning: jest.fn()
    }
    const client = {}
    const root = mount(
      <TwoFAModal
        dismissAction={jest.fn()}
        konnectorJob={konnJob}
        t={x => x}
        breakpoints={{ isMobile: true }}
        account={account}
        client={client}
      />
    )
    return { root }
  }

  it('should work even with unknown 2FA', () => {
    const opts = {
      account: {
        state: 'TWO_FA_NEEDED.UNKNOWN'
      },
      konnectorSlug: 'boursoma83'
    }
    const { root } = setup(opts)

    // show an input by default
    expect(root.find('input').length).toBe(1)
    expect(root.text()).toContain('twoFAForm.desc')
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
    expect(root.find('input').length).toBe(0)
    expect(root.text()).toContain('twoFAForm.desc')
  })
})
