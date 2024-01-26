import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import { useLocation } from 'react-router-dom'

import flag from 'cozy-flags'

import { MultiSelectionProvider } from './MultiSelectionProvider'
import { useMultiSelection } from '../Hooks/useMultiSelection'

jest.mock('cozy-flags')
jest.mock('react-router-dom')

const setup = () => {
  flag.mockReturnValue(true)

  useLocation.mockReturnValue({ pathname: '/files/multiselect' })

  const wrapper = ({ children }) => (
    <MultiSelectionProvider>{children}</MultiSelectionProvider>
  )

  return renderHook(() => useMultiSelection(), {
    wrapper
  })
}

const fileMock01 = { _id: '01', name: 'file01' }
const fileMock02 = { _id: '02', name: 'file02' }

describe('MultiSelectionProvider', () => {
  describe('isMultiSelectionActive', () => {
    it('should remove all files to its state if isMultiSelectionActive is set to false', () => {
      const { result, rerender } = setup()

      act(() => {
        result.current.addMultiSelectionFile(fileMock01)
      })

      expect(result.current.allMultiSelectionFiles).toEqual([fileMock01])

      // isMultiSelectionActive => false
      useLocation.mockReturnValue({ pathname: '/paper' })

      rerender()

      expect(result.current.allMultiSelectionFiles).toEqual([])
    })
  })

  describe('addMultiSelectionFile', () => {
    it('should add file to its state', () => {
      const { result } = setup()

      act(() => {
        result.current.addMultiSelectionFile(fileMock01)
      })

      expect(result.current.allMultiSelectionFiles).toEqual([fileMock01])
    })

    it('should add a second file to its state', () => {
      const { result } = setup()

      act(() => {
        result.current.addMultiSelectionFile(fileMock01)
      })

      act(() => {
        result.current.addMultiSelectionFile(fileMock02)
      })

      expect(result.current.allMultiSelectionFiles).toEqual([
        fileMock01,
        fileMock02
      ])
    })

    it('should add a second file to its state even if it is the same file', () => {
      const { result } = setup()

      act(() => {
        result.current.addMultiSelectionFile(fileMock01)
      })

      act(() => {
        result.current.addMultiSelectionFile(fileMock01)
      })

      expect(result.current.allMultiSelectionFiles).toEqual([
        fileMock01,
        fileMock01
      ])
    })
  })

  describe('removeMultiSelectionFile', () => {
    it('should remove specific file to its state', () => {
      const { result } = setup()

      act(() => {
        result.current.addMultiSelectionFile(fileMock01)
      })

      act(() => {
        result.current.addMultiSelectionFile(fileMock02)
      })

      act(() => {
        result.current.removeMultiSelectionFile(0)
      })

      expect(result.current.allMultiSelectionFiles).toEqual([fileMock02])
    })
  })

  describe('removeAllMultiSelectionFiles', () => {
    it('should remove all files to its state', () => {
      const { result } = setup()

      act(() => {
        result.current.addMultiSelectionFile(fileMock01)
      })

      act(() => {
        result.current.addMultiSelectionFile(fileMock02)
      })

      act(() => {
        result.current.removeAllMultiSelectionFiles(fileMock01)
      })

      expect(result.current.allMultiSelectionFiles).toEqual([])
    })
  })

  describe('changeCurrentMultiSelectionFile', () => {
    it('should add file to its state', () => {
      const { result } = setup()

      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock01)
      })

      expect(result.current.currentMultiSelectionFiles).toEqual([fileMock01])
    })

    it('should add a second file to its state', () => {
      const { result } = setup()

      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock01)
      })

      expect(result.current.currentMultiSelectionFiles).toEqual([fileMock01])

      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock02)
      })

      expect(result.current.currentMultiSelectionFiles).toEqual([
        fileMock01,
        fileMock02
      ])
    })

    it('should remove the file from its state if it was already present', () => {
      const { result } = setup()

      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock01)
      })

      expect(result.current.currentMultiSelectionFiles).toEqual([fileMock01])

      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock01)
      })

      expect(result.current.currentMultiSelectionFiles).toEqual([])
    })
  })

  describe('removeCurrentMultiSelectionFile', () => {
    it('should remove specific file to its state', () => {
      const { result } = setup()

      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock01)
      })

      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock02)
      })

      act(() => {
        result.current.removeCurrentMultiSelectionFile(fileMock01)
      })

      expect(result.current.currentMultiSelectionFiles).toEqual([fileMock02])
    })
  })

  describe('removeAllCurrentMultiSelectionFiles', () => {
    it('should remove all files to its state', () => {
      const { result } = setup()

      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock01)
      })

      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock02)
      })

      act(() => {
        result.current.removeAllCurrentMultiSelectionFiles()
      })

      expect(result.current.currentMultiSelectionFiles).toEqual([])
    })
  })

  describe('confirmCurrentMultiSelectionFiles', () => {
    it('should move all files in currentMultiSelectionFilesState to multiSelectionFilesState', () => {
      const { result } = setup()

      // add first file to current selection
      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock01)
      })
      expect(result.current.currentMultiSelectionFiles).toEqual([fileMock01])
      expect(result.current.allMultiSelectionFiles).toEqual([])

      // add second file to current selection
      act(() => {
        result.current.changeCurrentMultiSelectionFile(fileMock02)
      })
      expect(result.current.currentMultiSelectionFiles).toEqual([
        fileMock01,
        fileMock02
      ])
      expect(result.current.allMultiSelectionFiles).toEqual([])

      // confirm current selection
      act(() => {
        result.current.confirmCurrentMultiSelectionFiles(fileMock02)
      })
      expect(result.current.currentMultiSelectionFiles).toEqual([])
      expect(result.current.allMultiSelectionFiles).toEqual([
        fileMock01,
        fileMock02
      ])
    })
  })
})
