import React from 'react'
import PropTypes from 'prop-types'

import { I18n, initTranslation } from 'cozy-ui/transpiled/react/I18n'

import { ScannerI18nProvider } from './Contexts/ScannerI18nProvider'
import { ModalProvider } from './Contexts/ModalProvider'
import { PapersDefinitionsProvider } from './Contexts/PapersDefinitionsProvider'
import { MultiSelectionProvider } from './Contexts/MultiSelectionProvider'
import { getComponents } from '../helpers/defaultComponent'
import PapersFabWrapper from './PapersFab/PapersFabWrapper'
import { OnboardingProvider } from './Contexts/OnboardingProvider'
import SearchProvider from './Search/SearchProvider'
import { MesPapiersLibLayout } from './MesPapiersLibLayout'

export const MesPapiersLibProviders = ({ lang, components }) => {
  const polyglot = initTranslation(lang, lang => require(`../locales/${lang}`))
  const { PapersFab, Onboarding } = getComponents(components)

  return (
    <I18n lang={lang} polyglot={polyglot}>
      <MultiSelectionProvider>
        <ScannerI18nProvider>
          <SearchProvider>
            <PapersDefinitionsProvider>
              <ModalProvider>
                <OnboardingProvider OnboardingComponent={Onboarding}>
                  <MesPapiersLibLayout />
                </OnboardingProvider>
                {PapersFab && (
                  <PapersFabWrapper>
                    <PapersFab />
                  </PapersFabWrapper>
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
