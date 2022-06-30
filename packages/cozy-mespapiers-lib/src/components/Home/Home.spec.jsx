import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { isQueryLoading, useQueryAll } from 'cozy-client'

import AppLike from '../../../test/components/AppLike'
import Home from './Home'
import { useMultiSelection } from '../Hooks/useMultiSelection'

/* eslint-disable react/display-name */
jest.mock('./HomeToolbar', () => () => <div data-testid="HomeToolbar" />)
jest.mock('../ThemesFilter', () => () => <div data-testid="ThemesFilter" />)
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
  isMultiSelectionActive = false
} = {}) => {
  useMultiSelection.mockReturnValue({ isMultiSelectionActive })
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

  it('should display PaperGroup, SearchInput, ThemesFilter & FeaturedPlaceholdersList', () => {
    const { getByTestId } = setup({
      isLoading: false,
      withData: true
    })

    expect(getByTestId('PaperGroup'))
    expect(getByTestId('SearchInput'))
    expect(getByTestId('ThemesFilter'))
    expect(getByTestId('FeaturedPlaceholdersList'))
  })

  it('should display ThemesFilter by default', () => {
    const { getByTestId } = setup({
      isLoading: false,
      withData: true
    })

    expect(getByTestId('ThemesFilter'))
  })

  it('should not display SwitchButton by default', () => {
    const { queryByTestId } = setup({
      isLoading: false,
      withData: true
    })

    expect(queryByTestId('SwitchButton')).toBeNull()
  })

  it('should hide ThemesFilter when SearchInput is focused', () => {
    const { queryByTestId, getByTestId } = setup({
      isLoading: false,
      withData: true
    })

    expect(getByTestId('ThemesFilter'))
    fireEvent.focus(getByTestId('SearchInput'))
    expect(queryByTestId('ThemesFilter')).toBeNull()
  })

  it('should display ThemesFilter when click on SwitchButton', () => {
    const { queryByTestId, getByTestId } = setup({
      isLoading: false,
      withData: true
    })
    fireEvent.focus(getByTestId('SearchInput'))
    expect(queryByTestId('ThemesFilter')).toBeNull()
    fireEvent.click(getByTestId('SwitchButton'))
    expect(getByTestId('ThemesFilter'))
  })

  it('should hide SwitchButton when click on it', () => {
    const { queryByTestId, getByTestId } = setup({
      isLoading: false,
      withData: true
    })

    fireEvent.focus(getByTestId('SearchInput'))
    expect(getByTestId('SwitchButton'))
    fireEvent.click(getByTestId('SwitchButton'))
    expect(queryByTestId('SwitchButton')).toBeNull()
  })

  describe('multi-selection mode', () => {
    it('should display PaperGroup, SearchInput & SwitchButton', () => {
      const { getByTestId } = setup({
        isLoading: false,
        withData: true,
        isMultiSelectionActive: true
      })

      expect(getByTestId('PaperGroup'))
      expect(getByTestId('SearchInput'))
      expect(getByTestId('SwitchButton'))
    })

    it('should not display ThemesFilter by default', () => {
      const { queryByTestId } = setup({
        isLoading: false,
        withData: true,
        isMultiSelectionActive: true
      })

      expect(queryByTestId('ThemesFilter')).toBeNull()
    })

    it('should not display FeaturedPlaceholdersList', () => {
      const { queryByTestId } = setup({
        isLoading: false,
        withData: true,
        isMultiSelectionActive: true
      })

      expect(queryByTestId('FeaturedPlaceholdersList')).toBeNull()
    })
  })
})
