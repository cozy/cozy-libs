import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import StackedThumbnail from './StackedThumbnail'

const setup = isStacked => {
  return render(
    <StackedThumbnail image="/fakeImagePath" isStacked={isStacked} />
  )
}

describe('StackedThumbnail components:', () => {
  it('should display only one Thumbnail', () => {
    const { getByTestId, queryByTestId } = setup()

    expect(getByTestId('ThumbnailContainer')).toBeInTheDocument()
    expect(queryByTestId('ThumbnailBackgroundContainer')).toBeNull()
  })

  it('should display Thumbnail stacked', () => {
    const { getByTestId } = setup(true)

    expect(getByTestId('ThumbnailContainer')).toBeInTheDocument()
    expect(getByTestId('ThumbnailBackgroundContainer')).toBeInTheDocument()
  })
})
