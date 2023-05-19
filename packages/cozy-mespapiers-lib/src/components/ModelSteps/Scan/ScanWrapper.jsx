import React, { useState, useEffect } from 'react'

import { useClient, models } from 'cozy-client'
import { useWebviewIntent } from 'cozy-intent'
import log from 'cozy-logger'
import FilePicker from 'cozy-ui/transpiled/react/FilePicker'

import Scan from './Scan'
import { PaperDefinitionsStepPropTypes } from '../../../constants/PaperDefinitionsPropTypes'
import { makeBlobWithCustomAttrs } from '../../../helpers/makeBlobWithCustomAttrs'
import { useFormData } from '../../Hooks/useFormData'
import AcquisitionResult from '../AcquisitionResult'
import { isFileAlreadySelected, makeFileFromImageSource } from '../helpers'

const { fetchBlobFileById } = models.file

const ScanWrapper = ({ currentStep }) => {
  const client = useClient()
  const { formData, setFormData } = useFormData()
  const { stepIndex, multipage, page } = currentStep
  const [currentFile, setCurrentFile] = useState(null)
  const [isFilePickerModalOpen, setIsFilePickerModalOpen] = useState(false)
  const webviewIntent = useWebviewIntent()

  const onChangeFile = file => {
    if (file) {
      setCurrentFile(file)
      if (!isFileAlreadySelected(formData, stepIndex, file)) {
        setFormData(prev => ({
          ...prev,
          data: [
            ...prev.data,
            {
              file: file,
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
      const file = await makeFileFromImageSource({
        imageSrc: `data:image/png;base64,${base64}`,
        imageName: 'flagshipScanTemp.png',
        imageType: 'image/png'
      })
      onChangeFile(file)
    } catch (error) {
      log('error', `Flagship scan error: ${error}`)
    }
  }

  useEffect(() => {
    const data = formData.data.filter(data => data.stepIndex === stepIndex)
    const { file } = data[data.length - 1] || {}

    if (file) {
      setCurrentFile(file)
    }
  }, [formData.data, stepIndex])

  if (currentFile) {
    return (
      <AcquisitionResult
        currentFile={currentFile}
        setCurrentFile={setCurrentFile}
        currentStep={currentStep}
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
