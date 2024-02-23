import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import styles from '../../styles/recipient.styl'

const Identity = ({ name, details }) => (
  <div className={classNames(styles['recipient-idents'], 'u-ml-1')}>
    <div className={styles['recipient-user']}>{name}</div>
    <div className={styles['recipient-details']}>{details}</div>
  </div>
)

Identity.propTypes = {
  name: PropTypes.string.isRequired,
  details: PropTypes.string
}

Identity.defaultProps = {
  details: '-'
}

export default Identity
