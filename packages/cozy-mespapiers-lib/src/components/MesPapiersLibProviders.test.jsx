import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import { useQuery } from 'cozy-client'

import MesPapiersLibProviders from './MesPapiersLibProviders'
import AppLike from '../../test/components/AppLike'

/* eslint-disable react/display-name */
jest.mock('./PapersFab/PapersFabWrapper', () => () => (
  <div data-testid="PapersFabWrapper" />
))
/* eslint-enable react/display-name */
jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

const setup = ({ components, onboarded = true } = {}) => {
  useQuery.mockReturnValue({
    data: [{ onboarded }]
  })
  return render(
    <AppLike>
      <MesPapiersLibProviders {...(components && { components: components })} />
    </AppLike>
  )
}

describe('MesPapiersLibProviders', () => {
  describe('If onboarding is done', () => {
    it('should display PapersFabWrapper & PapersFab', () => {
      const { getByTestId } = setup()

      expect(getByTestId('PapersFabWrapper')).toBeInTheDocument()
    })
    it('should not display PapersFabWrapper & PapersFab', () => {
      const { queryByTestId } = setup({ components: { PapersFab: null } })

      expect(queryByTestId('PapersFabWrapper')).toBeNull()
    })
  })

  describe('If the onboarding is not finished', () => {
    it('should not display PapersFabWrapper & PapersFab by default', () => {
      const { queryByTestId } = setup({ onboarded: false })

      expect(queryByTestId('PapersFabWrapper')).toBeNull()
    })
  })
})
