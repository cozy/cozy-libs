import React from 'react'
import { render } from '@testing-library/react'

import { isQueryLoading, useQueryAll } from 'cozy-client'

import AppLike from '../../../test/components/AppLike'
import Home from './Home'
import { useMultiSelection } from '../Hooks/useMultiSelection'

/* eslint-disable react/display-name */
jest.mock('./HomeToolbar', () => () => <div data-testid="HomeToolbar" />)
jest.mock('../ThemesFilter', () => () => <div data-testid="ThemesFilter" />)
jest.mock('../SearchInput', () => () => <div data-testid="SearchInput" />)
jest.mock('../Papers/PaperGroup', () => () => <div data-testid="PaperGroup" />)
jest.mock('cozy-ui/transpiled/react/Empty', () => () => (
  <div data-testid="Empty" />
))
jest.mock('../Placeholders/FeaturedPlaceholdersList', () => () => (
  <div data-testid="FeaturedPlaceholdersList" />
))
/* eslint-enable react/display-name */

jest.mock('../Hooks/useMultiSelection')
jest.mock('cozy-client/dist/hooks', () => ({
  ...jest.requireActual('cozy-client/dist/hooks'),
  useQueryAll: jest.fn()
}))
jest.mock('cozy-client/dist/utils', () => ({
  ...jest.requireActual('cozy-client/dist/utils'),
  isQueryLoading: jest.fn(),
  hasQueryBeenLoaded: jest.fn(),
  useQueryAll: jest.fn()
}))

const setup = ({
  isLoading = true,
  withData = false,
  multiSelectionState = false
} = {}) => {
  useMultiSelection.mockReturnValue({ multiSelectionState })
  isQueryLoading.mockReturnValue(isLoading)
  useQueryAll.mockReturnValue({
    data: withData
      ? [{ metadata: { qualification: { label: 'LabelQualif' } } }]
      : [],
    hasMore: false
  })
  return render(
    <AppLike>
      <Home />
    </AppLike>
  )
}

describe('Home components:', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('should display only paperGroup in multi-selection mode', () => {
    const { queryByTestId, getByTestId } = setup({
      isLoading: false,
      withData: true,
      multiSelectionState: true
    })

    expect(queryByTestId('ThemesFilter')).toBeNull()
    expect(queryByTestId('SearchInput')).toBeNull()
    expect(queryByTestId('FeaturedPlaceholdersList')).toBeNull()
    expect(getByTestId('PaperGroup'))
  })

  it('should display Spinner when all data are not loaded', () => {
    const { getByRole } = setup()

    expect(getByRole('progressbar'))
  })

  it('should not display Spinner when all data are loaded', () => {
    const { queryByRole } = setup({ isLoading: false })

    expect(queryByRole('progressbar')).toBeNull()
  })

  it('should display Empty when no data exists', () => {
    const { getByTestId, queryByTestId } = setup({ isLoading: false })

    expect(getByTestId('Empty'))
    expect(queryByTestId('PaperGroup')).toBeNull()
  })

  it('should display PaperGroup when data exists', () => {
    const { getByTestId, queryByTestId } = setup({
      isLoading: false,
      withData: true
    })

    expect(getByTestId('PaperGroup'))
    expect(queryByTestId('Empty')).toBeNull()
  })
})
