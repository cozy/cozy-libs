import React from 'react'
import { useParams } from 'react-router-dom'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom'

import PapersFabWrapper from './PapersFabWrapper'
import AppLike from '../../../test/components/AppLike'

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ fileTheme: '' }))
  }
})

const MockChild = ({ onClick }) => (
  <button onClick={onClick} data-testid="MockChild" />
)

const setup = ({ withChild, withFileThemeParam } = {}) => {
  if (withFileThemeParam) useParams.mockReturnValue({ fileTheme: 'tax_notice' })

  return render(
    <AppLike>
      <PapersFabWrapper data-testid="PapersFabWrapper">
        {withChild && <MockChild />}
      </PapersFabWrapper>
    </AppLike>
  )
}

describe('PapersFabWrapper', () => {
  it('should not display if have not child', () => {
    const { queryByTestId } = setup({ withChild: false })

    expect(queryByTestId('PapersFabWrapper')).toBeNull()
  })

  it('should display a child', () => {
    const { getByTestId } = setup({ withChild: true })

    expect(getByTestId('MockChild'))
  })

  it('should display ActionMenuWrapper if click on child', () => {
    const { getByTestId, queryByText, getByText } = setup({ withChild: true })

    const btn = getByTestId('MockChild')
    fireEvent.click(btn)

    expect(getByText('Add a paper')).toBeInTheDocument()
    expect(getByText('Forward papers…')).toBeInTheDocument()
    expect(queryByText('Add: Tax notice')).toBeNull()
  })

  it('should display ActionMenuWrapper with additionnal action if click on child', () => {
    const { getByTestId, getByText } = setup({
      withChild: true,
      withFileThemeParam: true
    })

    const btn = getByTestId('MockChild')
    fireEvent.click(btn)

    expect(getByText('Add a paper')).toBeInTheDocument()
    expect(getByText('Forward papers…')).toBeInTheDocument()
    expect(getByText('Add: Tax notice')).toBeInTheDocument()
  })
})
