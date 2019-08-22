import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { Query } from 'cozy-client'
import AppLinker from 'cozy-ui/react/AppLinker'
import Button from 'cozy-ui/react/Button'

import { getStoreUrltoUpdateKonnector } from '../helpers/apps'

const KonnectorUpdateButton = ({
  disabled,
  isBlocking,
  href,
  label,
  onClick
}) => (
  <Button
    disabled={disabled}
    className="u-m-0"
    href={href}
    icon="eye"
    label={label}
    onClick={onClick}
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
                {({ href, onClick }) => (
                  <KonnectorUpdateButton
                    href={href}
                    isBlocking={isBlocking}
                    label={label}
                    onClick={onClick}
                  />
                )}
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
