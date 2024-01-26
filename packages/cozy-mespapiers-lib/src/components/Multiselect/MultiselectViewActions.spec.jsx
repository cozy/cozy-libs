import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import MultiselectViewActions from './MultiselectViewActions'
import AppLike from '../../../test/components/AppLike'
import { downloadFiles, forwardFile, makeZipFolder } from '../Actions/utils'
import { useMultiSelection } from '../Hooks/useMultiSelection'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}))

jest.mock('cozy-ui/transpiled/react/providers/Breakpoints', () => ({
  ...jest.requireActual('cozy-ui/transpiled/react/providers/Breakpoints'),
  __esModule: true,
  default: jest.fn(() => ({ isMobile: false }))
}))
jest.mock('../../helpers/getFolderWithReference', () => ({
  ...jest.requireActual('../../helpers/getFolderWithReference'),
  __esModule: true,
  default: jest.fn(() => ({ _id: '' }))
}))
jest.mock('../Actions/utils', () => ({
  ...jest.requireActual('../Actions/utils'),
  downloadFiles: jest.fn(),
  forwardFile: jest.fn(),
  makeZipFolder: jest.fn()
}))
/* eslint-enable react/display-name */
jest.mock('../Hooks/useMultiSelection')
jest.mock('../../helpers/fetchCurrentUser', () => ({
  fetchCurrentUser: jest.fn(() => ({ displayName: 'Bob' }))
}))
jest.mock('copy-text-to-clipboard', () => ({ copy: jest.fn() }))

const setup = ({
  allMultiSelectionFiles = [],
  isMobile = false,
  mockDownloadFiles = jest.fn(),
  mockForwardFiles = jest.fn(),
  mockMakeZipFolder = jest.fn(),
  mockNavigate = jest.fn(),
  mockNavigatorShareFunc
} = {}) => {
  useBreakpoints.mockReturnValue({ isMobile })
  useMultiSelection.mockReturnValue({ allMultiSelectionFiles })
  downloadFiles.mockImplementation(mockDownloadFiles)
  forwardFile.mockImplementation(mockForwardFiles)
  makeZipFolder.mockImplementation(mockMakeZipFolder)
  useNavigate.mockReturnValue(mockNavigate)
  Object.defineProperty(global.navigator, 'share', {
    value: mockNavigatorShareFunc
      ? { share: mockNavigatorShareFunc }
      : undefined,
    configurable: true
  })

  return render(
    <AppLike>
      <MultiselectViewActions />
    </AppLike>
  )
}

describe('MultiselectViewActions', () => {
  describe('Forward button', () => {
    it('should display forward Button on Mobile (if supports "navigator API")', () => {
      const mockNavigatorShareFunc = jest.fn()
      const { getByRole } = setup({
        isMobile: true,
        mockNavigatorShareFunc
      })

      expect(getByRole('button', { name: 'Send…' }))
    })

    it('should not call "forwardFile" when click forward Button if there are no files', () => {
      const mockForwardFiles = jest.fn()
      const mockNavigatorShareFunc = jest.fn()
      const { getByRole } = setup({
        allMultiSelectionFiles: [],
        mockForwardFiles,
        isMobile: true,
        mockNavigatorShareFunc
      })

      const forwardBtn = getByRole('button', { name: 'Send…' })
      fireEvent.click(forwardBtn)

      expect(mockForwardFiles).toBeCalledTimes(0)
    })

    it('should call "forwardFile" when click forward Button if there are one file', async () => {
      const mockNavigate = jest.fn()
      const mockNavigatorShareFunc = jest.fn()
      const { getByRole } = setup({
        allMultiSelectionFiles: [{ _id: '00', type: 'file', name: 'File00' }],
        isMobile: true,
        mockNavigate,
        mockNavigatorShareFunc
      })

      const forwardBtn = getByRole('button', { name: 'Send…' })
      fireEvent.click(forwardBtn)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('./forward/00')
      })
    })

    it('should call "makeZipFolder" when click forward Button if there is more than one files', async () => {
      const mockNavigate = jest.fn()
      const mockMakeZipFolder = jest
        .fn()
        .mockReturnValue({ _id: '02', type: 'file', name: 'folder.zip' })
      const mockNavigatorShareFunc = jest.fn()
      const { getByRole } = setup({
        allMultiSelectionFiles: [
          { _id: '00', type: 'file', name: 'File00' },
          { _id: '01', type: 'file', name: 'File01' }
        ],
        mockMakeZipFolder,
        isMobile: true,
        mockNavigate,
        mockNavigatorShareFunc
      })

      const forwardBtn = getByRole('button', { name: 'Send…' })
      fireEvent.click(forwardBtn)

      await waitFor(() => {
        expect(mockMakeZipFolder).toBeCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith('./forward/02')
      })
    })
  })
})
