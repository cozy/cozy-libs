import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import AppLike from '../../../test/components/AppLike'
import PlaceholdersList from './PlaceholdersList'

const fakeQualificationItems = [
  {
    label: 'national_id_card'
  },
  {
    label: 'isp_invoice'
  }
]

const setup = () => {
  return render(
    <AppLike>
      <PlaceholdersList currentQualifItems={fakeQualificationItems} />
    </AppLike>
  )
}

describe('PlaceholdersList components:', () => {
  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('should display the Placeholders corresponding to the qualification', () => {
    const { getAllByTestId, getByText } = setup()
    const placeholdersLines = getAllByTestId('PlaceholdersList-ListItem')

    expect(placeholdersLines).toHaveLength(2)
    expect(getByText('ID card'))
    expect(getByText('ISP invoice'))
  })

  it('should display ActionMenu modale when clicked', () => {
    const { getByText, getAllByTestId } = setup()

    const ispInvoiceLine = getAllByTestId('PlaceholdersList-ListItem')[1]

    fireEvent.click(ispInvoiceLine)

    expect(getByText('Add: ISP invoice'))
  })

  it('should not display ActionMenu modale when clicked', () => {
    const { queryByText, getAllByTestId } = setup()

    const nationalIdCardLine = getAllByTestId('PlaceholdersList-ListItem')[0]

    fireEvent.click(nationalIdCardLine)

    expect(queryByText('Add: ID card')).toBeNull()
  })
})
