import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { useQuery, Q } from 'cozy-client'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'

import { Application } from 'cozy-doctypes'

import EyeIcon from 'cozy-ui/transpiled/react/Icons/Eye'

const KonnectorUpdateButton = ({ disabled, isBlocking, href, label }) => (
  <ButtonLink
    disabled={disabled}
    className="u-m-0"
    href={href}
    icon={EyeIcon}
    label={label}
    theme={isBlocking ? 'danger' : 'secondary'}
  />
)

const KonnectorUpdateLinker = ({ label, isBlocking, konnector }) => {
  const { data, fetchStatus } = useQuery(Q('io.cozy.apps'))
  const isLoaded = fetchStatus === 'loaded'
  const konnectorUpdateUrl = Application.getStoreInstallationURL(
    data,
    konnector
  )
  const isReady = isLoaded && konnectorUpdateUrl

  return isReady ? (
    <AppLinker slug="store" href={konnectorUpdateUrl}>
      {({ href }) => {
        return (
          <KonnectorUpdateButton
            href={href}
            isBlocking={isBlocking}
            label={label}
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
