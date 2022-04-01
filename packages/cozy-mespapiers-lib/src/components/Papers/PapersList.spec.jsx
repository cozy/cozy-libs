'use strict'
import React from 'react'
import { render } from '@testing-library/react'

import AppLike from 'test/components/AppLike'
import PapersList from 'src/components/Papers/PapersList'

const mockPapers = {
  maxDisplay: 2,
  list: [
    { _id: '001', name: 'File01' },
    { _id: '002', name: 'File02' },
    { _id: '003', name: 'File03' },
    { _id: '004', name: 'File04' }
  ]
}

const setup = () => {
  return render(
    <AppLike>
      <PapersList papers={mockPapers} />
    </AppLike>
  )
}

describe('PapersList components:', () => {
  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it.each`
    data
    ${'File01'}
    ${'File02'}
    ${'See more (2)'}
  `(`should display "$data"`, ({ data }) => {
    const { getByText } = setup()
    expect(getByText(data))
  })
})
