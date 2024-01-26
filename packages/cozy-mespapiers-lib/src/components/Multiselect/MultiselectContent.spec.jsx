import { render } from '@testing-library/react'
import React from 'react'

import MultiselectContent from './MultiselectContent'
import AppLike from '../../../test/components/AppLike'
import { useMultiSelection } from '../Hooks/useMultiSelection'

/* eslint-disable react/display-name */
jest.mock('../Papers/PaperCardItem', () => () => (
  <div data-testid="PaperCardItem" />
))
jest.mock('cozy-ui/transpiled/react/Empty', () => () => (
  <div data-testid="Empty" />
))
/* eslint-enable react/display-name */
jest.mock('../Hooks/useMultiSelection')

const setup = ({ allMultiSelectionFiles }) => {
  useMultiSelection.mockReturnValue({ allMultiSelectionFiles })

  return render(
    <AppLike>
      <MultiselectContent />
    </AppLike>
  )
}

describe('MultiselectContent', () => {
  it('should not display PaperCardItem when no files are selected', () => {
    const { queryByTestId } = setup({ allMultiSelectionFiles: [] })

    expect(queryByTestId('PaperCardItem')).toBeNull()
  })

  it('should display PaperCardItem when files are selected', () => {
    const { getByTestId } = setup({
      allMultiSelectionFiles: [{ _id: '123' }]
    })

    expect(getByTestId('PaperCardItem'))
  })
})
