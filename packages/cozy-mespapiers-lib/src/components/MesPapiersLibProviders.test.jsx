import React from 'react'
import { render } from '@testing-library/react'

import { MesPapiersLibProviders } from './MesPapiersLibProviders'
import AppLike from '../../test/components/AppLike'

/* eslint-disable react/display-name */
jest.mock('./PapersFab/PapersFabWrapper', () => () => (
  <div data-testid="PapersFabWrapper" />
))
/* eslint-enable react/display-name */

const setup = ({ components } = {}) => {
  return render(
    <AppLike>
      <MesPapiersLibProviders {...(components && { components: components })} />
    </AppLike>
  )
}

describe('MesPapiersLibProviders', () => {
  it('should display PapersFabWrapper & PapersFab by default', () => {
    const { getByTestId } = setup()

    expect(getByTestId('PapersFabWrapper'))
  })

  it('should not display PapersFabWrapper & PapersFab', () => {
    const { queryByTestId } = setup({ components: { PapersFab: null } })

    expect(queryByTestId('PapersFabWrapper')).toBeNull()
  })
})
