import React from 'react'
import { render } from '@testing-library/react'

import MultiselectContente from './MultiselectContent'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import AppLike from '../../../test/components/AppLike'

/* eslint-disable react/display-name */
jest.mock('../Papers/PaperCardItem', () => () => (
  <div data-testid="PaperCardItem" />
))
jest.mock('cozy-ui/transpiled/react/Empty', () => () => (
  <div data-testid="Empty" />
))
/* eslint-enable react/display-name */
jest.mock('../Hooks/useMultiSelection')

const setup = ({ multiSelectionFiles }) => {
  useMultiSelection.mockReturnValue({ multiSelectionFiles })

  return render(
    <AppLike>
      <MultiselectContente />
    </AppLike>
  )
}

describe('MultiselectContent', () => {
  it('should display Empty when no files are selected', () => {
    const { getByTestId, queryByTestId } = setup({ multiSelectionFiles: [] })

    expect(getByTestId('Empty'))
    expect(queryByTestId('PaperCardItem')).toBeNull()
  })

  it('should display PaperCardItem when files are selected', () => {
    const { getByTestId, queryByTestId } = setup({
      multiSelectionFiles: [{ _id: '123' }]
    })

    expect(getByTestId('PaperCardItem'))
    expect(queryByTestId('Empty')).toBeNull()
  })
})
