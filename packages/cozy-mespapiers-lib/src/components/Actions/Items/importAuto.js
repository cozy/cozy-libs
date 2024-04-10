import React, { forwardRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../../locales/withLocales'
import { KonnectorIcon } from '../../Icons/KonnectorIcon'
import { buildURLSearchParamsForInstallKonnectorFromIntent } from '../../Views/helpers'

/**
 *
 * @param {Object} param
 * @param {import('../../../types').PaperDefinition} param.paperDefinition
 * @param {Function} param.importAutoOnclick
 * @returns {{ name: string, Component: JSX.Element }}
 */
export const importAuto = ({ paperDefinition, importAutoOnclick }) => {
  return {
    name: 'importAuto',
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const { t } = useI18n()
        const navigate = useNavigate()
        const { pathname } = useLocation()
        const normalizePathname = pathname.split('/create')[0]

        const { konnectorCriteria, label } = paperDefinition

        const searchParams = buildURLSearchParamsForInstallKonnectorFromIntent(
          konnectorCriteria,
          label
        )

        const handleClick = () => {
          navigate({
            pathname: `${normalizePathname}/installKonnectorIntent`,
            search: `${searchParams}`
          })

          importAutoOnclick()
        }

        return (
          <ActionsMenuItem {...props} ref={ref} onClick={handleClick}>
            <ListItemIcon>
              <KonnectorIcon konnectorCriteria={konnectorCriteria} size={24} />
            </ListItemIcon>
            <ListItemText
              primary={t('ImportDropdown.importAuto.title')}
              secondary={t('ImportDropdown.importAuto.text')}
            />
          </ActionsMenuItem>
        )
      })
    )
  }
}
