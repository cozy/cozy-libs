import React from 'react'
import { render } from '@testing-library/react'

import CategoryGridItem from './CategoryGridItem'

describe('CategoryGridItem', () => {
  it('should match snapshot if selected and icon', () => {
    const comp = render(
      <CategoryGridItem
        isSelected={true}
        label={'test'}
        theme={'toto'}
        icon={'car'}
      />
    )
    expect(comp).toMatchSnapshot()
  })
})
