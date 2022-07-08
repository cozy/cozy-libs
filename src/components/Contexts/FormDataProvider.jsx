import React, { createContext, useState } from 'react'

import log from 'cozy-logger'
import { models, useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import { useStepperDialog } from '../Hooks/useStepperDialog'
import getOrCreateAppFolderWithReference from '../../helpers/getFolderWithReference'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { createPdfAndSave } from '../../helpers/createPdfAndSave'

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

      Alerter.success('common.saveFile.success')
    } catch (error) {
      log('error', error)
      Alerter.error('common.saveFile.error')
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
