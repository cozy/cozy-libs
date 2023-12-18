import { render } from '@testing-library/react'
import React from 'react'

import Empty from './Empty'
import AppLike from '../../../../test/components/AppLike'

jest.mock('cozy-flags')
jest.mock('../HarvestBanner', () => () => <div data-testid="HarvestBanner" />)

const setup = ({
  konnectors,
  accountsWithFiles,
  accountsWithoutFiles
} = {}) => {
  return render(
    <AppLike>
      <Empty
        konnectors={konnectors}
        accountsByFiles={{ accountsWithFiles, accountsWithoutFiles }}
      />
    </AppLike>
  )
}

describe('MesPapiersLibProviders', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should display basic text without harvest banner', () => {
    const { queryByTestId, getByText } = setup({
      konnectors: [],
      accountsWithFiles: [],
      accountsWithoutFiles: []
    })

    expect(queryByTestId('HarvestBanner')).toBeFalsy()
    expect(getByText('Add your personal documents'))
  })

  it('should display specific text if there is at least one konnector, one account without files but no with files ', () => {
    const { getByText } = setup({
      konnectors: [{ slug: 'slug_1', name: 'Slug 1' }],
      accountsWithFiles: [],
      accountsWithoutFiles: [
        {
          auth: { login: 'myLogin' },
          account_type: 'slug_1'
        }
      ]
    })

    expect(getByText('Add manually'))
  })

  it('should display logins', () => {
    const { getByText } = setup({
      konnectors: [
        {
          slug: 'slug_1',
          name: 'Slug 1'
        },
        {
          slug: 'slug_2',
          name: 'Slug 2'
        }
      ],
      accountsWithoutFiles: [
        { auth: { login: 'myLogin' }, account_type: 'slug_1' },
        { auth: { login: 'myOtherLogin' }, account_type: 'slug_2' }
      ]
    })

    expect(getByText('Account Slug 1 : myLogin'))
    expect(getByText('Account Slug 2 : myOtherLogin'))
  })
})
