import React from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'
import { VaultProvider } from 'cozy-keys-lib'

let localConfig
try {
  localConfig = require('./local.config.json')
} catch (error) {}

class HarvestVaultProvider extends React.PureComponent {
  render() {
    const { children, client } = this.props

    let vaultInstanceUrl
    let useUnsafeStorage
    if (localConfig) {
      vaultInstanceUrl = localConfig.keysInstance
      useUnsafeStorage = true
    } else {
      vaultInstanceUrl = client.getStackClient().uri
      useUnsafeStorage = false
    }

    return (
      <VaultProvider
        instance={vaultInstanceUrl}
        unsafeStorage={useUnsafeStorage}
      >
        {children}
      </VaultProvider>
    )
  }
}

HarvestVaultProvider.propTypes = {
  client: PropTypes.object
}

export default withClient(HarvestVaultProvider)
