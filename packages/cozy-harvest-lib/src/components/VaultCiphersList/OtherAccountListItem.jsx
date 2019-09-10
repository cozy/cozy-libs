import React from 'react'
import cx from 'classnames'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import withLocales from '../hoc/withLocales'

const OtherAccountListItem = props => {
  const { t, onClick, className, ...rest } = props
  return (
    <ListItem
      onClick={onClick}
      className={cx(
        {
          'u-c-pointer': onClick
        },
        className
      )}
      {...rest}
    >
      <ListItemText primaryText={t('vaultCiphersList.otherAccount')} />
    </ListItem>
  )
}

export default withLocales(OtherAccountListItem)
