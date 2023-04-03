'use strict'
import { render } from '@testing-library/react'
import React from 'react'

import { models } from 'cozy-client'
const {
  locales: { getBoundT }
} = models.document

import ImportDropdown from './ImportDropdown'
import AppLike from '../../../test/components/AppLike'

jest.mock('cozy-client/dist/models/document/locales', () => ({
  getBoundT: jest.fn(() => jest.fn())
}))

const setup = (label = 'national_id_card') => {
  const placeholder = { label, icon: 'people', acquisitionSteps: [] }
  return render(
    <AppLike>
      <ImportDropdown placeholder={placeholder} />
    </AppLike>
  )
}

describe('ImportDropdown components:', () => {
  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('should display correct menu for ID card', () => {
    getBoundT.mockReturnValueOnce(() => 'ID card')
    const { getByText } = setup('national_id_card')

    expect(getByText('Add: ID card'))
    expect(getByText('Auto retrieve'))
  })

  it('should display correct menu for Passeport', () => {
    getBoundT.mockReturnValueOnce(() => 'Passport')
    const { getByText } = setup('passport')

    expect(getByText('Add: Passport'))
    expect(getByText('Auto retrieve'))
  })
})
