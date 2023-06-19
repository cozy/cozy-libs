import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import PlaceholdersList from './PlaceholdersList'
import AppLike from '../../../../test/components/AppLike'

const fakeQualificationItems = [
  {
    label: 'national_id_card'
  },
  {
    label: 'isp_invoice'
  }
]

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  generateWebLink: () => ''
}))

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
    expect(getByText('ID card 🇫🇷'))
    expect(getByText('ISP invoice'))
  })

  it('should display ActionMenu modale when clicked', () => {
    const { queryByText, getAllByTestId } = setup()

    expect(queryByText('Auto retrieve')).toBeNull()

    const ispInvoiceLine = getAllByTestId('PlaceholdersList-ListItem')[1]
    fireEvent.click(ispInvoiceLine)

    expect(queryByText('Auto retrieve')).not.toBeNull()
  })

  it('should not display ActionMenu modale when clicked', () => {
    const { queryByText, getAllByTestId } = setup()

    const nationalIdCardLine = getAllByTestId('PlaceholdersList-ListItem')[0]

    fireEvent.click(nationalIdCardLine)

    expect(queryByText('Add: ID card')).toBeNull()
  })
})
