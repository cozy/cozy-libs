import React from 'react'
import cx from 'classnames'

import Icon from 'cozy-ui/transpiled/react/Icon'
import Button from 'cozy-ui/transpiled/react/Button'
import { MainTitle } from 'cozy-ui/transpiled/react/Text'

import styles from '../styles.styl'

export const Wizard = ({ children, tag, ...props }) => {
  const Component = tag
  return (
    <Component className={styles['wizard']} {...props}>
      {children}
    </Component>
  )
}

export const WizardWrapper = ({ children, align }) => {
  return (
    <div
      className={cx(
        styles['wizard-wrapper'],
        align == 'center' ? styles['wizard-wrapper--center'] : null
      )}
    >
      {children}
    </div>
  )
}

export const WizardFooter = ({ children, className }) => {
  return (
    <footer className={cx(styles['wizard-footer'], className)}>
      {children}
    </footer>
  )
}

export const WizardHeader = ({ children, className }) => {
  return (
    <header className={cx(styles['wizard-header'], className)}>
      {children}
    </header>
  )
}

export const WizardMain = ({ children }) => {
  return <div className={styles['wizard-main']}>{children}</div>
}

export const WizardDescription = ({ children }) => {
  return <p className={styles['wizard-desc']}>{children}</p>
}

export const WizardTitle = ({ children, tag, className }) => {
  return (
    <MainTitle
      tag={tag || 'h1'}
      className={cx(styles['wizard-title'], className)}
    >
      {children}
    </MainTitle>
  )
}

export const WizardLogo = ({ src }) => (
  <div className={styles['wizard-logo']}>
    <img
      className={styles['wizard-logo-img']}
      src={src}
      alt=""
      aria-hidden="true"
      focusable="false"
    />
    <div className={styles['wizard-logo-badge']}>
      <Icon icon="cloud" width="20" height="20" color="white" />
    </div>
  </div>
)

export const WizardNextButton = ({ children, ...props }) => {
  return (
    <Button className={styles['wizard-next']} {...props}>
      {children}
    </Button>
  )
}

export const WizardSelect = ({ children, narrow, medium, ...props }) => {
  return (
    <select
      className={cx(styles['wizard-select'], {
        [styles['wizard-select--narrow']]: narrow,
        [styles['wizard-select--medium']]: medium
      })}
      {...props}
    >
      {children}
    </select>
  )
}
