import React, { createContext, useState, useEffect } from 'react'
const FormDataContext = createContext()

import { useWebviewIntent } from 'cozy-intent'

import {
  getAndRemoveIndexedStorageData,
  FORM_BACKUP_FORM_DATA_KEY
} from '../../utils/indexedStorage'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import { makeExportedFormDataFromBase64 } from '../ModelSteps/helpers'

const FormDataProvider = ({ children }) => {
  const webviewIntent = useWebviewIntent()
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
    const loadFormBackup = async () => {
      const backupFormData = await getAndRemoveIndexedStorageData(
        FORM_BACKUP_FORM_DATA_KEY
      )

      if (backupFormData && webviewIntent) {
        const lastScanResult = await webviewIntent.call(
          'getSharedMemory',
          'mespapiers',
          'scanDocument'
        )

        if (lastScanResult) {
          const lastScanFileData = makeExportedFormDataFromBase64(
            currentStep,
            lastScanResult
          )

          backupFormData.data.push(lastScanFileData)
        }

        importFormData(backupFormData)
      }
    }

    loadFormBackup()
  }, [webviewIntent, currentStep])

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
