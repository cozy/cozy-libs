import React, { createContext, useState, useEffect } from 'react'
const FormDataContext = createContext()

import { useWebviewIntent, useIsAvailable } from 'cozy-intent'

import {
  getAndRemoveIndexedStorageData,
  CREATE_PAPER_DATA_BACKUP_FORM_DATA
} from '../../utils/indexedStorage'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import { makeExportedFormDataDataFromBase64 } from '../ModelSteps/helpers'

const FormDataProvider = ({ children }) => {
  const webviewIntent = useWebviewIntent()
  const { isAvailable: isSharedMemoryAvailable } =
    useIsAvailable('sharedMemory')
  const { allCurrentSteps, currentStepIndex } = useStepperDialog()

  const currentStep = allCurrentSteps[currentStepIndex]

  /**
   * @type {[import('../../types').FormData, import('../../types').FormDataSetter]}
   */
  const [formData, setFormData] = useState({
    metadata: {},
    data: [],
    contacts: []
  })

  const exportFormData = async () => {
    const exportedData = []

    for (const data of formData.data) {
      exportedData.push({
        ...data,
        file: await data.file.arrayBuffer(),
        name: data.file.name,
        type: data.file.type
      })
    }

    /**
     * @type {import('../../types').ExportedFormData}
     */
    const exportedFormData = {
      metadata: formData.metadata,
      contacts: formData.contacts,
      data: exportedData
    }

    return exportedFormData
  }

  const importFormData = backupFormData => {
    const importedData = []

    for (const data of backupFormData.data) {
      importedData.push({
        ...data,
        file: new File([data.file], data.name, { type: data.type })
      })
    }

    /**
     * @type {import('../../types').FormData}
     */
    const importedFormData = {
      metadata: backupFormData.metadata,
      contacts: backupFormData.contacts,
      data: importedData
    }

    setFormData(importedFormData)
  }

  useEffect(() => {
    const loadCreatePaperDataBackup = async () => {
      const formDataBackup = await getAndRemoveIndexedStorageData(
        CREATE_PAPER_DATA_BACKUP_FORM_DATA
      )

      if (webviewIntent && formDataBackup) {
        /*
          If SharedMemory is available and if we have a last scan, we
          add the last scan to the form data. Otherwise, it is not a problem,
          we will just restore the form data to the previous state without
          the new scan.
        */
        if (isSharedMemoryAvailable) {
          const lastScanResult = await webviewIntent.call(
            'getSharedMemory',
            'mespapiers',
            'scanDocument'
          )

          if (lastScanResult) {
            await webviewIntent.call(
              'removeSharedMemory',
              'mespapiers',
              'scanDocument'
            )

            const lastScanFileData = makeExportedFormDataDataFromBase64(
              currentStep,
              lastScanResult
            )

            formDataBackup.data.push(lastScanFileData)
          }
        }

        importFormData(formDataBackup)
      }
    }

    loadCreatePaperDataBackup()
  }, [webviewIntent, isSharedMemoryAvailable, currentStep])

  return (
    <FormDataContext.Provider
      value={{ formData, setFormData, exportFormData, importFormData }}
    >
      {children}
    </FormDataContext.Provider>
  )
}

export default FormDataContext

export { FormDataProvider }
