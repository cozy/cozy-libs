'use strict'
import React from 'react'
import { render } from '@testing-library/react'

import AppLike from 'test/components/AppLike'
import { useQuery, models } from 'cozy-client'
const {
  locales: { getBoundT }
} = models.document

import FeaturedPlaceholdersList from 'src/components/Placeholders/FeaturedPlaceholdersList'

const fakePapers = [
  {
    metadata: {
      qualification: {
        label: 'national_id_card'
      }
    }
  },
  {
    metadata: {
      qualification: {
        label: 'passport'
      }
    }
  }
]

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('cozy-client/dist/models/document/locales', () => ({
  getBoundT: jest.fn(() => jest.fn())
}))

const setup = ({ data = [], hasFeaturedPlaceholders = true } = {}) => {
  useQuery.mockReturnValue({ data })

  return render(
    <AppLike>
      <FeaturedPlaceholdersList
        featuredPlaceholders={
          hasFeaturedPlaceholders
            ? [{ label: 'Label', icon: 'icon', acquisitionSteps: [] }]
            : []
        }
      />
    </AppLike>
  )
}

describe('FeaturedPlaceholdersList components:', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('should not display Suggestions header', () => {
    const { queryByText } = setup({ hasFeaturedPlaceholders: false })

    expect(queryByText('Suggestions')).toBeNull()
  })

  it('should display Suggestions', () => {
    getBoundT.mockReturnValueOnce(() => 'Others...')
    const { getByText } = setup({ data: fakePapers })

    expect(getByText('Suggestions'))
  })

  it('should display Suggestions & list of placeholder filtered', () => {
    getBoundT.mockReturnValueOnce(() => 'ID card')
    const { getByText, getAllByText } = setup({ data: fakePapers[1] })

    expect(getByText('Suggestions'))
    expect(getAllByText('ID card'))
  })
})
