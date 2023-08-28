import React, { forwardRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { isQueryLoading, useQuery } from 'cozy-client'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import Konnector from '../../../assets/icons/Konnectors.svg'
import { buildKonnectorsQueryBySlug } from '../../../helpers/queries'
import withLocales from '../../../locales/withLocales'

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

        const {
          konnectorCriteria: {
            name: konnectorName,
            category: konnectorCategory
          } = {},
          label
        } = paperDefinition

        const queryKonnector = buildKonnectorsQueryBySlug(konnectorName)
        const { data: konnectors, ...konnectorsQueryLeft } = useQuery(
          queryKonnector.definition,
          queryKonnector.options
        )
        const isKonnectorsLoading = isQueryLoading(konnectorsQueryLeft)

        const redirectPathSearchParam = `redirectAfterInstall=/paper/files/${label}/harvest/${
          konnectorName ? `&slug=${konnectorName}` : ''
        }${konnectorCategory ? `&category=${konnectorCategory}` : ''}`

        const handleClick = () => {
          if (konnectors?.length > 0) {
            navigate(`/paper/files/${label}`)
          } else {
            navigate({
              pathname: `${normalizePathname}/installKonnectorIntent`,
              search: `${redirectPathSearchParam}`
            })
          }
          importAutoOnclick()
        }

        return (
          <ActionsMenuItem
            {...props}
            ref={ref}
            onClick={handleClick}
            disabled={konnectorName && isKonnectorsLoading}
          >
            <ListItemIcon>
              <Icon icon={Konnector} size={24} />
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
