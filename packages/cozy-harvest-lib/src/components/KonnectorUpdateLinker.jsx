import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { Query } from 'cozy-client'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'

import { getStoreUrltoUpdateKonnector } from '../helpers/apps'

const KonnectorUpdateButton = ({ disabled, isBlocking, href, label }) => (
  <ButtonLink
    disabled={disabled}
    className="u-m-0"
    href={href}
    icon="eye"
    label={label}
    theme={isBlocking ? 'danger' : 'secondary'}
  />
)

export class KonnectorUpdateLinker extends PureComponent {
  render() {
    const { label, isBlocking, konnector } = this.props
    return (
      <Query query={client => client.all('io.cozy.apps')}>
        {({ data, fetchStatus }) => {
          const isLoaded = fetchStatus === 'loaded'
          const konnectorUpdateUrl = getStoreUrltoUpdateKonnector(
            data,
            konnector
          )
          const isReady = isLoaded && konnectorUpdateUrl
          if (isReady) {
            return (
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
            )
          } else {
            return (
              <KonnectorUpdateButton
                disabled={true}
                label={label}
                isBlocking={isBlocking}
              />
            )
          }
        }}
      </Query>
    )
  }
}

KonnectorUpdateLinker.propTypes = {
  isBlocking: PropTypes.bool,
  konnector: PropTypes.object.isRequired,
  label: PropTypes.string
}

export default KonnectorUpdateLinker
