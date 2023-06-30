import PropTypes from 'prop-types'
import React, { memo } from 'react'

import { useQuery } from 'cozy-client'
import { Application } from 'cozy-doctypes'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import EyeIcon from 'cozy-ui/transpiled/react/Icons/Eye'
import { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'

import { appsConn } from '../connections/apps'

const KonnectorUpdateButton = ({
  disabled,
  isBlocking,
  href,
  onClick,
  label
}) => (
  <ButtonLink
    disabled={disabled}
    className="u-m-0"
    href={href}
    onClick={onClick}
    icon={EyeIcon}
    label={label}
    theme={isBlocking ? 'danger' : 'secondary'}
  />
)

const KonnectorUpdateLinker = ({ label, isBlocking, konnector }) => {
  const { data, fetchStatus } = useQuery(appsConn.query, appsConn)
  const isLoaded = fetchStatus === 'loaded'
  const konnectorUpdateUrl = data
    ? Application.getStoreInstallationURL(data, konnector)
    : null
  const isReady = isLoaded && konnectorUpdateUrl

  return isReady ? (
    <AppLinker app={{ slug: 'store' }} href={konnectorUpdateUrl}>
      {({ onClick, href }) => {
        return (
          <KonnectorUpdateButton
            href={href}
            isBlocking={isBlocking}
            label={label}
            onClick={onClick}
          />
        )
      }}
    </AppLinker>
  ) : (
    <KonnectorUpdateButton
      disabled={true}
      label={label}
      isBlocking={isBlocking}
    />
  )
}

KonnectorUpdateLinker.propTypes = {
  isBlocking: PropTypes.bool,
  konnector: PropTypes.object.isRequired,
  label: PropTypes.string
}

export default memo(KonnectorUpdateLinker)
