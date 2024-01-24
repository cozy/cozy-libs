import PropTypes from 'prop-types'
import React from 'react'

import { useQuery } from 'cozy-client'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { I18n, initTranslation } from 'cozy-ui/transpiled/react/providers/I18n'

import { ComponentProvider } from './Contexts/ComponentProvider'
import { ErrorProvider, useError } from './Contexts/ErrorProvider'
import { FileSharingProvider } from './Contexts/FileSharingProvider'
import { MultiSelectionProvider } from './Contexts/MultiSelectionProvider'
import { OnboardingProvider } from './Contexts/OnboardingProvider'
import PapersCreatedProvider from './Contexts/PapersCreatedProvider'
import { PapersDefinitionsProvider } from './Contexts/PapersDefinitionsProvider'
import { PaywallProvider } from './Contexts/PaywallProvider'
import { ScannerI18nProvider } from './Contexts/ScannerI18nProvider'
import SearchProvider from './Contexts/SearchProvider'
import FabWrapper from './FabWrapper'
import ForwardFabWrapper from './ForwardFab/ForwardFabWrapper'
import { MesPapiersLibLayout } from './MesPapiersLibLayout'
import PapersFabWrapper from './PapersFab/PapersFabWrapper'
import { FILES_DOCTYPE, CONTACTS_DOCTYPE } from '../doctypes'
import { getComponents } from '../helpers/defaultComponent'
import { getAppSettings } from '../helpers/queries'

const MesPapiersLibProviders = ({ lang, components }) => {
  const polyglot = initTranslation(lang, lang => require(`../locales/${lang}`))
  const { PapersFab, ForwardFab, Onboarding } = getComponents(components)
  const { hasError } = useError()

  const { data: settingsData } = useQuery(
    getAppSettings.definition,
    getAppSettings.options
  )

  const isOnboarded = settingsData?.[0]?.onboarded

  return (
    <I18n lang={lang} polyglot={polyglot}>
      <PapersCreatedProvider>
        <AlertProvider>
          <PaywallProvider>
            <MultiSelectionProvider>
              <ScannerI18nProvider>
                <FileSharingProvider>
                  <SearchProvider doctypes={[FILES_DOCTYPE, CONTACTS_DOCTYPE]}>
                    <PapersDefinitionsProvider>
                      <ComponentProvider>
                        <OnboardingProvider OnboardingComponent={Onboarding}>
                          <MesPapiersLibLayout />
                        </OnboardingProvider>
                        {isOnboarded && !hasError && (
                          <FabWrapper>
                            {ForwardFab && (
                              <ForwardFabWrapper>
                                <ForwardFab />
                              </ForwardFabWrapper>
                            )}
                            {PapersFab && (
                              <PapersFabWrapper>
                                <PapersFab />
                              </PapersFabWrapper>
                            )}
                          </FabWrapper>
                        )}
                      </ComponentProvider>
                    </PapersDefinitionsProvider>
                  </SearchProvider>
                </FileSharingProvider>
              </ScannerI18nProvider>
            </MultiSelectionProvider>
          </PaywallProvider>
        </AlertProvider>
      </PapersCreatedProvider>
    </I18n>
  )
}

const MesPapiersLibErrorProviders = props => {
  return (
    <ErrorProvider>
      <MesPapiersLibProviders {...props} />
    </ErrorProvider>
  )
}

export default MesPapiersLibErrorProviders

MesPapiersLibProviders.propTypes = {
  lang: PropTypes.string,
  components: PropTypes.objectOf(PropTypes.func)
}
