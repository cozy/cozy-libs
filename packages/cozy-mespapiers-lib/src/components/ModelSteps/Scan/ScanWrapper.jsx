import React, { useState } from 'react'

import { useClient, models } from 'cozy-client'
import { useWebviewIntent } from 'cozy-intent'
import log from 'cozy-logger'
import FilePicker from 'cozy-ui/transpiled/react/FilePicker'

import Scan from './Scan'
import { PaperDefinitionsStepPropTypes } from '../../../constants/PaperDefinitionsPropTypes'
import { makeBlobWithCustomAttrs } from '../../../helpers/makeBlobWithCustomAttrs'
import { useFormData } from '../../Hooks/useFormData'
import ScanResultWrapper from '../ScanResultWrapper'
import {
  getLastFormDataFile,
  isFileAlreadySelected,
  makeFileFromBase64
} from '../helpers'

const { fetchBlobFileById } = models.file

const ScanWrapper = ({ currentStep }) => {
  const client = useClient()
  const { formData, setFormData } = useFormData()
  const { stepIndex, multipage, page } = currentStep
  const [currentFile, setCurrentFile] = useState(
    getLastFormDataFile({ formData: formData, stepIndex })
  )
  const [isFilePickerModalOpen, setIsFilePickerModalOpen] = useState(false)
  const webviewIntent = useWebviewIntent()

  const onChangeFile = (file, { replace = false } = {}) => {
    if (file) {
      if (replace) {
        setFormData(prev => ({
          ...prev,
          data: prev.data.map(data => {
            if (data.stepIndex === stepIndex && data.file.name === file.name) {
              return { ...data, file }
            }
            return data
          })
        }))
        return
      }
      if (!isFileAlreadySelected(formData, stepIndex, file)) {
        setCurrentFile(file)
        setFormData(prev => ({
          ...prev,
          data: [
            ...prev.data,
            {
              file,
              stepIndex,
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
    const blobFileCustom = makeBlobWithCustomAttrs(blobFile, {
      id: cozyFileId
    })
    onChangeFile(blobFileCustom)
  }

  const onOpenFlagshipScan = async () => {
    try {
      const base64 = await webviewIntent.call('scanDocument')
      const file = makeFileFromBase64({
        source: base64,
        name: 'flagshipScanTemp.png',
        type: 'image/png'
      })
      onChangeFile(file)
    } catch (error) {
      log('error', `Flagship scan error: ${error}`)
    }
  }

  if (currentFile) {
    return (
      <ScanResultWrapper
        currentFile={currentFile}
        setCurrentFile={setCurrentFile}
        currentStep={currentStep}
        onChangeFile={onChangeFile}
      />
    )
  }

  return (
    <>
      <Scan
        currentStep={currentStep}
        onChangeFile={onChangeFile}
        onOpenFilePickerModal={() => setIsFilePickerModalOpen(true)}
        onOpenFlagshipScan={onOpenFlagshipScan}
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
