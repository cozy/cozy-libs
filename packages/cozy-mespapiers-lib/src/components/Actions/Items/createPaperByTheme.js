import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

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
      // eslint-disable-next-line no-unused-vars, react/display-name
      forwardRef(({ t, f, lang, ...props }, ref) => {
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
