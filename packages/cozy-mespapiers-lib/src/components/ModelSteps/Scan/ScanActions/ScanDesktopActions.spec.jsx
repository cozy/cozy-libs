import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { StepperDialogProvider } from 'components/Contexts/StepperDialogProvider'
import React from 'react'

import { useQuery, hasQueryBeenLoaded } from 'cozy-client'
import flag from 'cozy-flags'

import ScanDesktopActions from './ScanDesktopActions'
import AppLike from '../../../../../test/components/AppLike'

jest.mock('cozy-flags')
jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('cozy-client/dist/utils', () => ({
  ...jest.requireActual('cozy-client/dist/utils'),
  hasQueryBeenLoaded: jest.fn()
}))
// Allow to pass 'isReady' in StepperDialogProvider
jest.mock('../../../../helpers/findPlaceholders', () => ({
  findPlaceholderByLabelAndCountry: arg => arg
}))

const setup = ({
  onOpenFilePickerModal,
  onChangeFile,
  showScanDesktopActionsAlert,
  clientSaveFn = jest.fn(),
  isLoaded = true,
  flagEnabled = false
} = {}) => {
  const client = { save: clientSaveFn }
  flag.mockReturnValue(flagEnabled)
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
      <StepperDialogProvider>
        <ScanDesktopActions
          onOpenFilePickerModal={
            onOpenFilePickerModal ? onOpenFilePickerModal : undefined
          }
          onChangeFile={onChangeFile ? onChangeFile : undefined}
        />
      </StepperDialogProvider>
    </AppLike>
  )
}

describe('ScanDesktopActions', () => {
  it('should called onOpenFilePickerModal function', async () => {
    const onOpenFilePickerModal = jest.fn()
    const { getByTestId } = setup({
      flagEnabled: true,
      onOpenFilePickerModal
    })

    await waitFor(() => {
      const submitButton = getByTestId('selectPicFromCozy-btn')

      fireEvent.click(submitButton)

      expect(onOpenFilePickerModal).toBeCalledTimes(1)
    })
  })

  it('should have 1 input with type file attribute', async () => {
    const { container } = setup()

    await waitFor(() => {
      const inputFileButtons = container.querySelectorAll('input[type="file"]')

      expect(inputFileButtons).toHaveLength(1)
    })
  })

  it('should called onChangeFileAction function', async () => {
    const onChangeFileAction = jest.fn()
    const { getByTestId } = setup({
      flagEnabled: true,
      onChangeFile: onChangeFileAction
    })

    await waitFor(() => {
      const inputFileButton = getByTestId('importPicFromDesktop-btn')

      fireEvent.change(inputFileButton)
      expect(onChangeFileAction).toBeCalledTimes(1)
    })
  })

  it('should display alert information if "showScanDesktopActionsAlert" is undefined', async () => {
    const { getByTestId } = setup()

    await waitFor(() => {
      const ScanDesktopActionsAlert = getByTestId('ScanDesktopActionsAlert')

      expect(ScanDesktopActionsAlert).toBeInTheDocument()
    })
  })

  it('should display alert information if "showScanDesktopActionsAlert" is true', async () => {
    const { getByTestId } = setup({ showScanDesktopActionsAlert: true })

    await waitFor(() => {
      const ScanDesktopActionsAlert = getByTestId('ScanDesktopActionsAlert')

      expect(ScanDesktopActionsAlert).toBeInTheDocument()
    })
  })

  it('should hide alert information if "showScanDesktopActionsAlert" is false', async () => {
    const { queryByTestId } = setup({ showScanDesktopActionsAlert: false })

    await waitFor(() => {
      const ScanDesktopActionsAlert = queryByTestId('ScanDesktopActionsAlert')

      expect(ScanDesktopActionsAlert).toBeNull()
    })
  })

  it('should call client.save when click on "No, thanks" button', async () => {
    const clientSaveFn = jest.fn()
    const { getByText } = setup({ clientSaveFn, isLoaded: true })
    await waitFor(() => {
      const hideButton = getByText('No, thanks')

      fireEvent.click(hideButton)

      expect(clientSaveFn).toBeCalledTimes(1)
    })
  })

  it('should not call client.save when click on "No, thanks" button when settings is not loaded', async () => {
    const clientSaveFn = jest.fn()
    const { getByText } = setup({ clientSaveFn, isLoaded: false })
    await waitFor(() => {
      const hideButton = getByText('No, thanks')

      fireEvent.click(hideButton)

      expect(clientSaveFn).toBeCalledTimes(0)
    })
  })

  it('should hide alert information if context flag is true', async () => {
    const { queryByTestId } = setup({ flagEnabled: true })

    await waitFor(() => {
      const ScanDesktopActionsAlert = queryByTestId('ScanDesktopActionsAlert')

      expect(ScanDesktopActionsAlert).toBeNull()
    })
  })

  it('should display alert information if context flag is false', async () => {
    const { getByTestId } = setup({ flagEnabled: false })

    await waitFor(() => {
      const ScanDesktopActionsAlert = getByTestId('ScanDesktopActionsAlert')

      expect(ScanDesktopActionsAlert).toBeInTheDocument()
    })
  })
})
