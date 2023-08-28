import { render } from '@testing-library/react'
import React from 'react'

import Empty from './Empty'
import AppLike from '../../../../test/components/AppLike'

jest.mock('cozy-flags')
jest.mock('../HarvestBanner', () => () => <div data-testid="HarvestBanner" />)

const setup = ({ konnector, accountsWithFiles, accountsWithoutFiles } = {}) => {
  return render(
    <AppLike>
      <Empty
        konnector={konnector}
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
      konnector: undefined,
      accountsWithFiles: undefined,
      accountsWithoutFiles: undefined
    })

    expect(queryByTestId('HarvestBanner')).toBeFalsy()
    expect(getByText('Add your personal documents'))
  })

  it('should display specific text', () => {
    const { getByText } = setup({
      konnector: {},
      accountsWithFiles: [],
      accountsWithoutFiles: [{}]
    })

    expect(getByText('Add manually'))
  })

  it('should display logins', () => {
    const { getByText } = setup({
      konnector: {},
      accountsWithoutFiles: [
        { auth: { login: 'myLogin' } },
        { auth: { login: 'myOtherLogin' } }
      ]
    })

    expect(getByText('Account %{name} : myLogin'))
    expect(getByText('Account %{name} : myOtherLogin'))
  })
})
