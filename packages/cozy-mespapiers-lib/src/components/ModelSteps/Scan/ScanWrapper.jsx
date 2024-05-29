import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useClient, models } from 'cozy-client'
import { useWebviewIntent } from 'cozy-intent'
import minilog from 'cozy-minilog'
import FilePicker from 'cozy-ui/transpiled/react/FilePicker'

import ScanDialog from './ScanDialog'
import { PaperDefinitionsStepPropTypes } from '../../../constants/PaperDefinitionsPropTypes'
import { FLAGSHIP_SCAN_TEMP_FILENAME } from '../../../constants/const'
import { makeFileFromBlob } from '../../../helpers/makeFileFromBlob'
import {
  storeCreatePaperDataBackup,
  removeCreatePaperDataBackup
} from '../../../helpers/paperDataBackup'
import { useFormData } from '../../Hooks/useFormData'
import { useStepperDialog } from '../../Hooks/useStepperDialog'
import ScanResultDialog from '../ScanResult/ScanResultDialog'
import {
  getLastFormDataFile,
  isFileAlreadySelected,
  makeFileFromBase64
} from '../helpers'

const log = minilog('ScanWrapper')

const { fetchBlobFileById } = models.file

const ScanWrapper = ({ currentStep, onClose, onBack }) => {
  const client = useClient()
  const [searchParams] = useSearchParams()
  const { qualificationLabel } = useParams()
  const { currentStepIndex } = useStepperDialog()
  const { formData, setFormData, exportFormData } = useFormData()
  const { multipage, page } = currentStep
  const [currentFile, setCurrentFile] = useState(null)
  const [isFilePickerModalOpen, setIsFilePickerModalOpen] = useState(false)
  const webviewIntent = useWebviewIntent()

  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')
  useEffect(() => {
    const file = getLastFormDataFile({ formData, currentStepIndex })
    if (file) {
      setCurrentFile(file)
    }
  }, [formData, currentStepIndex])

  const onChangeFile = (file, { replace = false } = {}) => {
    // TODO : Integrate the values recovered by the OCR
    if (file) {
      if (replace) {
        setFormData(prev => ({
          ...prev,
          data: prev.data.map(data => {
            if (
              data.stepIndex === currentStepIndex &&
              data.file.name === file.name
            ) {
              return { ...data, file }
            }
            return data
          })
        }))
      } else if (!isFileAlreadySelected(formData, currentStepIndex, file)) {
        setCurrentFile(file)
        setFormData(prev => ({
          ...prev,
          data: [
            ...prev.data,
            {
              file,
              stepIndex: currentStepIndex,
              fileMetadata: {
                page: !multipage ? page : '',
                multipage
              }
            }
          ]
        }))
      }
    }
  }

  const onChangeFilePicker = async cozyFileId => {
    const blobFile = await fetchBlobFileById(client, cozyFileId)
    const file = makeFileFromBlob(blobFile, {
      name: cozyFileId,
      from: 'cozy'
    })
    onChangeFile(file)
  }

  const onOpenFlagshipScan = async () => {
    try {
      // We backup the current form state in case the operating system kills
      // the webview during the 'scanDocument' webview intent
      const exportedFormData = await exportFormData()

      await storeCreatePaperDataBackup({
        qualificationLabel,
        currentStepIndex,
        exportedFormData
      })

      const base64 = await webviewIntent.call('scanDocument')

      // If there was no issues during the 'scanDocument' webview intent,
      // we do not need to keep the current form state so we clean everything immediately
      await removeCreatePaperDataBackup()

      // TODO : Launch ocr after scanning the document
      const file = makeFileFromBase64({
        source: base64,
        name: FLAGSHIP_SCAN_TEMP_FILENAME,
        type: 'image/png'
      })
      onChangeFile(file)
    } catch (error) {
      log.error('Flagship scan error', error)
    }
  }

  if (!!fromFlagshipUpload && !currentFile && currentStepIndex === 0) {
    return null
  }

  if (currentFile) {
    return (
      <ScanResultDialog
        currentFile={currentFile}
        setCurrentFile={setCurrentFile}
        currentStep={currentStep}
        onChangeFile={onChangeFile}
        onClose={onClose}
        onBack={onBack}
      />
    )
  }

  return (
    <>
      <ScanDialog
        currentStep={currentStep}
        onChangeFile={onChangeFile}
        onOpenFilePickerModal={() => setIsFilePickerModalOpen(true)}
        onOpenFlagshipScan={onOpenFlagshipScan}
        onClose={onClose}
        onBack={onBack}
      />

      {isFilePickerModalOpen && (
        <FilePicker
          onChange={onChangeFilePicker}
          accept="image/jpg,image/jpeg,image/png,application/pdf"
          onClose={() => setIsFilePickerModalOpen(false)}
        />
      )}
    </>
  )
}

ScanWrapper.propTypes = {
  currentStep: PaperDefinitionsStepPropTypes
}

export default ScanWrapper
