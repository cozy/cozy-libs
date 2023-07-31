import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import MultiselectViewActions from './MultiselectViewActions'
import AppLike from '../../../test/components/AppLike'
import { downloadFiles, forwardFile, makeZipFolder } from '../Actions/utils'
import { useMultiSelection } from '../Hooks/useMultiSelection'

jest.mock('cozy-ui/transpiled/react/hooks/useBreakpoints', () => ({
  ...jest.requireActual('cozy-ui/transpiled/react/hooks/useBreakpoints'),
  __esModule: true,
  default: jest.fn(() => ({ isMobile: false }))
}))
jest.mock('../../helpers/getFolderWithReference', () => ({
  ...jest.requireActual('../../helpers/getFolderWithReference'),
  __esModule: true,
  default: jest.fn(() => ({ _id: '' }))
}))
/* eslint-disable react/display-name */
jest.mock('./ForwardModal', () => () => <div data-testid="ForwardModal" />)
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
  onClose = jest.fn(),
  mockDownloadFiles = jest.fn(),
  mockForwardFiles = jest.fn(),
  mockMakeZipFolder = jest.fn(),
  mockNavigatorShareFunc
} = {}) => {
  useBreakpoints.mockReturnValue({ isMobile })
  useMultiSelection.mockReturnValue({ allMultiSelectionFiles })
  downloadFiles.mockImplementation(mockDownloadFiles)
  forwardFile.mockImplementation(mockForwardFiles)
  makeZipFolder.mockImplementation(mockMakeZipFolder)
  Object.defineProperty(global.navigator, 'share', {
    value: mockNavigatorShareFunc
      ? { share: mockNavigatorShareFunc }
      : undefined,
    configurable: true
  })

  return render(
    <AppLike>
      <MultiselectViewActions onClose={onClose} />
    </AppLike>
  )
}

describe('MultiselectContent', () => {
  it('should not display ForwardModal by default', () => {
    const { queryByTestId } = setup()

    expect(queryByTestId('ForwardModal')).toBeNull()
  })

  describe('Download button', () => {
    it('should not display download Button on Mobile (if supports "navigator API")', () => {
      const mockNavigatorShareFunc = jest.fn()
      const { queryByTestId } = setup({
        isMobile: true,
        mockNavigatorShareFunc
      })

      expect(queryByTestId('downloadButton')).toBeNull()
    })
    it('should display download Button on Desktop', () => {
      const { getByTestId } = setup({ isMobile: false })

      expect(getByTestId('downloadButton'))
    })
    it('should display download Button on Mobile if not supports "navigator API"', () => {
      const { getByTestId } = setup({
        isMobile: true,
        mockNavigatorShareFunc: undefined
      })

      expect(getByTestId('downloadButton'))
    })

    it('should not call "downloadFiles" when click download Button if there are no files', () => {
      const mockDownloadFiles = jest.fn()
      const { getByTestId } = setup({
        allMultiSelectionFiles: [],
        mockDownloadFiles
      })

      const downloadBtn = getByTestId('downloadButton')
      fireEvent.click(downloadBtn)

      expect(mockDownloadFiles).toBeCalledTimes(0)
    })
    it('should call "downloadFiles" when click download Button if there are one or more files', () => {
      const mockDownloadFiles = jest.fn()
      const { getByTestId } = setup({
        allMultiSelectionFiles: [{ _id: '00', name: 'File00' }],
        mockDownloadFiles
      })

      const downloadBtn = getByTestId('downloadButton')
      fireEvent.click(downloadBtn)

      expect(mockDownloadFiles).toBeCalledTimes(1)
    })
  })

  describe('Forward button', () => {
    it('should display forward Button on Mobile (if supports "navigator API")', () => {
      const mockNavigatorShareFunc = jest.fn()
      const { getByTestId } = setup({
        isMobile: true,
        mockNavigatorShareFunc
      })

      expect(getByTestId('forwardButton'))
    })
    it('should not display forward Button on Desktop', () => {
      const { queryByTestId } = setup({ isMobile: false })

      expect(queryByTestId('forwardButton')).toBeNull()
    })
    it('should not display forward Button on Mobile if not supports "navigator API"', () => {
      const { queryByTestId } = setup({
        isMobile: true,
        mockNavigatorShareFunc: undefined
      })

      expect(queryByTestId('forwardButton')).toBeNull()
    })

    it('should not call "forwardFile" when click forward Button if there are no files', () => {
      const mockForwardFiles = jest.fn()
      const mockNavigatorShareFunc = jest.fn()
      const { getByTestId } = setup({
        allMultiSelectionFiles: [],
        mockForwardFiles,
        isMobile: true,
        mockNavigatorShareFunc
      })

      const forwardBtn = getByTestId('forwardButton')
      fireEvent.click(forwardBtn)

      expect(mockForwardFiles).toBeCalledTimes(0)
    })
    it('should call "forwardFile" when click forward Button if there are one file', () => {
      const mockForwardFiles = jest.fn()
      const mockNavigatorShareFunc = jest.fn()
      const { getByTestId } = setup({
        allMultiSelectionFiles: [{ _id: '00', name: 'File00' }],
        mockForwardFiles,
        isMobile: true,
        mockNavigatorShareFunc
      })

      const forwardBtn = getByTestId('forwardButton')
      fireEvent.click(forwardBtn)

      expect(mockForwardFiles).toBeCalledTimes(1)
    })
    it('should call "onClose" after "forwardFile" when click forward Button if there are one file', async () => {
      const mockOnClose = jest.fn()
      const mockForwardFiles = jest.fn()
      const mockNavigatorShareFunc = jest.fn()
      const { getByTestId } = setup({
        allMultiSelectionFiles: [{ _id: '00', name: 'File00' }],
        mockForwardFiles,
        isMobile: true,
        mockNavigatorShareFunc,
        onClose: mockOnClose
      })

      const forwardBtn = getByTestId('forwardButton')
      fireEvent.click(forwardBtn)

      expect(mockOnClose).toBeCalledTimes(0)
      expect(mockForwardFiles).toBeCalledTimes(1)
      await waitFor(() => {
        expect(mockOnClose).toBeCalledTimes(1)
      })
    })

    it('should call "makeZipFolder" when click forward Button if there is more than one files', async () => {
      const mockMakeZipFolder = jest.fn()
      const mockNavigatorShareFunc = jest.fn()
      const { getByTestId } = setup({
        allMultiSelectionFiles: [
          { _id: '00', name: 'File00' },
          { _id: '01', name: 'File01' }
        ],
        mockMakeZipFolder,
        isMobile: true,
        mockNavigatorShareFunc
      })

      const forwardBtn = getByTestId('forwardButton')
      fireEvent.click(forwardBtn)

      await waitFor(() => {
        expect(mockMakeZipFolder).toBeCalledTimes(1)
      })
    })
  })
})
