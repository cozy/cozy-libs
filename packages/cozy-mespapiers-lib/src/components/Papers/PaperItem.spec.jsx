import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import PaperItem from './PaperItem'
import AppLike from '../../../test/components/AppLike'
import { useMultiSelection } from '../Hooks/useMultiSelection'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}))
jest.mock('../Hooks/useMultiSelection')
const mockFile = {
  _id: 'fileId01',
  name: 'file01.pdf',
  metadata: {
    datetime: '2022-01-01T09:00:00.000Z',
    qualification: { page: 'Front', label: 'file01 - Qualification label' }
  },
  relationships: {
    referenced_by: { data: [{ id: 'contactId01', type: 'io.cozy.contacts' }] }
  }
}
const MockChildren = () => <div data-testid="MockChildren" />

const setup = ({
  paper = mockFile,
  contactNames,
  hasDivider,
  withCheckbox,
  withChildren,
  allMultiSelectionFiles = [],
  isMultiSelectionActive = false,
  currentMultiSelectionFiles = [],
  changeCurrentMultiSelectionFile = jest.fn(),
  mockNav = jest.fn()
} = {}) => {
  useMultiSelection.mockReturnValue({
    allMultiSelectionFiles,
    isMultiSelectionActive,
    currentMultiSelectionFiles,
    changeCurrentMultiSelectionFile
  })
  useNavigate.mockReturnValue(mockNav)

  return render(
    <AppLike>
      <PaperItem
        paper={paper}
        contactNames={contactNames}
        hasDivider={hasDivider}
        withCheckbox={withCheckbox}
      >
        {withChildren && <MockChildren />}
      </PaperItem>
    </AppLike>
  )
}

describe('PaperItem components', () => {
  describe('ListItemSecondaryAction', () => {
    it('should not display if have not children', () => {
      const { queryByTestId } = setup()

      expect(queryByTestId('ListItemSecondaryAction')).toBeNull()
    })
    it('should display if have a children', () => {
      const { getByTestId } = setup({ withChildren: true })

      expect(getByTestId('ListItemSecondaryAction'))
    })
  })

  describe('Divider', () => {
    it('should not display by default', () => {
      const { queryByTestId } = setup()

      expect(queryByTestId('Divider')).toBeNull()
    })
    it('should display if divider prop is true', () => {
      const { getByTestId } = setup({ hasDivider: true })

      expect(getByTestId('Divider'))
    })
  })

  describe('Checkbox', () => {
    it('should not display by default', () => {
      const { queryByTestId } = setup()

      expect(queryByTestId('Checkbox')).toBeNull()
    })
    it('should not display when is not on multiselection context & withCheckbox prop is true', () => {
      const { queryByTestId } = setup({
        isMultiSelectionActive: false,
        withCheckbox: true
      })

      expect(queryByTestId('Checkbox')).toBeNull()
    })
    it('should not display when is on multiselection context & withCheckbox prop is false', () => {
      const { queryByTestId } = setup({
        isMultiSelectionActive: true,
        withCheckbox: false
      })

      expect(queryByTestId('Checkbox')).toBeNull()
    })
    it('should display when is on multiselection context & withCheckbox prop is true', () => {
      const { getByTestId } = setup({
        isMultiSelectionActive: true,
        withCheckbox: true
      })

      expect(getByTestId('Checkbox'))
    })
    it('should already checked if is in currentMultiSelectionFiles', () => {
      const { container } = setup({
        isMultiSelectionActive: true,
        withCheckbox: true,
        currentMultiSelectionFiles: [{ _id: 'fileId01' }]
      })

      const inputCheckbox = container.querySelector('input[type="checkbox"]')

      expect(inputCheckbox).toHaveAttribute('checked')
    })
    it('should already checked & disabled if is in allMultiSelectionFiles', () => {
      const { container } = setup({
        isMultiSelectionActive: true,
        withCheckbox: true,
        allMultiSelectionFiles: [{ _id: 'fileId01' }]
      })

      const inputCheckbox = container.querySelector('input[type="checkbox"]')

      expect(inputCheckbox).toHaveAttribute('checked')
      expect(inputCheckbox).toHaveAttribute('disabled')
    })
  })

  describe('ListItemText', () => {
    it('should display only date by default', () => {
      const { getByText } = setup()

      expect(getByText('01/01/2022'))
    })
    it('should display names & date when contactNames exists', () => {
      const { getByText } = setup({ contactNames: 'Bob, Charlie' })

      expect(getByText('Bob, Charlie · 01/01/2022'))
    })
  })

  describe('handleClick', () => {
    it('should call "history.push" by default', () => {
      const mockNav = jest.fn()
      const { getByTestId } = setup({ mockNav })

      fireEvent.click(getByTestId('ListItem'))

      expect(mockNav).toBeCalledTimes(1)
    })
    it('should call "history.push" one time when withCheckbox is true & is not on multiselection context', () => {
      const mockNav = jest.fn()
      const changeCurrentMultiSelectionFile = jest.fn()
      const { getByTestId } = setup({
        withCheckbox: true,
        mockNav,
        changeCurrentMultiSelectionFile
      })

      fireEvent.click(getByTestId('ListItem'))

      expect(mockNav).toBeCalledTimes(1)
      expect(changeCurrentMultiSelectionFile).toBeCalledTimes(0)
    })
    it('should call "changeCurrentMultiSelectionFile" one time when withCheckbox is true & is on multiselection context', () => {
      const mockNav = jest.fn()
      const changeCurrentMultiSelectionFile = jest.fn()
      const { getByTestId } = setup({
        withCheckbox: true,
        isMultiSelectionActive: true,
        mockNav,
        changeCurrentMultiSelectionFile
      })

      fireEvent.click(getByTestId('ListItem'))

      expect(mockNav).toBeCalledTimes(0)
      expect(changeCurrentMultiSelectionFile).toBeCalledTimes(1)
    })
    it('should not call "handleClick" when withCheckbox is true & is on multiselection context but the file is already in allMultiSelectionFiles', () => {
      const mockNav = jest.fn()
      const changeCurrentMultiSelectionFile = jest.fn()
      const { getByTestId } = setup({
        withCheckbox: true,
        isMultiSelectionActive: true,
        mockNav,
        changeCurrentMultiSelectionFile,
        allMultiSelectionFiles: [{ _id: 'fileId01' }]
      })

      fireEvent.click(getByTestId('ListItem'))

      expect(mockNav).toBeCalledTimes(0)
      expect(changeCurrentMultiSelectionFile).toBeCalledTimes(0)
    })
  })
})
