import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import EmptyWithKonnector from './EmptyWithKonnector'
import AppLike from '../../../../test/components/AppLike'

jest.mock('cozy-harvest-lib', () => ({
  LaunchTriggerCard: () => <div data-testid="LaunchTriggerCard" />
}))

const setup = ({
  konnector,
  accountsWithFiles,
  accountsWithoutFiles,
  hasFiles
} = {}) => {
  return render(
    <AppLike>
      <EmptyWithKonnector
        konnector={konnector}
        accountsByFiles={{ accountsWithFiles, accountsWithoutFiles }}
        hasFiles={hasFiles}
      />
    </AppLike>
  )
}

describe('EmptyWithKonnector', () => {
  const konnector = { name: 'Test Konnector' }
  const accountsWithFiles = [{ id: 'account1' }]
  const accountsWithoutFiles = [{ id: 'account2' }, { id: 'account3' }]

  it('renders EmptyNoHeader when there is only one account without files and no other files', () => {
    const { getByTestId } = setup({
      konnector,
      accountsWithFiles: [],
      accountsWithoutFiles: accountsWithoutFiles.slice(0, 1),
      hasFiles: false
    })

    expect(getByTestId('EmptyNoHeader')).toBeInTheDocument()
  })

  it('renders EmptyWithHeader when there is only one account without files and other files exists', () => {
    const { getByTestId } = setup({
      konnector,
      accountsWithFiles: [],
      accountsWithoutFiles: accountsWithoutFiles.slice(0, 1),
      hasFiles: true
    })

    expect(getByTestId('EmptyWithHeader')).toBeInTheDocument()
  })

  it('renders EmptyWithHeader for each account without files', () => {
    const { getAllByTestId } = setup({
      konnector,
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
      konnector,
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
      konnector,
      accountsWithFiles,
      accountsWithoutFiles,
      hasFiles: true
    })
    expect(getAllByTestId('EmptyWithHeader')).toHaveLength(
      accountsWithoutFiles.length
    )
  })
})
