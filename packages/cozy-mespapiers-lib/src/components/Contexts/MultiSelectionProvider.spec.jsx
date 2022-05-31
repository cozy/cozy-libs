import React, { useContext } from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom'

import MultiSelectionContext, {
  MultiSelectionProvider
} from './MultiSelectionProvider'

const setup = ({ firstAdd, secondAdd, removeFile }) => {
  const TestComponent = () => {
    const {
      isMultiSelectionActive,
      setIsMultiSelectionActive,
      addMultiSelectionFile,
      removeMultiSelectionFile,
      removeAllMultiSelectionFiles,
      multiSelectionFiles
    } = useContext(MultiSelectionContext)

    return (
      <>
        <div data-testid="result">{JSON.stringify(multiSelectionFiles)}</div>
        <div data-testid="isActive">
          {JSON.stringify(isMultiSelectionActive)}
        </div>
        <button
          data-testid="setActiveBtn"
          onClick={() => setIsMultiSelectionActive(prev => !prev)}
        />
        <button
          data-testid="firstAddBtn"
          onClick={() => addMultiSelectionFile(firstAdd)}
        />
        <button
          data-testid="secondAddBtn"
          onClick={() => addMultiSelectionFile(secondAdd)}
        />
        <button
          data-testid="removeFileBtn"
          onClick={() => removeMultiSelectionFile(removeFile)}
        />
        <button
          data-testid="removeAllBtn"
          onClick={() => removeAllMultiSelectionFiles()}
        />
      </>
    )
  }

  return render(
    <MultiSelectionProvider>
      <TestComponent />
    </MultiSelectionProvider>
  )
}

describe('MultiSelectionProvider', () => {
  describe('isMultiSelectionActive', () => {
    it('should remove all files to its state if isMultiSelectionActive is set to false', () => {
      const fileMock01 = { _id: '01', name: 'file01' }
      const fileMock02 = { _id: '02', name: 'file02' }
      const { getByTestId } = setup({
        firstAdd: fileMock01,
        secondAdd: fileMock02
      })

      const setActiveBtn = getByTestId('setActiveBtn')
      const firstAddBtn = getByTestId('firstAddBtn')
      const secondAddBtn = getByTestId('secondAddBtn')
      const result = getByTestId('result')

      // isMultiSelectionActive => true
      fireEvent.click(setActiveBtn)

      fireEvent.click(firstAddBtn)
      expect(result.textContent).toBe('[{"_id":"01","name":"file01"}]')

      fireEvent.click(secondAddBtn)
      expect(result.textContent).toBe(
        '[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]'
      )

      // isMultiSelectionActive => false
      fireEvent.click(setActiveBtn)
      expect(result.textContent).toBe('[]')
    })
  })

  describe('addMultiSelectionFile', () => {
    it('should add file to its state', () => {
      const fileMock = { _id: '00', name: 'file00' }
      const { getByTestId } = setup({ firstAdd: fileMock })

      const firstAddBtn = getByTestId('firstAddBtn')
      const result = getByTestId('result')

      fireEvent.click(firstAddBtn)
      expect(result.textContent).toBe('[{"_id":"00","name":"file00"}]')
    })

    it('should add a second file to its state', () => {
      const fileMock01 = { _id: '01', name: 'file01' }
      const fileMock02 = { _id: '02', name: 'file02' }
      const { getByTestId } = setup({
        firstAdd: fileMock01,
        secondAdd: fileMock02
      })

      const firstAddBtn = getByTestId('firstAddBtn')
      const secondAddBtn = getByTestId('secondAddBtn')
      const result = getByTestId('result')

      fireEvent.click(firstAddBtn)
      expect(result.textContent).toBe('[{"_id":"01","name":"file01"}]')

      fireEvent.click(secondAddBtn)
      expect(result.textContent).toBe(
        '[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]'
      )
    })

    it('should not add a second file to its state if it is the same file', () => {
      const fileMock01 = { _id: '01', name: 'file01' }
      const { getByTestId } = setup({
        firstAdd: fileMock01,
        secondAdd: fileMock01
      })

      const firstAddBtn = getByTestId('firstAddBtn')
      const secondAddBtn = getByTestId('secondAddBtn')
      const result = getByTestId('result')

      fireEvent.click(firstAddBtn)
      expect(result.textContent).toBe('[{"_id":"01","name":"file01"}]')

      fireEvent.click(secondAddBtn)
      expect(result.textContent).toBe('[{"_id":"01","name":"file01"}]')
    })
  })

  describe('removeMultiSelectionFile', () => {
    it('should remove specific file to its state', () => {
      const fileMock01 = { _id: '01', name: 'file01' }
      const fileMock02 = { _id: '02', name: 'file02' }
      const { getByTestId } = setup({
        firstAdd: fileMock01,
        secondAdd: fileMock02,
        removeFile: fileMock01
      })

      const firstAddBtn = getByTestId('firstAddBtn')
      const secondAddBtn = getByTestId('secondAddBtn')
      const removeFileBtn = getByTestId('removeFileBtn')
      const result = getByTestId('result')

      fireEvent.click(firstAddBtn)
      fireEvent.click(secondAddBtn)
      fireEvent.click(removeFileBtn)
      expect(result.textContent).toBe('[{"_id":"02","name":"file02"}]')
    })
  })

  describe('removeAllMultiSelectionFiles', () => {
    it('should remove all files to its state', () => {
      const fileMock01 = { _id: '01', name: 'file01' }
      const fileMock02 = { _id: '02', name: 'file02' }
      const { getByTestId } = setup({
        firstAdd: fileMock01,
        secondAdd: fileMock02,
        removeFile: fileMock01
      })

      const firstAddBtn = getByTestId('firstAddBtn')
      const secondAddBtn = getByTestId('secondAddBtn')
      const removeAllBtn = getByTestId('removeAllBtn')
      const result = getByTestId('result')

      fireEvent.click(firstAddBtn)
      fireEvent.click(secondAddBtn)
      fireEvent.click(removeAllBtn)
      expect(result.textContent).toBe('[]')
    })
  })
})
