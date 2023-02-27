import React from 'react'
import PropTypes from 'prop-types'

import { useQuery, isQueryLoading } from 'cozy-client'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { buildAccountsQueryBySlug } from '../../helpers/queries'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { addAccountsToKonnectors, makeIsLast } from './helpers'
import styles from './styles.styl'

const CategoryItemByKonnector = ({
  konnectorsWithAccounts,
  konnector,
  onClick
}) => {
  const scannerT = useScannerI18n()

  const queryAccounts = buildAccountsQueryBySlug(konnector.slug)
  const { data: accounts, ...accountsQueryLeft } = useQuery(
    queryAccounts.definition,
    queryAccounts.options
  )
  const isLoading = isQueryLoading(accountsQueryLeft)

  if (isLoading) return null

  addAccountsToKonnectors({
    konnectorsWithAccounts,
    konnector,
    accounts
  })

  if (accounts?.length === 0) {
    return null
  }

  const isLast = makeIsLast(konnectorsWithAccounts, konnector)

  return (
    <>
      <ListItem
        button
        onClick={() => onClick(konnector.qualification_labels[0])}
      >
        <ListItemIcon>
          <div className={styles['emptyKonnectorIcon']} />
        </ListItemIcon>
        <ListItemText
          primary={scannerT(`items.${konnector.qualification_labels[0]}`)}
        />
        <Icon icon="right" />
      </ListItem>
      {!isLast && <Divider variant="inset" component="li" />}
    </>
  )
}

CategoryItemByKonnector.propTypes = {
  konnectorsWithAccounts: PropTypes.array,
  konnector: PropTypes.object,
  onClick: PropTypes.func
}

export default CategoryItemByKonnector
