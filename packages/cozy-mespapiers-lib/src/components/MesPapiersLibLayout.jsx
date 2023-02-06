import React from 'react'
import { Outlet } from 'react-router-dom'

import { RealTimeQueries } from 'cozy-client'
import flag from 'cozy-flags'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import { FILES_DOCTYPE, TRIGGERS_DOCTYPE, SETTINGS_DOCTYPE } from '../doctypes'
import { ModalStack } from './Contexts/ModalProvider'
import { usePapersDefinitions } from './Hooks/usePapersDefinitions'

export const MesPapiersLibLayout = () => {
  const { t } = useI18n()
  const { customPapersDefinitions, papersDefinitions } = usePapersDefinitions()

  return (
    <>
      {flag('switcher') && <FlagSwitcher />}

      {customPapersDefinitions.isLoaded && (
        <Typography variant="subtitle2" align="center" color="secondary">
          {t(`PapersDefinitionsProvider.customPapersDefinitions.warning`, {
            name: customPapersDefinitions.name
          })}
        </Typography>
      )}
      {papersDefinitions.length === 0 ? (
        <Spinner
          size="xxlarge"
          className="u-flex u-flex-justify-center u-mt-2 u-h-5"
        />
      ) : (
        <Outlet />
      )}
      <RealTimeQueries doctype={FILES_DOCTYPE} />
      <RealTimeQueries doctype={TRIGGERS_DOCTYPE} />
      <RealTimeQueries doctype={SETTINGS_DOCTYPE} />
      <Alerter t={t} />
      <ModalStack />
    </>
  )
}
