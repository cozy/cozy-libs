import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import Thumbnail from '.'

const setup = isStacked => {
  return render(<Thumbnail image="/fakeImagePath" isStacked={isStacked} />)
}

describe('Thumbnail components:', () => {
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
