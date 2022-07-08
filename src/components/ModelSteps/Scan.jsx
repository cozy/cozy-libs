import React, { useState, useEffect, memo, useCallback } from 'react'

import { useClient, models } from 'cozy-client'
import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import FilePicker from 'cozy-ui/transpiled/react/FilePicker'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { isMobile } from 'cozy-device-helper'

import CompositeHeader from '../CompositeHeader/CompositeHeader'
import AcquisitionResult from '../ModelSteps/AcquisitionResult'
import ScanMobileActions from '../ModelSteps/ScanMobileActions'
import ScanDesktopActions from '../ModelSteps/ScanDesktopActions'
import IlluGenericNewPage from '../../assets/icons/IlluGenericNewPage.svg'
import { makeBlobWithCustomAttrs } from '../../helpers/makeBlobWithCustomAttrs'
import { useFormData } from '../Hooks/useFormData'

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
  const { formData } = useFormData()
  const { illustration, text, stepIndex } = currentStep
  const [currentFile, setCurrentFile] = useState(null)

  const [isFilePickerModalOpen, setIsFilePickerModalOpen] = useState(false)
  const [cozyFileId, setCozyFileId] = useState('')

  const onChangeFile = useCallback(file => {
    if (file) {
      setCurrentFile(file)
    }
  }, [])

  const openFilePickerModal = () => setIsFilePickerModalOpen(true)
  const closeFilePickerModal = () => setIsFilePickerModalOpen(false)

  const onChangeFilePicker = fileId => setCozyFileId(fileId)

  useEffect(() => {
    const data = formData.data.filter(data => data.stepIndex === stepIndex)
    const { file } = data[data.length - 1] || {}

    if (file) {
      setCurrentFile(file)
    }
  }, [formData.data, stepIndex])

  useEffect(() => {
    ;(async () => {
      if (cozyFileId) {
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
    })()
  }, [client, cozyFileId, onChangeFile])

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
