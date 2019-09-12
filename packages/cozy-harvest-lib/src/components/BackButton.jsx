import React from 'react'
import Icon from 'cozy-ui/transpiled/react/Icon'
import cx from 'classnames'

const BackButton = props => {
  const { className, children, ...rest } = props

  return (
    <button
      className={cx(
        'u-inline-flex u-flex-items-center u-bg-white u-bdw-0 u-ph-0 u-pv-1 u-c-pointer',
        className
      )}
      {...rest}
    >
      <Icon icon="left" className="u-mr-half" />
      {children}
    </button>
  )
}

export default BackButton
