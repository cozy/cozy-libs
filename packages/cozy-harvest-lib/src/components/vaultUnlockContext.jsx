import React, { useMemo, useState } from 'react'
import { useContext } from 'react'
import { VaultUnlocker, useVaultClient } from 'cozy-keys-lib'

const vaultUnlockContext = React.createContext()
export const useVaultUnlockContext = () => {
  return useContext(vaultUnlockContext)
}

export const VaultUnlockProvider = ({ children }) => {
  const vaultClient = useVaultClient()
  const [showingUnlockForm, setShowingUnlockForm] = useState(false)
  const [unlockFormProps, setUnlockFormProps] = useState(null)

  const value = useMemo(() => {
    const showUnlockForm = unlockFormProps => {
      const onUnlock = () => {
        setShowingUnlockForm(false)
        unlockFormProps.onUnlock && unlockFormProps.onUnlock()
      }
      const onDismiss = () => {
        setShowingUnlockForm(false)
        unlockFormProps.onDismiss && unlockFormProps.onDismiss()
      }
      setUnlockFormProps({
        ...unlockFormProps,
        onUnlock,
        onDismiss
      })
      setShowingUnlockForm(true)
    }

    return {
      showingUnlockForm,
      showUnlockForm,
      unlockFormProps,
      vaultClient
    }
  }, [showingUnlockForm, unlockFormProps, vaultClient])

  return (
    <vaultUnlockContext.Provider value={value}>
      {children}
    </vaultUnlockContext.Provider>
  )
}

export const VaultUnlockPlaceholder = ({
  unlockFormProps: unlockFormPropsProp
}) => {
  const { showingUnlockForm, unlockFormProps } = useVaultUnlockContext()
  if (!showingUnlockForm) {
    return null
  }
  return <VaultUnlocker {...unlockFormProps} {...unlockFormPropsProp} />
}

export const withVaultUnlockContext = Component => {
  const Wrapper = props => {
    const vaultUnlockContextValue = useVaultUnlockContext()
    return <Component {...props} {...vaultUnlockContextValue} />
  }
  Wrapper.displayName = `withVaultUnlockContext(${Component.displayName ||
    Component.name})`
  return Wrapper
}
