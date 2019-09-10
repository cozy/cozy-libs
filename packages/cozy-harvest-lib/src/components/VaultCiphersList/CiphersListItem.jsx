import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import CipherIcon from 'cozy-ui/transpiled/react/CipherIcon'

const CiphersListItem = props => {
  const { cipherView, konnector, ...rest } = props

  return (
    <ListItem {...rest}>
      <ListItemIcon>
        <CipherIcon konnector={konnector} />
      </ListItemIcon>
      <ListItemText
        primaryText={cipherView.name}
        secondaryText={get(cipherView, 'login.username')}
      />
    </ListItem>
  )
}

CiphersListItem.propTypes = {
  cipherView: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired
}

export default CiphersListItem
