import React from 'react'
import { render } from '@testing-library/react'

import CategoryGridItem from './CategoryGridItem'
jest.mock('@material-ui/core/Popper', () => {
  return ({ children }) => children
})
describe('CategoryGridItem', () => {
  it('should match snapshot if selected and icon', () => {
    const { asFragment } = render(
      <CategoryGridItem
        isSelected={true}
        label={'test'}
        theme={'toto'}
        icon={'car'}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
