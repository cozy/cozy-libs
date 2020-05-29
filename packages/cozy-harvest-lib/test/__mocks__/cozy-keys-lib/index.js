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

const UriMatchType = {
  Domain: 'Domain'
}

const FieldType = {
  Text: 0,
  Hidden: 1,
  Boolean: 2
}

console.log('Using cozy-keys-lib from __mocks__')

const withVaultClient = Component => Component

export { VaultUnlocker, CipherType, withVaultClient, UriMatchType, FieldType }
