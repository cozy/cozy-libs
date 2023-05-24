import PropTypes from 'prop-types'
import React from 'react'

import { useQuery } from 'cozy-client'
import { I18n, initTranslation } from 'cozy-ui/transpiled/react/I18n'

import { ModalProvider } from './Contexts/ModalProvider'
import { MultiSelectionProvider } from './Contexts/MultiSelectionProvider'
import { OnboardingProvider } from './Contexts/OnboardingProvider'
import { PapersDefinitionsProvider } from './Contexts/PapersDefinitionsProvider'
import { ScannerI18nProvider } from './Contexts/ScannerI18nProvider'
import SearchProvider from './Contexts/SearchProvider'
import FabWrapper from './FabWrapper'
import ForwardFabWrapper from './ForwardFab/ForwardFabWrapper'
import { MesPapiersLibLayout } from './MesPapiersLibLayout'
import PapersFabWrapper from './PapersFab/PapersFabWrapper'
import { FILES_DOCTYPE, CONTACTS_DOCTYPE } from '../doctypes'
import { getComponents } from '../helpers/defaultComponent'
import { getAppSettings } from '../helpers/queries'

export const MesPapiersLibProviders = ({ lang, components }) => {
  const polyglot = initTranslation(lang, lang => require(`../locales/${lang}`))
  const { PapersFab, ForwardFab, Onboarding } = getComponents(components)

  const { data: settingsData } = useQuery(
    getAppSettings.definition,
    getAppSettings.options
  )

  const isOnboarded = settingsData?.[0]?.onboarded

  return (
    <I18n lang={lang} polyglot={polyglot}>
      <MultiSelectionProvider>
        <ScannerI18nProvider>
          <SearchProvider doctypes={[FILES_DOCTYPE, CONTACTS_DOCTYPE]}>
            <PapersDefinitionsProvider>
              <ModalProvider>
                <OnboardingProvider OnboardingComponent={Onboarding}>
                  <MesPapiersLibLayout />
                </OnboardingProvider>
                {isOnboarded && (
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
              </ModalProvider>
            </PapersDefinitionsProvider>
          </SearchProvider>
        </ScannerI18nProvider>
      </MultiSelectionProvider>
    </I18n>
  )
}

MesPapiersLibProviders.propTypes = {
  lang: PropTypes.string,
  components: PropTypes.objectOf(PropTypes.func)
}
