import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

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
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const { t } = useI18n()
        const scannerT = useScannerI18n()
        const { papersDefinitions: paperDefinitionsList } =
          usePapersDefinitions()

        const paperDefinition = findPlaceholderByLabelAndCountry(
          paperDefinitionsList,
          fileTheme,
          country
        )[0]

        return (
          <ActionsMenuItem
            {...props}
            ref={ref}
            onClick={() => showImportDropdown(paperDefinition)}
          >
            <ListItemIcon>
              <Icon icon={paperDefinition.icon} />
            </ListItemIcon>
            <ListItemText
              primary={t('action.createPaperByTheme', {
                theme: scannerT(`items.${fileTheme}`)
              })}
            />
          </ActionsMenuItem>
        )
      })
    )
  }
}
