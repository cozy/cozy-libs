import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import PapersFabWrapper from './PapersFabWrapper'
import AppLike from '../../../test/components/AppLike'

/* eslint-disable react/display-name */
jest.mock('../Actions/ActionMenuWrapper', () => () => (
  <div data-testid="ActionMenuWrapper" />
))
/* eslint-enable react/display-name */
const MockChild = ({ onClick }) => (
  <button onClick={onClick} data-testid="MockChild" />
)

const setup = ({ withChild } = {}) => {
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
    const { getByTestId } = setup({ withChild: true })

    const btn = getByTestId('MockChild')
    fireEvent.click(btn)

    expect(getByTestId('ActionMenuWrapper'))
  })
})
