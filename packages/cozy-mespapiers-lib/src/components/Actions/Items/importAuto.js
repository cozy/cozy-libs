import React, { forwardRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { isQueryLoading, useQuery } from 'cozy-client'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Konnector from '../../../assets/icons/Konnectors.svg'
import {
  buildAccountsQueryBySlugs,
  buildKonnectorsQueryBySlug
} from '../../../helpers/queries'
import withLocales from '../../../locales/withLocales'
import { buildURLSearchParamsForInstallKonnectorFromIntent } from '../../Views/helpers'

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
        const { name: konnectorName } = konnectorCriteria || {}

        const queryKonnector = buildKonnectorsQueryBySlug(konnectorName)
        const { data: konnectors, ...konnectorsQueryLeft } = useQuery(
          queryKonnector.definition,
          queryKonnector.options
        )
        const isKonnectorsLoading = isQueryLoading(konnectorsQueryLeft)

        const hasKonnector = Boolean(konnectors?.length > 0)
        const konnectorSlugs = konnectors?.map(konnector => konnector.slug)
        const queryAccounts = buildAccountsQueryBySlugs(
          konnectorSlugs,
          hasKonnector
        )
        const { data: accounts, ...accountsQueryLeft } = useQuery(
          queryAccounts.definition,
          queryAccounts.options
        )
        const isAccountsLoading =
          hasKonnector && isQueryLoading(accountsQueryLeft)

        const isKonnectorsConnected = accounts?.some(account =>
          konnectorSlugs?.some(
            konnectorSlug => account.account_type === konnectorSlug
          )
        )

        const searchParams = buildURLSearchParamsForInstallKonnectorFromIntent(
          konnectorCriteria,
          label
        )

        const handleClick = () => {
          if (konnectors?.length > 0 && isKonnectorsConnected) {
            navigate(`/paper/files/${label}`)
          } else {
            navigate({
              pathname: `${normalizePathname}/installKonnectorIntent`,
              search: `${searchParams}`
            })
          }
          importAutoOnclick()
        }

        const itemDisabled =
          konnectorName && isKonnectorsLoading && isAccountsLoading

        return (
          <ActionsMenuItem
            {...props}
            ref={ref}
            onClick={handleClick}
            disabled={itemDisabled}
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
