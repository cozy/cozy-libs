import PropTypes from 'prop-types'
import React from 'react'

import { getAccountName } from 'cozy-client/dist/models/account'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import HarvestBanner from '../HarvestBanner'

const EmptyWithHeader = ({ konnector, account }) => {
  const { t } = useI18n()

  return (
    <List
      subheader={
        <ListSubheader>
          <div className="u-ellipsis">
            {t('PapersList.accountName', {
              name: konnector.name,
              identifier: getAccountName(account)
            })}
          </div>
        </ListSubheader>
      }
      data-testid="EmptyWithHeader"
    >
      <HarvestBanner konnector={konnector} account={account} />

      <ListItem ellipsis={false}>
        <ListItemText
          primary={t('Empty.konnector.title')}
          secondary={t('Empty.konnector.text', {
            konnectorName: konnector.name
          })}
        />
      </ListItem>
    </List>
  )
}

EmptyWithHeader.propTypes = {
  konnector: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired
}

export default EmptyWithHeader
