import PropTypes from 'prop-types'
import React from 'react'

import { I18n, initTranslation } from 'cozy-ui/transpiled/react/I18n'

import { ModalProvider } from './Contexts/ModalProvider'
import { MultiSelectionProvider } from './Contexts/MultiSelectionProvider'
import { OnboardingProvider } from './Contexts/OnboardingProvider'
import { PapersDefinitionsProvider } from './Contexts/PapersDefinitionsProvider'
import { ScannerI18nProvider } from './Contexts/ScannerI18nProvider'
import SearchProvider from './Contexts/SearchProvider'
import { MesPapiersLibLayout } from './MesPapiersLibLayout'
import PapersFabWrapper from './PapersFab/PapersFabWrapper'
import { FILES_DOCTYPE, CONTACTS_DOCTYPE } from '../doctypes'
import { getComponents } from '../helpers/defaultComponent'

export const MesPapiersLibProviders = ({ lang, components }) => {
  const polyglot = initTranslation(lang, lang => require(`../locales/${lang}`))
  const { PapersFab, Onboarding } = getComponents(components)

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
