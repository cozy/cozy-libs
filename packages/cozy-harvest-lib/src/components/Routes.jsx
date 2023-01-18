import React, { useEffect } from 'react'

import { useVaultUnlockContext, VaultUnlockPlaceholder } from 'cozy-keys-lib'
import { withStyles } from 'cozy-ui/transpiled/react/styles'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { useKonnectorWithTriggers } from '../helpers/useKonnectorWithTriggers'
import ComponentsPropsProvider from './Providers/ComponentsPropsProvider'
import { DatacardOptions } from './Datacards/DatacardOptionsContext'
import RoutesV4 from './Routes/RoutesV4'
import RoutesV6 from './Routes/RoutesV6'
import KonnectorAccounts from './KonnectorAccounts'
import HarvestVaultProvider from './HarvestVaultProvider'
import VaultUnlockProvider from './VaultUnlockProvider'
import { MountPointProvider } from './MountPointContext'
import DialogContext from './DialogContext'
import { isRouterV6 } from './hoc/withRouter'

/**
 * Dialog will not be centered vertically since we need the modal to "stay in place"
 * when changing tabs. Since tabs content's height is not the same between the data
 * tab and the configuration, having the modal vertically centered makes it "jump"
 * when changing tabs.
 */
const HarvestDialog = withStyles({
  scrollPaper: {
    alignItems: 'start'
  },

  // Necessary to prevent warnings at runtime
  paper: {}
})(props => {
  const { showingUnlockForm } = useVaultUnlockContext()
  if (showingUnlockForm) {
    return null
  }

  return <Dialog disableRestoreFocus {...props} />
})

const Routes = ({
  konnectorRoot,
  konnector,
  konnectorSlug,
  onSuccess,
  onDismiss,
  datacardOptions,
  ComponentsProps
}) => {
  const RoutesV4orV6 = isRouterV6 ? RoutesV6 : RoutesV4

  const { t } = useI18n()
  const dialogContext = useCozyDialog({
    size: 'l',
    open: true,
    onClose: onDismiss,
    disableTitleAutoPadding: true
  })

  const { konnectorWithTriggers, fetching, notFoundError } =
    useKonnectorWithTriggers(konnectorSlug, konnector)

  useEffect(() => {
    if (notFoundError) {
      onDismiss()
      Alerter.error(t('error.application-not-found'))
    }
  }, [notFoundError, onDismiss, t])

  return (
    <DatacardOptions options={datacardOptions}>
      <MountPointProvider baseRoute={konnectorRoot}>
        <DialogContext.Provider value={dialogContext}>
          <HarvestVaultProvider>
            <VaultUnlockProvider>
              <ComponentsPropsProvider ComponentsProps={ComponentsProps}>
                <HarvestDialog
                  {...dialogContext.dialogProps}
                  aria-label={konnectorWithTriggers.name}
                >
                  <DialogCloseButton onClick={onDismiss} />
                  {fetching ? (
                    <div className="u-pv-2 u-ta-center">
                      <Spinner size="xxlarge" />
                    </div>
                  ) : (
                    <KonnectorAccounts konnector={konnectorWithTriggers}>
                      {accountsAndTriggers => (
                        <RoutesV4orV6
                          konnectorRoot={konnectorRoot}
                          konnectorWithTriggers={konnectorWithTriggers}
                          accountsAndTriggers={accountsAndTriggers}
                          onSuccess={onSuccess}
                          onDismiss={onDismiss}
                        />
                      )}
                    </KonnectorAccounts>
                  )}
                </HarvestDialog>
              </ComponentsPropsProvider>
              <VaultUnlockPlaceholder />
            </VaultUnlockProvider>
          </HarvestVaultProvider>
        </DialogContext.Provider>
      </MountPointProvider>
    </DatacardOptions>
  )
}

export default Routes
