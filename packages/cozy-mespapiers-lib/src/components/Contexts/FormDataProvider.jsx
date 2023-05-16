import React, { createContext, useState } from 'react'

import { models, useClient } from 'cozy-client'
import log from 'cozy-logger'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { createPdfAndSave } from '../../helpers/createPdfAndSave'
import getOrCreateAppFolderWithReference from '../../helpers/getFolderWithReference'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { useStepperDialog } from '../Hooks/useStepperDialog'

const {
  document: { Qualification }
} = models

const FormDataContext = createContext()

const FormDataProvider = ({ children }) => {
  const client = useClient()
  const { f, t } = useI18n()
  const scannerT = useScannerI18n()
  const { currentDefinition, stepperDialogTitle } = useStepperDialog()
  const [formData, setFormData] = useState({
    metadata: {},
    data: [],
    contacts: []
  })

  const formSubmit = async () => {
    try {
      const qualification = Qualification.getByLabel(stepperDialogTitle)
      const { _id: appFolderID } = await getOrCreateAppFolderWithReference(
        client,
        t
      )

      await createPdfAndSave({
        formData,
        qualification,
        currentDefinition,
        appFolderID,
        client,
        i18n: { t, f, scannerT }
      })

      Alerter.success('common.saveFile.success', { duration: 4000 })
    } catch (error) {
      log('error', error)
      Alerter.error('common.saveFile.error', { duration: 4000 })
    }
  }

  return (
    <FormDataContext.Provider value={{ formData, setFormData, formSubmit }}>
      {children}
    </FormDataContext.Provider>
  )
}

export default FormDataContext

export { FormDataProvider }
