import React from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'
import { VaultProvider } from 'cozy-keys-lib'

class HarvestVaultProvider extends React.PureComponent {
  render() {
    const { children, client } = this.props

    const vaultInstanceUrl = client.getStackClient().uri

    return <VaultProvider instance={vaultInstanceUrl}>{children}</VaultProvider>
  }
}

HarvestVaultProvider.propTypes = {
  client: PropTypes.object
}

export default withClient(HarvestVaultProvider)
