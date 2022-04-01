'use strict'
import React from 'react'
import { render } from '@testing-library/react'

import { models } from 'cozy-client'
const {
  locales: { getBoundT }
} = models.document

import AppLike from 'test/components/AppLike'
import People from 'cozy-ui/transpiled/react/Icons/People'

import ImportDropdown from 'src/components/ImportDropdown/ImportDropdown'

jest.mock('cozy-client/dist/models/document/locales', () => ({
  getBoundT: jest.fn(() => jest.fn())
}))

const setup = (label = 'national_id_card') => {
  return render(
    <AppLike>
      <ImportDropdown label={label} icon={People} />
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
    expect(getByText('Auto import'))
  })

  it('should display correct menu for Passeport', () => {
    getBoundT.mockReturnValueOnce(() => 'Passport')
    const { getByText } = setup('passport')

    expect(getByText('Add: Passport'))
    expect(getByText('Auto import'))
  })
})
