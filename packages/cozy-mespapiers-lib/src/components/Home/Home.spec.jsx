'use strict'
import React from 'react'
import { render, waitFor } from '@testing-library/react'

import { isQueryLoading, hasQueryBeenLoaded, useQuery } from 'cozy-client'

import AppLike from 'test/components/AppLike'
import Home from 'src/components/Home/Home'

jest.mock('cozy-client/dist/hooks', () => ({
  ...jest.requireActual('cozy-client/dist/hooks'),
  useQuery: jest.fn()
}))
jest.mock('cozy-client/dist/utils', () => ({
  ...jest.requireActual('cozy-client/dist/utils'),
  isQueryLoading: jest.fn(),
  hasQueryBeenLoaded: jest.fn(),
  useQuery: jest.fn()
}))

const setup = ({
  isLoading = true,
  isLoaded = false,
  withData = false
} = {}) => {
  isQueryLoading.mockReturnValue(isLoading)
  hasQueryBeenLoaded.mockReturnValue(isLoaded)
  useQuery.mockReturnValue({
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

  it('should display Spinner when all data are not loaded', async () => {
    const { container } = setup()

    await waitFor(() => {
      expect(container.querySelector('[role="progressbar"]')).toBeDefined()
    })
  })

  it('should not display Spinner when all data are loaded', async () => {
    const { container } = setup({ isLoading: false, isLoaded: true })

    await waitFor(() => {
      expect(container.querySelector('[role="progressbar"]')).toBeNull()
    })
  })

  it('should display Empty text & Placeholder when no data exists', async () => {
    const { getByText } = setup({ isLoading: false, isLoaded: true })

    await waitFor(() => {
      expect(getByText('Add your personal documents'))
    })
  })

  it('should display Existing label when data exists', async () => {
    const { container, getByText } = setup({
      isLoading: false,
      isLoaded: true,
      withData: true
    })

    await waitFor(() => {
      expect(container.querySelector('[role="progressbar"]')).toBeNull()
      expect(getByText('Existing'))
      expect(getByText('Scan.items.LabelQualif'))
    })
  })
})
