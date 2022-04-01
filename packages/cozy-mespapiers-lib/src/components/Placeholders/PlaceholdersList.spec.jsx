'use strict'
import React from 'react'
import { render } from '@testing-library/react'

import AppLike from 'test/components/AppLike'
import PlaceholdersList from 'src/components/Placeholders/PlaceholdersList'

const fakeQualificationItems = [
  {
    label: 'national_id_card'
  }
]

jest.mock('cozy-client/dist/models/document/locales', () => ({
  getBoundT: jest.fn().mockReturnValue(() => 'New paper - Passeport')
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

  it('should display header title with theme', () => {
    const { getByText } = setup()

    expect(getByText('New paper - Passeport'))
  })
})
