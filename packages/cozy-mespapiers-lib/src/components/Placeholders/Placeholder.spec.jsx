'use strict'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import Placeholder from './Placeholder'
import AppLike from '../../../test/components/AppLike'

const fakePlaceholders = [
  {
    label: 'tax_notice',
    placeholderIndex: 6,
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

const setup = ({
  placeholder = fakePlaceholders[0],
  divider = false,
  onClick = jest.fn()
} = {}) => {
  return render(
    <AppLike>
      <Placeholder
        placeholder={placeholder}
        divider={divider}
        onClick={onClick}
      />
    </AppLike>
  )
}

describe('Placeholder components:', () => {
  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('should display label of placeholder', () => {
    const { getByText } = setup({ placeholder: fakePlaceholders[0] })

    expect(getByText('Tax notice'))
  })

  it('should display an divider', () => {
    const { getByRole } = setup({
      divider: true
    })

    expect(getByRole('separator'))
  })

  it('should not display an divider', () => {
    const { queryByRole } = setup({
      divider: false
    })

    expect(queryByRole('separator')).toBeNull()
  })

  it('should call onClick when placeholder line is clicked', () => {
    const mockOnClick = jest.fn()
    const { getByTestId } = setup({
      onClick: mockOnClick
    })

    const placeholderLine = getByTestId('Placeholder-ListItem')
    fireEvent.click(placeholderLine)

    expect(mockOnClick).toBeCalledTimes(1)
  })
})
