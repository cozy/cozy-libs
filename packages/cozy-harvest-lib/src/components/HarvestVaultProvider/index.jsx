import React from 'react'
import { useClient } from 'cozy-client'
import { VaultProvider } from 'cozy-keys-lib'

const HarvestVaultProvider = props => {
  const client = useClient()
  const { children } = props
  const vaultInstanceUrl = client.getStackClient().uri
  return <VaultProvider instance={vaultInstanceUrl}>{children}</VaultProvider>
}

export default React.memo(HarvestVaultProvider)
