import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import cx from 'classnames'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import CipherIcon from 'cozy-ui/transpiled/react/CipherIcon'

const CiphersListItem = props => {
  const { cipherView, konnector, className, onClick, ...rest } = props

  return (
    <ListItem
      className={cx(
        {
          'u-c-pointer': onClick
        },
        className
      )}
      onClick={onClick}
      {...rest}
    >
      <ListItemIcon>
        <CipherIcon konnector={konnector} />
      </ListItemIcon>
      <ListItemText
        primaryText={get(cipherView, 'login.username')}
        secondaryText={cipherView.name}
      />
    </ListItem>
  )
}

CiphersListItem.propTypes = {
  cipherView: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired
}

export default CiphersListItem
