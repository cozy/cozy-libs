import React, { useState, useEffect, memo } from 'react'

import { useClient, models } from 'cozy-client'
import { isMobile } from 'cozy-device-helper'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import FilePicker from 'cozy-ui/transpiled/react/FilePicker'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { isFileAlreadySelected } from './helpers'
import IlluGenericNewPage from '../../assets/icons/IlluGenericNewPage.svg'
import { makeBlobWithCustomAttrs } from '../../helpers/makeBlobWithCustomAttrs'
import CompositeHeader from '../CompositeHeader/CompositeHeader'
import { useFormData } from '../Hooks/useFormData'
import AcquisitionResult from '../ModelSteps/AcquisitionResult'
import ScanDesktopActions from '../ModelSteps/ScanDesktopActions'
import ScanMobileActions from '../ModelSteps/ScanMobileActions'

const { fetchBlobFileById } = models.file

// TODO Waiting for this type of filter to be implemented on the FilePicker side
// https://github.com/cozy/cozy-ui/issues/2026
const validFileType = file => {
  const regexValidation = /(image\/*)|(application\/pdf)/
  return regexValidation.test(file.type)
}

const Scan = ({ currentStep }) => {
  const { t } = useI18n()
  const client = useClient()
  const { formData, setFormData } = useFormData()
  const { illustration, text, stepIndex, multipage, page } = currentStep
  const [currentFile, setCurrentFile] = useState(null)

  const [isFilePickerModalOpen, setIsFilePickerModalOpen] = useState(false)

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

  const openFilePickerModal = () => setIsFilePickerModalOpen(true)
  const closeFilePickerModal = () => setIsFilePickerModalOpen(false)

  const onChangeFilePicker = async cozyFileId => {
    const blobFile = await fetchBlobFileById(client, cozyFileId)
    if (validFileType(blobFile)) {
      const blobFileCustom = makeBlobWithCustomAttrs(blobFile, {
        id: cozyFileId
      })
      onChangeFile(blobFileCustom)
    } else {
      Alerter.error('Scan.modal.validFileType', {
        duration: 3000
      })
    }
  }

  useEffect(() => {
    const data = formData.data.filter(data => data.stepIndex === stepIndex)
    const { file } = data[data.length - 1] || {}

    if (file) {
      setCurrentFile(file)
    }
  }, [formData.data, stepIndex])

  return currentFile ? (
    <AcquisitionResult
      currentFile={currentFile}
      setCurrentFile={setCurrentFile}
      currentStep={currentStep}
    />
  ) : (
    <>
      <CompositeHeader
        icon={illustration}
        iconSize="large"
        fallbackIcon={IlluGenericNewPage}
        title={t(text)}
      />
      <DialogActions
        disableSpacing
        className="columnLayout u-mh-0 u-mb-1 cozyDialogActions"
      >
        {isMobile() ? (
          <ScanMobileActions
            onChangeFile={onChangeFile}
            openFilePickerModal={openFilePickerModal}
          />
        ) : (
          <ScanDesktopActions
            onChangeFile={onChangeFile}
            openFilePickerModal={openFilePickerModal}
          />
        )}
      </DialogActions>

      {isFilePickerModalOpen && (
        <FilePicker
          onChange={onChangeFilePicker}
          onClose={closeFilePickerModal}
        />
      )}
    </>
  )
}

export default memo(Scan)
