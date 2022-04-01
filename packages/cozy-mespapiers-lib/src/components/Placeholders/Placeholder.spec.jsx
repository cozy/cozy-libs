'use strict'
import React from 'react'
import { render } from '@testing-library/react'

import { models } from 'cozy-client'

import AppLike from '../../../test/components/AppLike'
import paperJSON from '../../constants/papersDefinitions.json'
import Placeholder from './Placeholder'

const {
  locales: { getBoundT }
} = models.document
const papersList = paperJSON.papersDefinitions

jest.mock('cozy-client/dist/models/document/locales', () => ({
  getBoundT: jest.fn(() => jest.fn())
}))

const setup = (placeholder = papersList[0]) => {
  return render(
    <AppLike>
      <Placeholder placeholder={placeholder} divider={true} />
    </AppLike>
  )
}

describe('Placeholder components:', () => {
  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('should display ID card', () => {
    getBoundT.mockReturnValueOnce(() => 'ID card')
    const { getByText } = setup(papersList[0])

    expect(getByText('ID card'))
  })

  it('should display Passeport', () => {
    getBoundT.mockReturnValueOnce(() => 'Passport')
    const { getByText } = setup(papersList[1])

    expect(getByText('Passport'))
  })
})
