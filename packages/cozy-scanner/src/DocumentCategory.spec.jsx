import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff',
  getInvertedCssVariableValue: () => '#fff'
}))

// Popper does not work well inside of jest as it heavily relies on DOM APIs (see https://github.com/popperjs/popper-core/issues/478).
jest.mock('@material-ui/core/Popper', () => {
  return ({ children }) => children
})

import DocumentCategory from './DocumentCategory'

describe('DocumentCategory', () => {
  it('should match snapshot if selected and icon', async () => {
    const onSelect = jest.fn()
    const { queryByText, getByText, asFragment } = render(
      <BreakpointsProvider>
        <MuiCozyTheme>
          <DocumentCategory
            onSelect={onSelect}
            category={{
              icon: 'test',
              label: 'test',
              items: [
                {
                  label: 'Label1'
                },
                {
                  label: 'Label2'
                }
              ]
            }}
            isSelected={true}
            selectedItem={{ label: 'test' }}
            scannerT={text => text}
          />
        </MuiCozyTheme>
      </BreakpointsProvider>
    )
    expect(asFragment()).toMatchSnapshot()
    // Click on the item
    fireEvent.click(getByText('Scan.items.test'))
    expect(asFragment()).toMatchSnapshot()
    // Check if the second item is displayed in the ActionMenu
    expect(() => getByText('Scan.items.Label2')).not.toThrow()
    await waitFor(() => getByText('Scan.items.Label2'))

    fireEvent.click(getByText('Scan.items.Label2'))
    // Menu should not be there anymore
    expect(queryByText('Scan.items.Label2')).toBeNull()
    fireEvent.click(getByText('Scan.items.test'))
    await waitFor(() => getByText('Scan.items.Label2'))

    fireEvent.click(getByText('Scan.items.Label2'))
    expect(onSelect).toBeCalledWith({
      item: {
        label: 'Label2'
      },
      categoryLabel: 'test'
    })
  })
})
