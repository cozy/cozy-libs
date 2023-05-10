import { render } from '@testing-library/react'
import React from 'react'

import { useQuery } from 'cozy-client'

import HarvestBanner from './HarvestBanner'
import AppLike from '../../../test/components/AppLike'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('cozy-harvest-lib', () => ({
  LaunchTriggerCard: () => <div data-testid="LaunchTriggerCard" />
}))

const setup = ({ konnector, account, isTriggersLoading } = {}) => {
  useQuery.mockReturnValue(
    isTriggersLoading
      ? {
          data: null,
          fetchStatus: 'loading'
        }
      : {
          data: [],
          fetchStatus: 'loaded'
        }
  )

  const root = render(
    <AppLike>
      <HarvestBanner konnector={konnector} account={account} />
    </AppLike>
  )

  return root
}

describe('HarvestBanner', () => {
  describe('it should show HarvestBanner', () => {
    it('when account is undefined and trigger query loaded', () => {
      const { queryByTestId } = setup({
        konnector: { slug: 'konnectorSlug' },
        account: undefined,
        isTriggersLoading: false
      })

      expect(queryByTestId('LaunchTriggerCard')).not.toBeNull()
    })

    it('when konnector and account are defined and trigger query loaded', () => {
      const { queryByTestId } = setup({
        konnector: { slug: 'konnectorSlug' },
        account: { _id: 'accountId' },
        isTriggersLoading: false
      })

      expect(queryByTestId('LaunchTriggerCard')).not.toBeNull()
    })
  })

  describe('it should hide HarvestBanner', () => {
    it('when account is undefined and trigger query not loaded', () => {
      const { queryByTestId } = setup({
        konnector: { slug: 'konnectorSlug' },
        account: undefined,
        isTriggersLoading: true
      })

      expect(queryByTestId('LaunchTriggerCard')).toBeNull()
    })

    it('when konnector is undefined and trigger query not loaded', () => {
      const { queryByTestId } = setup({
        konnector: undefined,
        account: { _id: 'accountId' },
        isTriggersLoading: false
      })

      expect(queryByTestId('LaunchTriggerCard')).toBeNull()
    })

    it('when konnector and account are defined and trigger query not loaded', () => {
      const { queryByTestId } = setup({
        konnector: { slug: 'konnectorSlug' },
        account: { _id: 'accountId' },
        isTriggersLoading: true
      })

      expect(queryByTestId('LaunchTriggerCard')).toBeNull()
    })

    it('when konnector and account are undefined and trigger query loaded', () => {
      const { queryByTestId } = setup({
        konnector: undefined,
        account: undefined,
        isTriggersLoading: false
      })

      expect(queryByTestId('LaunchTriggerCard')).toBeNull()
    })
  })
})
