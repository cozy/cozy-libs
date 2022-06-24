import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import AppLike from '../../../test/components/AppLike'
import FeaturedPlaceholdersList from './FeaturedPlaceholdersList'

const fakePlaceholders = [
  {
    label: 'tax_notice',
    placeholderIndex: 6,
    icon: 'bank',
    featureDate: 'referencedDate',
    maxDisplay: 3,
    acquisitionSteps: [],
    connectorCriteria: {
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
        stepIndex: 1,
        model: 'scan',
        page: 'front',
        illustration: 'IlluDriverLicenseFront.png',
        text: 'PaperJSON.generic.front.text'
      }
    ]
  }
]

/* eslint-disable react/display-name */
jest.mock('../ImportDropdown/ImportDropdownItems', () => () => {
  return <div data-testid="ImportDropdownItems" />
})
jest.mock('./Placeholder', () => ({ onClick }) => {
  const fakePlaceholder = {
    label: 'tax_notice',
    placeholderIndex: 6,
    icon: 'bank',
    featureDate: 'referencedDate',
    maxDisplay: 3,
    acquisitionSteps: [],
    connectorCriteria: {
      name: 'impots'
    }
  }
  return (
    <div data-testid="Placeholder" onClick={() => onClick(fakePlaceholder)} />
  )
})
/* eslint-enable react/display-name */

const setup = ({ data = [] } = {}) => {
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

    expect(getByText('Suggestions'))
  })

  it('should display ActionMenu modale when placeholder line is clicked', () => {
    const { getByTestId, getByText } = setup({ data: [fakePlaceholders[0]] })

    const placeholderComp = getByTestId('Placeholder')
    fireEvent.click(placeholderComp)

    expect(getByText('Add: Tax notice'))
  })

  it('should not display ActionMenu modale by default', () => {
    const { getByTestId, getByText } = setup({ data: [fakePlaceholders[0]] })

    const placeholderComp = getByTestId('Placeholder')
    fireEvent.click(placeholderComp)

    expect(getByText('Add: Tax notice'))
  })
})
