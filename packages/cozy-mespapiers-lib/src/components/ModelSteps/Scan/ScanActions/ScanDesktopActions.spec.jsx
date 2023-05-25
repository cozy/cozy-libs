import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'

import { useQuery, hasQueryBeenLoaded } from 'cozy-client'

import ScanDesktopActions from './ScanDesktopActions'
import AppLike from '../../../../../test/components/AppLike'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('cozy-client/dist/utils', () => ({
  ...jest.requireActual('cozy-client/dist/utils'),
  hasQueryBeenLoaded: jest.fn()
}))

const setup = ({
  onOpenFilePickerModal,
  onChangeFile,
  showScanDesktopActionsAlert,
  clientSaveFn = jest.fn(),
  isLoaded = true
} = {}) => {
  const client = { save: clientSaveFn }
  hasQueryBeenLoaded.mockReturnValue(isLoaded)
  useQuery.mockReturnValue({
    data: [
      {
        ...(showScanDesktopActionsAlert != null
          ? { showScanDesktopActionsAlert }
          : {})
      }
    ]
  })
  return render(
    <AppLike client={client}>
      <ScanDesktopActions
        onOpenFilePickerModal={
          onOpenFilePickerModal ? onOpenFilePickerModal : undefined
        }
        onChangeFile={onChangeFile ? onChangeFile : undefined}
      />
    </AppLike>
  )
}

describe('ScanDesktopActions', () => {
  it('should called onOpenFilePickerModal function', () => {
    const onOpenFilePickerModal = jest.fn()
    const { getByTestId } = setup({
      onOpenFilePickerModal
    })

    const submitButton = getByTestId('selectPicFromCozy-btn')

    fireEvent.click(submitButton)

    expect(onOpenFilePickerModal).toBeCalledTimes(1)
  })

  it('should have 1 input with type file attribute', () => {
    const { container } = setup()
    const inputFileButtons = container.querySelectorAll('input[type="file"]')

    expect(inputFileButtons).toHaveLength(1)
  })

  it('should called onChangeFileAction function', () => {
    const onChangeFileAction = jest.fn()
    const { getByTestId } = setup({
      onChangeFile: onChangeFileAction
    })

    const inputFileButton = getByTestId('importPicFromDesktop-btn')

    fireEvent.change(inputFileButton)
    expect(onChangeFileAction).toBeCalledTimes(1)
  })

  it('should display alert information if "showScanDesktopActionsAlert" is undefined', () => {
    const { getByTestId } = setup()
    const ScanDesktopActionsAlert = getByTestId('ScanDesktopActionsAlert')

    expect(ScanDesktopActionsAlert).toBeInTheDocument()
  })

  it('should display alert information if "showScanDesktopActionsAlert" is true', () => {
    const { getByTestId } = setup({ showScanDesktopActionsAlert: true })
    const ScanDesktopActionsAlert = getByTestId('ScanDesktopActionsAlert')

    expect(ScanDesktopActionsAlert).toBeInTheDocument()
  })

  it('should hide alert information if "showScanDesktopActionsAlert" is false', () => {
    const { queryByTestId } = setup({ showScanDesktopActionsAlert: false })
    const ScanDesktopActionsAlert = queryByTestId('ScanDesktopActionsAlert')

    expect(ScanDesktopActionsAlert).toBeNull()
  })

  it('should call client.save when click on "No, thanks" button', async () => {
    const clientSaveFn = jest.fn()
    const { getByText } = setup({ clientSaveFn, isLoaded: true })
    const hideButton = getByText('No, thanks')

    fireEvent.click(hideButton)

    await waitFor(() => {
      expect(clientSaveFn).toBeCalledTimes(1)
    })
  })

  it('should not call client.save when click on "No, thanks" button when settings is not loaded', async () => {
    const clientSaveFn = jest.fn()
    const { getByText } = setup({ clientSaveFn, isLoaded: false })
    const hideButton = getByText('No, thanks')

    fireEvent.click(hideButton)

    await waitFor(() => {
      expect(clientSaveFn).toBeCalledTimes(0)
    })
  })
})
