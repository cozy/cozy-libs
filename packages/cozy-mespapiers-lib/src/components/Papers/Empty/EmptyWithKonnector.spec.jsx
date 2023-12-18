import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import EmptyWithKonnectors from './EmptyWithKonnectors'
import AppLike from '../../../../test/components/AppLike'

jest.mock('cozy-harvest-lib', () => ({
  LaunchTriggerCard: () => <div data-testid="LaunchTriggerCard" />
}))

const setup = ({
  konnectors,
  accountsWithFiles,
  accountsWithoutFiles,
  hasFiles
} = {}) => {
  return render(
    <AppLike>
      <EmptyWithKonnectors
        konnectors={konnectors}
        accountsByFiles={{ accountsWithFiles, accountsWithoutFiles }}
        hasFiles={hasFiles}
      />
    </AppLike>
  )
}

describe('EmptyWithKonnectors', () => {
  const konnectors = [
    { name: 'Test Konnector 1', slug: 'konnector_test_1' },
    { name: 'Test Konnector 2', slug: 'konnector_test_2' },
    { name: 'Test Konnector 3', slug: 'konnector_test_3' }
  ]
  const accountsWithFiles = [
    { id: 'account1', account_type: 'konnector_test_1' }
  ]
  const accountsWithoutFiles = [
    { id: 'account2', account_type: 'konnector_test_2' },
    { id: 'account3', account_type: 'konnector_test_3' }
  ]

  it('renders EmptyNoHeader when there is only one account without files and no other files', () => {
    const { getByTestId } = setup({
      konnectors,
      accountsWithFiles: [],
      accountsWithoutFiles: accountsWithoutFiles.slice(0, 1),
      hasFiles: false
    })

    expect(getByTestId('EmptyNoHeader')).toBeInTheDocument()
  })

  it('renders EmptyWithHeader when there is only one account without files and other files exists', () => {
    const { getByTestId } = setup({
      konnectors,
      accountsWithFiles: [],
      accountsWithoutFiles: accountsWithoutFiles.slice(0, 1),
      hasFiles: true
    })

    expect(getByTestId('EmptyWithHeader')).toBeInTheDocument()
  })

  it('renders EmptyWithHeader for each account without files', () => {
    const { getAllByTestId } = setup({
      konnectors,
      accountsWithFiles: [],
      accountsWithoutFiles: accountsWithoutFiles,
      hasFiles: false
    })
    expect(getAllByTestId('EmptyWithHeader')).toHaveLength(
      accountsWithoutFiles.length
    )
  })

  it('renders EmptyWithHeader for each account without files even when there are accounts with files', () => {
    const { getAllByTestId } = setup({
      konnectors,
      accountsWithFiles,
      accountsWithoutFiles,
      hasFiles: false
    })
    expect(getAllByTestId('EmptyWithHeader')).toHaveLength(
      accountsWithoutFiles.length
    )
  })

  it('renders EmptyWithHeader for each account without files even when there are accounts with files and other files exists', () => {
    const { getAllByTestId } = setup({
      konnectors,
      accountsWithFiles,
      accountsWithoutFiles,
      hasFiles: true
    })
    expect(getAllByTestId('EmptyWithHeader')).toHaveLength(
      accountsWithoutFiles.length
    )
  })
})
