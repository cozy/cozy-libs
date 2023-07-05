import classNames from 'classnames'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import { Button } from 'cozy-ui/transpiled/react/deprecated/Button'

import styles from './button.styl'

export const ShareButton = ({ label, onClick, className, ...props }) => (
  <Button
    data-test-id="share-button"
    theme="secondary"
    className={className}
    onClick={() => onClick()}
    icon={<Icon icon={ShareIcon} />}
    label={label}
    {...props}
  />
)

export const SharedByMeButton = ({ label, onClick, className, ...props }) => (
  <Button
    data-test-id="share-by-me-button"
    className={classNames(styles['coz-btn-shared'], className)}
    onClick={() => onClick()}
    icon={<Icon icon={ShareIcon} />}
    label={label}
    {...props}
  />
)

export const SharedWithMeButton = ({ label, onClick, className, ...props }) => (
  <Button
    className={classNames(styles['coz-btn-sharedWithMe'], className)}
    onClick={() => onClick()}
    icon={<Icon icon={ShareIcon} />}
    label={label}
    {...props}
  />
)

export default ShareButton
