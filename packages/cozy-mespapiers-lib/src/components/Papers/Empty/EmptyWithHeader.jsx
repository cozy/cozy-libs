import PropTypes from 'prop-types'
import React from 'react'

import { getAccountName } from 'cozy-client/dist/models/account'
import flag from 'cozy-flags'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import HarvestBanner from '../HarvestBanner'

const EmptyWithHeader = ({ konnector, account }) => {
  const { t } = useI18n()

  return (
    <List
      subheader={
        <ListSubheader>
          <div className="u-ellipsis">{getAccountName(account)}</div>
        </ListSubheader>
      }
    >
      {flag('harvest.inappconnectors.enabled') && (
        <HarvestBanner konnector={konnector} account={account} />
      )}
      <ListItem>
        <ListItemText
          ellipsis={false}
          primary={t('Empty.konnector.title')}
          secondary={t('Empty.konnector.text', {
            konnectorSlug: konnector?.slug?.toUpperCase()
          })}
        />
      </ListItem>
    </List>
  )
}

EmptyWithHeader.propTypes = {
  konnector: PropTypes.object,
  account: PropTypes.object.isRequired
}

export default EmptyWithHeader
