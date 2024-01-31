'use strict'
import { render } from '@testing-library/react'
import React from 'react'

import { models } from 'cozy-client'

import PaperLine from './PaperLine'
import AppLike from '../../../test/components/AppLike'

const {
  locales: { getBoundT }
} = models.document

const mockPapers = [
  { id: '00', name: 'ID card' },
  { id: '01', name: 'Passport' }
]

jest.mock('cozy-client/dist/models/document/locales', () => ({
  getBoundT: jest.fn(() => jest.fn())
}))

const setup = (paper = mockPapers[0]) => {
  return render(
    <AppLike>
      <PaperLine paper={paper} divider={true} />
    </AppLike>
  )
}

describe('PaperLine components:', () => {
  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('should display "ID card"', () => {
    getBoundT.mockReturnValueOnce(() => 'ID card')
    const { getByText } = setup(mockPapers[0])

    expect(getByText('ID card'))
  })

  it('should display "Passport"', () => {
    getBoundT.mockReturnValueOnce(() => 'Passport')
    const { getByText } = setup(mockPapers[1])

    expect(getByText('Passport'))
  })
})
