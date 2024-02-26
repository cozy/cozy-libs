import React, { createContext, useEffect, useMemo, useState } from 'react'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import useFlag from 'cozy-flags/dist/useFlag'
import minilog from 'cozy-minilog'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import papersJSON_default from '../../constants/papersDefinitions.json'
import papersJSON_health from '../../constants/papersDefinitions_health.json'
import { buildPapersDefinitions } from '../../helpers/buildPapersDefinitions'
import { fetchContentFileToJson } from '../../utils/fetchContentFileToJson'
import { fetchCustomPaperDefinitions } from '../../utils/fetchCustomPaperDefinitions'
import { useScannerI18n } from '../Hooks/useScannerI18n'

const log = minilog('PapersDefinitionsProvider')

const PapersDefinitionsContext = createContext()

const PapersDefinitionsProvider = ({ children }) => {
  const client = useClient()
  const { t } = useI18n()
  const scannerT = useScannerI18n()
  const { showAlert } = useAlert()
  const [customPapersDefinitions, setCustomPapersDefinitions] = useState({
    isLoaded: false,
    name: '',
    path: ''
  })

  const customPapersDefinitionsFlag = useFlag('customPapersDefinitions')
  const [papersDefinitions, setPapersDefinitions] = useState([])

  const isHealthThemeHidden = flag('hide.healthTheme.enabled')

  const papersJSON = useMemo(
    () =>
      isHealthThemeHidden
        ? papersJSON_default
        : {
            papersDefinitions: papersJSON_default.papersDefinitions.concat(
              papersJSON_health.papersDefinitions
            )
          },
    [isHealthThemeHidden]
  )

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
          log.info('Custom PapersDefinitions loaded')
        } else {
          // If custom papersDefinitions.json not found, fallback on local file
          showAlert(
            t(`PapersDefinitionsProvider.customPapersDefinitions.error`, {
              name: paperConfigFilenameCustom,
              path: appFolderPath
            }),
            'error'
          )
          setPapersDefinitions(
            buildPapersDefinitions(papersJSON.papersDefinitions, scannerT)
          )
          log.info('PapersDefinitions of the app loaded')
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
        log.info('PapersDefinitions of the app loaded')
      }
    })()
  }, [
    client,
    customPapersDefinitionsFlag,
    scannerT,
    t,
    papersJSON.papersDefinitions,
    showAlert
  ])

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
