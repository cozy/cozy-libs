import React from 'react'

import { useClient } from 'cozy-client'
import {
  VaultUnlockProvider as WrappedVaultUnlockProvider,
  CozyUtils
} from 'cozy-keys-lib'

const VaultUnlockProvider = ({ children, ...props }) => {
  const client = useClient()

  const addCheckShouldUnlock = () => {
    return CozyUtils.checkHasInstalledExtension(client)
  }

  return (
    <WrappedVaultUnlockProvider
      {...props}
      addCheckShouldUnlock={addCheckShouldUnlock}
    >
      {children}
    </WrappedVaultUnlockProvider>
  )
}

export default React.memo(VaultUnlockProvider)
