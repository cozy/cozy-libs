import React from 'react'
import { render, fireEvent } from '@testing-library/react'
jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))
import DocumentCategory from './DocumentCategory'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'

describe('DocumentCategory', () => {
  it('should match snapshot if selected and icon', () => {
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
    //Click on the item
    fireEvent.click(getByText('Scan.items.test'))
    expect(asFragment()).toMatchSnapshot()
    //Check if the second item is displayed in the ActionMenu
    expect(getByText('Scan.items.Label2'))
    fireEvent.click(getByText('Scan.items.Label2'))
    //Menu should not be there anymore
    expect(queryByText('Scan.items.Label2')).toBeNull()
    fireEvent.click(getByText('Scan.items.test'))
    fireEvent.click(getByText('Scan.items.Label2'))
    expect(onSelect).toBeCalledWith({
      itemId: '2',
      categoryLabel: 'test'
    })
  })
})
