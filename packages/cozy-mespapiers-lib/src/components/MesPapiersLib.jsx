import React from 'react'

import { RealTimeQueries } from 'cozy-client'
import flag from 'cozy-flags'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n, I18n, initTranslation } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import { ScannerI18nProvider } from './Contexts/ScannerI18nProvider'
import { ModalProvider, ModalStack } from './Contexts/ModalProvider'
import { PapersDefinitionsProvider } from './Contexts/PapersDefinitionsProvider'
import { MultiSelectionProvider } from './Contexts/MultiSelectionProvider'
import { AppRouter } from './AppRouter'
import { usePapersDefinitions } from './Hooks/usePapersDefinitions'
import MoreOptions from './MoreOptions/MoreOptions'
import { getComponents } from '../helpers/defaultComponent'
import PapersFabWrapper from './PapersFab/PapersFabWrapper'

const App = () => {
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
        <>
          <MoreOptions />
          <AppRouter />
        </>
      )}
      <RealTimeQueries doctype="io.cozy.files" />
      <RealTimeQueries doctype="io.cozy.mespapiers.settings" />
      <Alerter t={t} />
      <ModalStack />
    </>
  )
}

const MesPapiersLib = ({ lang, components }) => {
  const polyglot = initTranslation(lang, lang => require(`../locales/${lang}`))
  const { PapersFab } = getComponents(components)

  return (
    <I18n lang={lang} polyglot={polyglot}>
      <MultiSelectionProvider>
        <ScannerI18nProvider>
          <PapersDefinitionsProvider>
            <ModalProvider>
              <App />
              {PapersFab && (
                <PapersFabWrapper>
                  <PapersFab />
                </PapersFabWrapper>
              )}
            </ModalProvider>
          </PapersDefinitionsProvider>
        </ScannerI18nProvider>
      </MultiSelectionProvider>
    </I18n>
  )
}

export default MesPapiersLib
