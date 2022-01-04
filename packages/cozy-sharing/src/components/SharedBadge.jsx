import React from 'react'
import classNames from 'classnames'
import Icon from 'cozy-ui/transpiled/react/Icon'
import palette from 'cozy-ui/transpiled/react/palette'

import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import styles from './badge.styl'

const SharedBadge = ({ byMe, className, small, xsmall }) => (
  <div
    className={classNames(
      styles['shared-badge'],
      className,
      { [styles['--small']]: small },
      { [styles['--xsmall']]: xsmall },
      styles[byMe ? '--by-me' : '--with-me']
    )}
  >
    <Icon
      icon={ShareIcon}
      color={palette.white}
      className={styles['shared-badge-icon']}
    />
  </div>
)

export default SharedBadge
