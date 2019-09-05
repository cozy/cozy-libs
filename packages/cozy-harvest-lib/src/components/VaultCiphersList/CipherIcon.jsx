import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import KonnectorIcon from '../KonnectorIcon'
import KeychainIcon from '../../assets/icon-keychain.svg'

const CipherIcon = props => {
  const { konnector, className, ...rest } = props

  // TODO use position directions from cozy-ui when https://github.com/cozy/cozy-ui/pull/1149 has been merged
  return (
    <div className={cx('u-pos-relative', className)} {...rest}>
      <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
        <KonnectorIcon konnector={konnector} className="u-w-1 u-h-1" />
      </div>
      <KeychainIcon className="u-pos-relative u-w-2" />
    </div>
  )
}

CipherIcon.propTypes = {
  konnector: PropTypes.object.isRequired
}

export default CipherIcon
