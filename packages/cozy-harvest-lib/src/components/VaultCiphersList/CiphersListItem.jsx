import get from 'lodash/get'
import PropTypes from 'prop-types'
import React from 'react'

import CipherIcon from 'cozy-ui/transpiled/react/CipherIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

const CiphersListItem = props => {
  const { cipherView, konnector, className, onClick, ...rest } = props

  return (
    <ListItem
      button={Boolean(onClick)}
      divider
      className={className}
      onClick={onClick}
      {...rest}
    >
      <ListItemIcon>
        <CipherIcon konnector={konnector} />
      </ListItemIcon>
      <ListItemText
        primary={get(cipherView, 'login.username')}
        secondary={cipherView.name}
      />
    </ListItem>
  )
}

CiphersListItem.propTypes = {
  cipherView: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired
}

export default CiphersListItem
