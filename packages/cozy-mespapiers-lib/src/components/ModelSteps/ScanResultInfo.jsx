import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { iconPropType } from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import Spike from '../../assets/icons/Spike.svg'
import CompositeHeaderImage from '../CompositeHeader/CompositeHeaderImage'

const ScanResultInfo = ({ icon, text, className }) => {
  return (
    <div
      className={cx(
        'u-flex u-flex-items-center u-flex-justify-center u-p-1 u-bdrs-4',
        className
      )}
      style={{
        backgroundColor: 'var(--defaultBackgroundColor)',
        gap: '1rem',
        position: 'relative'
      }}
    >
      <CompositeHeaderImage icon={icon} iconSize="small" />
      <Typography variant="body2">{text}</Typography>
      <Icon
        icon={Spike}
        size={24}
        style={{
          position: 'absolute',
          color: 'var(--defaultBackgroundColor)',
          bottom: -17,
          left: 0,
          right: 0,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
        aria-hidden="true"
      />
    </div>
  )
}

ScanResultInfo.propTypes = {
  icon: iconPropType,
  text: PropTypes.string
}

export default ScanResultInfo
