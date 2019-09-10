import React from 'react'
import Icon from 'cozy-ui/transpiled/react/Icon'
import cx from 'classnames'
import withLocales from './hoc/withLocales'

const BackButton = props => {
  const { className, t, ...rest } = props

  return (
    <button
      className={cx(
        'u-inline-flex u-flex-items-center u-bg-white u-bdw-0 u-ph-0 u-pv-1 u-c-pointer',
        className
      )}
      {...rest}
    >
      <Icon icon="left" className="u-mr-half" />
      {t('Revenir à la liste')}
    </button>
  )
}

export default withLocales(BackButton)
