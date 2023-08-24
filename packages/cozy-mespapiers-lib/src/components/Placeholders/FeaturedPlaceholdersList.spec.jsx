import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import FeaturedPlaceholdersList from './FeaturedPlaceholdersList'
import AppLike from '../../../test/components/AppLike'

const fakePlaceholders = [
  {
    label: 'tax_notice',
    placeholderIndex: 1,
    icon: 'bank',
    featureDate: 'referencedDate',
    maxDisplay: 3,
    acquisitionSteps: [],
    konnectorCriteria: {
      name: 'impots'
    }
  },
  {
    label: 'driver_license',
    placeholderIndex: 2,
    icon: 'car',
    featureDate: 'carObtentionDate',
    maxDisplay: 2,
    acquisitionSteps: [
      {
        model: 'scan',
        page: 'front',
        illustration: 'IlluDriverLicenseFront.png',
        text: 'PaperJSON.generic.front.text'
      }
    ]
  }
]

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  }
})

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  generateWebLink: () => ''
}))

const setup = ({ data = [], mockNavigate = jest.fn() } = {}) => {
  useNavigate.mockImplementation(() => mockNavigate)

  return render(
    <AppLike>
      <FeaturedPlaceholdersList featuredPlaceholders={data} />
    </AppLike>
  )
}

describe('FeaturedPlaceholdersList components:', () => {
  it('should not display Suggestions header', () => {
    const { queryByText } = setup({ data: [] })

    expect(queryByText('Suggestions')).toBeNull()
  })

  it('should display Suggestions', () => {
    const { getByText } = setup({ data: fakePlaceholders })

    expect(getByText('Suggestions')).toBeInTheDocument()
  })

  it('should display ActionMenu modale when "placeholder" with "konnectorCriteria" is clicked', () => {
    const { getAllByTestId, queryByText } = setup({
      data: [fakePlaceholders[0]]
    })

    expect(queryByText('Auto retrieve')).toBeNull()

    const placeholderComp = getAllByTestId('Placeholder-ListItem')[0]
    fireEvent.click(placeholderComp)

    expect(queryByText('Auto retrieve')).not.toBeNull()
  })

  it('should navigate to "create/<placeholder label>" when "placeholder" without "konnectorCriteria" is clicked', () => {
    const mockNavigate = jest.fn()
    const { getAllByTestId } = setup({
      data: [fakePlaceholders[1]],
      mockNavigate
    })

    const placeholderComp = getAllByTestId('Placeholder-ListItem')[0]
    fireEvent.click(placeholderComp)

    expect(mockNavigate).toBeCalledTimes(1)
    expect(mockNavigate).toBeCalledWith({
      pathname: 'create/driver_license',
      search: ''
    })
  })
})
