import React from 'react'
import { render, fireEvent, wait } from '@testing-library/react'
jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))

// Popper does not work well inside of jest as it heavily relies on DOM APIs (see https://github.com/popperjs/popper-core/issues/478).
jest.mock('@material-ui/core/Popper', () => {
  return ({ children }) => children
})

import DocumentCategory from './DocumentCategory'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'

describe('DocumentCategory', () => {
  it('should match snapshot if selected and icon', async () => {
    const onSelect = jest.fn()
    const { queryByText, getByText, asFragment } = render(
      <MuiCozyTheme>
        <DocumentCategory
          onSelect={onSelect}
          category={{
            icon: 'test',
            label: 'test'
          }}
          isSelected={true}
          selectedItem={{ label: 'test', id: '1' }}
          items={[
            {
              id: '1',
              label: 'Label1'
            },
            {
              id: '2',
              label: 'Label2'
            }
          ]}
          t={text => text}
        />
      </MuiCozyTheme>
    )
    expect(asFragment()).toMatchSnapshot()
    // Click on the item
    fireEvent.click(getByText('Scan.items.test'))
    expect(asFragment()).toMatchSnapshot()
    // Check if the second item is displayed in the ActionMenu
    expect(() => getByText('Scan.items.Label2')).not.toThrow()
    await wait(() => getByText('Scan.items.Label2'))

    fireEvent.click(getByText('Scan.items.Label2'))
    // Menu should not be there anymore
    expect(queryByText('Scan.items.Label2')).toBeNull()
    fireEvent.click(getByText('Scan.items.test'))
    await wait(() => getByText('Scan.items.Label2'))

    fireEvent.click(getByText('Scan.items.Label2'))
    expect(onSelect).toBeCalledWith({
      itemId: '2',
      categoryLabel: 'test'
    })
  })
})
