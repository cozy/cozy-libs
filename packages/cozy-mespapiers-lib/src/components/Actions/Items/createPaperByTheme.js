import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ActionMenuItemWrapper from '../ActionMenuItemWrapper'
import { useScannerI18n } from '../../Hooks/useScannerI18n'
import { usePapersDefinitions } from '../../Hooks/usePapersDefinitions'
import { findPlaceholderByLabelAndCountry } from '../../../helpers/findPlaceholders'

export const createPaperByTheme = ({
  showImportDropdown,
  fileTheme,
  country
}) => {
  return {
    name: 'createPaperByTheme',
    Component: function CreatePaperByTheme({ className }) {
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
    }
  }
}
