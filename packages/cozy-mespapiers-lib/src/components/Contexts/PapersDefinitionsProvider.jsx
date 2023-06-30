import React, { createContext, useEffect, useState } from 'react'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import useFlag from 'cozy-flags/dist/useFlag'
import log from 'cozy-logger'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import papersJSON_default from '../../constants/papersDefinitions.json'
import papersJSON_health from '../../constants/papersDefinitions_health.json'
import { buildPapersDefinitions } from '../../helpers/buildPapersDefinitions'
import { fetchContentFileToJson } from '../../utils/fetchContentFileToJson'
import { fetchCustomPaperDefinitions } from '../../utils/fetchCustomPaperDefinitions'
import { useScannerI18n } from '../Hooks/useScannerI18n'

const papersJSON = flag('hide.healthTheme.enabled')
  ? papersJSON_default
  : {
      papersDefinitions: papersJSON_default.papersDefinitions.concat(
        papersJSON_health.papersDefinitions
      )
    }

const PapersDefinitionsContext = createContext()

const PapersDefinitionsProvider = ({ children }) => {
  const client = useClient()
  const { t } = useI18n()
  const scannerT = useScannerI18n()
  const [customPapersDefinitions, setCustomPapersDefinitions] = useState({
    isLoaded: false,
    name: '',
    path: ''
  })

  const customPapersDefinitionsFlag = useFlag('customPapersDefinitions')
  const [papersDefinitions, setPapersDefinitions] = useState([])

  useEffect(() => {
    ;(async () => {
      if (customPapersDefinitionsFlag) {
        const { paperConfigFilenameCustom, appFolderPath, file } =
          await fetchCustomPaperDefinitions(client, t)
        const data = await fetchContentFileToJson(client, file)

        if (data) {
          setCustomPapersDefinitions({
            isLoaded: true,
            name: paperConfigFilenameCustom,
            path: appFolderPath
          })
          setPapersDefinitions(
            buildPapersDefinitions(data.papersDefinitions, scannerT)
          )
          log('info', 'Custom PapersDefinitions loaded')
        } else {
          // If custom papersDefinitions.json not found, fallback on local file
          Alerter.error(
            t(`PapersDefinitionsProvider.customPapersDefinitions.error`, {
              name: paperConfigFilenameCustom,
              path: appFolderPath
            }),
            {
              buttonText: 'Ok',
              buttonAction: dismiss => dismiss(),
              duration: 20000
            }
          )
          setPapersDefinitions(
            buildPapersDefinitions(papersJSON.papersDefinitions, scannerT)
          )
          log('info', 'PapersDefinitions of the app loaded')
        }
      } else {
        // If has no custom papersDefinitions Flag
        setCustomPapersDefinitions({
          isLoaded: false,
          name: '',
          path: ''
        })

        setPapersDefinitions(
          buildPapersDefinitions(papersJSON.papersDefinitions, scannerT)
        )
        log('info', 'PapersDefinitions of the app loaded')
      }
    })()
  }, [client, customPapersDefinitionsFlag, scannerT, t])

  return (
    <PapersDefinitionsContext.Provider
      value={{
        papersDefinitions,
        customPapersDefinitions
      }}
    >
      {children}
    </PapersDefinitionsContext.Provider>
  )
}

export default PapersDefinitionsContext

export { PapersDefinitionsProvider }
