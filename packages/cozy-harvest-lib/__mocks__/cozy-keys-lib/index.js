import { useEffect } from 'react'

const VaultUnlocker = ({ children, onUnlock }) => {
  useEffect(() => {
    onUnlock()
  }, [onUnlock])

  return children
}

VaultUnlocker.displayName = 'withI18n(withLocales(withClient(VaultUnlocker)))'

const CipherType = {
  Login: 'Login'
}

const withVaultClient = Component => Component

export { VaultUnlocker, CipherType, withVaultClient }
