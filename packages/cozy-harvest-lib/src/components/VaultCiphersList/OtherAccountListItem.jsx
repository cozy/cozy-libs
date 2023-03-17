import React from 'react'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'

import withLocales from '../hoc/withLocales'

const OtherAccountListItem = props => {
  // eslint-disable-next-line no-unused-vars
  const { f, t, ...rest } = props
  return (
    <ListItem button {...rest}>
      <ListItemText primary={t('vaultCiphersList.otherAccount')} />
    </ListItem>
  )
}

export default withLocales(OtherAccountListItem)
