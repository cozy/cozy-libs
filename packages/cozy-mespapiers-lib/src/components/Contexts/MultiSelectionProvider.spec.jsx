import { fireEvent, render } from '@testing-library/react'
import React, { useContext } from 'react'

import flag from 'cozy-flags'

import MultiSelectionContext, {
  MultiSelectionProvider
} from './MultiSelectionProvider'

jest.mock('cozy-flags')

const setup = ({ filesToAdd, removeFile }) => {
  flag.mockReturnValue(true)
  const TestComponent = () => {
    const {
      isMultiSelectionActive,
      addMultiSelectionFile,
      removeMultiSelectionFile,
      removeAllMultiSelectionFiles,
      allMultiSelectionFiles,
      changeCurrentMultiSelectionFile,
      removeCurrentMultiSelectionFile,
      removeAllCurrentMultiSelectionFiles,
      confirmCurrentMultiSelectionFiles,
      currentMultiSelectionFiles
    } = useContext(MultiSelectionContext)

    return (
      <>
        <div data-testid="multiSelectionFilesState">
          {JSON.stringify(allMultiSelectionFiles)}
        </div>
        <div data-testid="currentMultiSelectionFilesState">
          {JSON.stringify(currentMultiSelectionFiles)}
        </div>
        <div data-testid="isActive">
          {JSON.stringify(isMultiSelectionActive)}
        </div>
        <button
          data-testid="addMultiSelectionBtn"
          onClick={() => addMultiSelectionFile(filesToAdd.shift())}
        />
        <button
          data-testid="removeMultiSelectionFileBtn"
          onClick={() => removeMultiSelectionFile(removeFile)}
        />
        <button
          data-testid="removeAllMultiSelectionBtn"
          onClick={() => removeAllMultiSelectionFiles()}
        />
        <button
          data-testid="changeCurrentMultiSelectionBtn"
          onClick={() => changeCurrentMultiSelectionFile(filesToAdd.shift())}
        />
        <button
          data-testid="removeCurrentMultiSelectionFileBtn"
          onClick={() => removeCurrentMultiSelectionFile(removeFile)}
        />
        <button
          data-testid="removeAllCurrentMultiSelectionBtn"
          onClick={() => removeAllCurrentMultiSelectionFiles()}
        />
        <button
          data-testid="confirmCurrentMultiSelectionFiles"
          onClick={() => confirmCurrentMultiSelectionFiles()}
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

const fileMock01 = { _id: '01', name: 'file01' }
const fileMock02 = { _id: '02', name: 'file02' }

describe('MultiSelectionProvider', () => {
  describe('isMultiSelectionActive', () => {
    it('should remove all files to its state if isMultiSelectionActive is set to false', () => {
      const { getByTestId } = setup({
        filesToAdd: [fileMock01, fileMock02]
      })

      const setActiveBtn = getByTestId('setActiveBtn')
      const addMultiSelectionBtn = getByTestId('addMultiSelectionBtn')
      const multiSelectionFilesState = getByTestId('multiSelectionFilesState')

      // isMultiSelectionActive => true
      fireEvent.click(setActiveBtn)

      fireEvent.click(addMultiSelectionBtn)
      expect(multiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"}]'
      )

      fireEvent.click(addMultiSelectionBtn)
      expect(multiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]'
      )

      // isMultiSelectionActive => false
      fireEvent.click(setActiveBtn)
      expect(multiSelectionFilesState.textContent).toBe('[]')
    })
  })

  describe('addMultiSelectionFile', () => {
    it('should add file to its state', () => {
      const { getByTestId } = setup({ filesToAdd: [fileMock01] })

      const addMultiSelectionBtn = getByTestId('addMultiSelectionBtn')
      const multiSelectionFilesState = getByTestId('multiSelectionFilesState')

      fireEvent.click(addMultiSelectionBtn)
      expect(multiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"}]'
      )
    })

    it('should add a second file to its state', () => {
      const { getByTestId } = setup({
        filesToAdd: [fileMock01, fileMock02]
      })

      const addMultiSelectionBtn = getByTestId('addMultiSelectionBtn')
      const multiSelectionFilesState = getByTestId('multiSelectionFilesState')

      fireEvent.click(addMultiSelectionBtn)
      expect(multiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"}]'
      )

      fireEvent.click(addMultiSelectionBtn)
      expect(multiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]'
      )
    })

    it('should add a second file to its state even if it is the same file', () => {
      const { getByTestId } = setup({
        filesToAdd: [fileMock01, fileMock01]
      })

      const addMultiSelectionBtn = getByTestId('addMultiSelectionBtn')
      const multiSelectionFilesState = getByTestId('multiSelectionFilesState')

      fireEvent.click(addMultiSelectionBtn)
      expect(multiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"}]'
      )

      fireEvent.click(addMultiSelectionBtn)
      expect(multiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"},{"_id":"01","name":"file01"}]'
      )
    })
  })

  describe('removeMultiSelectionFile', () => {
    it('should remove specific file to its state', () => {
      const { getByTestId } = setup({
        filesToAdd: [fileMock01, fileMock02],
        removeFile: 0
      })

      const addMultiSelectionBtn = getByTestId('addMultiSelectionBtn')
      const removeMultiSelectionFileBtn = getByTestId(
        'removeMultiSelectionFileBtn'
      )
      const multiSelectionFilesState = getByTestId('multiSelectionFilesState')

      fireEvent.click(addMultiSelectionBtn)
      fireEvent.click(addMultiSelectionBtn)
      fireEvent.click(removeMultiSelectionFileBtn)
      expect(multiSelectionFilesState.textContent).toBe(
        '[{"_id":"02","name":"file02"}]'
      )
    })
  })

  describe('removeAllMultiSelectionFiles', () => {
    it('should remove all files to its state', () => {
      const { getByTestId } = setup({
        filesToAdd: [fileMock01, fileMock02]
      })

      const addMultiSelectionBtn = getByTestId('addMultiSelectionBtn')
      const removeAllMultiSelectionBtn = getByTestId(
        'removeAllMultiSelectionBtn'
      )
      const multiSelectionFilesState = getByTestId('multiSelectionFilesState')

      fireEvent.click(addMultiSelectionBtn)
      fireEvent.click(addMultiSelectionBtn)
      fireEvent.click(removeAllMultiSelectionBtn)
      expect(multiSelectionFilesState.textContent).toBe('[]')
    })
  })

  describe('changeCurrentMultiSelectionFile', () => {
    it('should add file to its state', () => {
      const { getByTestId } = setup({ filesToAdd: [fileMock01] })

      const changeCurrentMultiSelectionBtn = getByTestId(
        'changeCurrentMultiSelectionBtn'
      )
      const currentMultiSelectionFilesState = getByTestId(
        'currentMultiSelectionFilesState'
      )

      fireEvent.click(changeCurrentMultiSelectionBtn)
      expect(currentMultiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"}]'
      )
    })

    it('should add a second file to its state', () => {
      const { getByTestId } = setup({
        filesToAdd: [fileMock01, fileMock02]
      })

      const changeCurrentMultiSelectionBtn = getByTestId(
        'changeCurrentMultiSelectionBtn'
      )
      const currentMultiSelectionFilesState = getByTestId(
        'currentMultiSelectionFilesState'
      )

      fireEvent.click(changeCurrentMultiSelectionBtn)
      expect(currentMultiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"}]'
      )

      fireEvent.click(changeCurrentMultiSelectionBtn)
      expect(currentMultiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]'
      )
    })

    it('should remove the file from its state if it was already present', () => {
      const { getByTestId } = setup({
        filesToAdd: [fileMock01, fileMock01]
      })

      const changeCurrentMultiSelectionBtn = getByTestId(
        'changeCurrentMultiSelectionBtn'
      )
      const currentMultiSelectionFilesState = getByTestId(
        'currentMultiSelectionFilesState'
      )

      fireEvent.click(changeCurrentMultiSelectionBtn)
      expect(currentMultiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"}]'
      )

      fireEvent.click(changeCurrentMultiSelectionBtn)
      expect(currentMultiSelectionFilesState.textContent).toBe('[]')
    })
  })

  describe('removeCurrentMultiSelectionFile', () => {
    it('should remove specific file to its state', () => {
      const { getByTestId } = setup({
        filesToAdd: [fileMock01, fileMock02],
        removeFile: fileMock01
      })

      const changeCurrentMultiSelectionBtn = getByTestId(
        'changeCurrentMultiSelectionBtn'
      )
      const removeCurrentMultiSelectionFileBtn = getByTestId(
        'removeCurrentMultiSelectionFileBtn'
      )
      const currentMultiSelectionFilesState = getByTestId(
        'currentMultiSelectionFilesState'
      )

      fireEvent.click(changeCurrentMultiSelectionBtn)
      fireEvent.click(changeCurrentMultiSelectionBtn)
      fireEvent.click(removeCurrentMultiSelectionFileBtn)
      expect(currentMultiSelectionFilesState.textContent).toBe(
        '[{"_id":"02","name":"file02"}]'
      )
    })
  })

  describe('removeAllCurrentMultiSelectionFiles', () => {
    it('should remove all files to its state', () => {
      const { getByTestId } = setup({
        filesToAdd: [fileMock01, fileMock02]
      })

      const changeCurrentMultiSelectionBtn = getByTestId(
        'changeCurrentMultiSelectionBtn'
      )
      const removeAllCurrentMultiSelectionBtn = getByTestId(
        'removeAllCurrentMultiSelectionBtn'
      )
      const currentMultiSelectionFilesState = getByTestId(
        'currentMultiSelectionFilesState'
      )

      fireEvent.click(changeCurrentMultiSelectionBtn)
      fireEvent.click(changeCurrentMultiSelectionBtn)
      fireEvent.click(removeAllCurrentMultiSelectionBtn)
      expect(currentMultiSelectionFilesState.textContent).toBe('[]')
    })
  })

  describe('confirmCurrentMultiSelectionFiles', () => {
    it('should move all files in currentMultiSelectionFilesState to multiSelectionFilesState', () => {
      const { getByTestId } = setup({
        filesToAdd: [fileMock01, fileMock02]
      })

      const changeCurrentMultiSelectionBtn = getByTestId(
        'changeCurrentMultiSelectionBtn'
      )
      const confirmCurrentMultiSelectionBtn = getByTestId(
        'confirmCurrentMultiSelectionFiles'
      )
      const currentMultiSelectionFilesState = getByTestId(
        'currentMultiSelectionFilesState'
      )
      const multiSelectionFilesState = getByTestId('multiSelectionFilesState')

      fireEvent.click(changeCurrentMultiSelectionBtn)
      expect(currentMultiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"}]'
      )
      expect(multiSelectionFilesState.textContent).toBe('[]')

      fireEvent.click(changeCurrentMultiSelectionBtn)
      expect(currentMultiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]'
      )
      expect(multiSelectionFilesState.textContent).toBe('[]')

      fireEvent.click(confirmCurrentMultiSelectionBtn)
      expect(currentMultiSelectionFilesState.textContent).toBe('[]')
      expect(multiSelectionFilesState.textContent).toBe(
        '[{"_id":"01","name":"file01"},{"_id":"02","name":"file02"}]'
      )
    })
  })
})
