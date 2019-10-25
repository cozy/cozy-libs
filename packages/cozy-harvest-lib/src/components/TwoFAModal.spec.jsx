import React from 'react'
import { mount } from 'enzyme'
import { TwoFAModal } from './TwoFAModal'
import KonnectorJob from '../models/KonnectorJob'

jest.mock('./KonnectorIcon', () => () => null)

describe('TwoFAModal', () => {
  const setup = ({ konnectorSlug, account }) => {
    const client = {
      on: jest.fn()
    }
    const trigger = {}
    const konnectorJob = new KonnectorJob(client, trigger)

    konnectorJob.isTwoFARetry = jest.fn()
    konnectorJob.getKonnectorSlug = () => konnectorSlug
    konnectorJob.isTwoFARunning = jest.fn()

    const root = mount(
      <TwoFAModal
        dismissAction={jest.fn()}
        konnectorJob={konnectorJob}
        t={x => x}
        breakpoints={{ isMobile: true }}
        account={account}
        client={client}
      />
    )
    return { root, konnectorJob }
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

  it('should work for several two fa requests', () => {
    const opts = {
      account: {
        state: 'TWO_FA_NEEDED.SMS'
      },
      konnectorSlug: 'boursoma83'
    }
    const { root, konnectorJob } = setup(opts)
    const inp = root.find('input')
    const getInputValue = () =>
      root
        .find('input')
        .props()
        .value.toString()
    expect(inp.length).toBe(1)
    expect(getInputValue()).toBe('')
    expect(root.text()).toContain('twoFAForm.desc')
    root.setState({ twoFACode: 'abcd' })
    root.update()
    expect(getInputValue()).toBe('abcd')
    konnectorJob.emit('twoFARequest')
    root.update()
    expect(getInputValue()).toBe('')
    expect(root.text()).toContain('(2)')
  })
})
