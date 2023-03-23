import React from 'react'

import ActionMenuItemWrapper from 'cozy-ui/transpiled/react/ActionMenu/ActionMenuItemWrapper'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { findPlaceholderByLabelAndCountry } from '../../../helpers/findPlaceholders'
import withLocales from '../../../locales/withLocales'
import { usePapersDefinitions } from '../../Hooks/usePapersDefinitions'
import { useScannerI18n } from '../../Hooks/useScannerI18n'

export const createPaperByTheme = ({
  showImportDropdown,
  fileTheme,
  country
}) => {
  return {
    name: 'createPaperByTheme',
    Component: withLocales(({ className }) => {
      const { t } = useI18n()
      const scannerT = useScannerI18n()
      const { papersDefinitions: paperDefinitionsList } = usePapersDefinitions()
      const paperDefinition = findPlaceholderByLabelAndCountry(
        paperDefinitionsList,
        fileTheme,
        country
      )[0]

      return (
        <ActionMenuItemWrapper
          className={className}
          icon={paperDefinition.icon}
          onClick={() => showImportDropdown(paperDefinition)}
        >
          {t('action.createPaperByTheme', {
            theme: scannerT(`items.${fileTheme}`)
          })}
        </ActionMenuItemWrapper>
      )
    })
  }
}
