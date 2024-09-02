import PropTypes from 'prop-types'
import React, { useEffect } from 'react'

import { useVaultUnlockContext, VaultUnlockPlaceholder } from 'cozy-keys-lib'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { DatacardOptions } from './Datacards/DatacardOptionsContext'
import DialogContext from './DialogContext'
import HarvestWrapper from './HarvestWrapper'
import KonnectorAccounts from './KonnectorAccounts'
import RoutesV4 from './Routes/RoutesV4'
import RoutesV6 from './Routes/RoutesV6'
import { isRouterV6 } from './hoc/withRouter'
import { useKonnectorWithTriggers } from '../helpers/useKonnectorWithTriggers'

const HarvestDialog = props => {
  const { showingUnlockForm } = useVaultUnlockContext()
  if (showingUnlockForm) {
    return null
  }

  return <Dialog disableRestoreFocus {...props} />
}

const Routes = ({
  konnectorRoot,
  konnector,
  konnectorSlug,
  onSuccess,
  onDismiss,
  datacardOptions,
  ComponentsProps,
  closable,
  intentData,
  intentId
}) => {
  const RoutesV4orV6 = isRouterV6 ? RoutesV6 : RoutesV4

  const { t } = useI18n()
  const dialogContext = useCozyDialog({
    size: 'l',
    open: true,
    onClose: onDismiss,
    disableTitleAutoPadding: true
  })
  const { showAlert } = useAlert()

  const { konnectorWithTriggers, fetching, notFoundError } =
    useKonnectorWithTriggers(konnectorSlug, konnector)

  useEffect(() => {
    if (notFoundError) {
      onDismiss()
      showAlert({
        message: t('error.application-not-found'),
        severity: 'error'
      })
    }
  }, [notFoundError, onDismiss, t, showAlert])

  return (
    <DatacardOptions options={datacardOptions}>
      <HarvestWrapper
        mountPointProviderProps={{ baseRoute: konnectorRoot }}
        componentsPropsProviderProps={{ ComponentsProps: ComponentsProps }}
        intentData={intentData}
        intentId={intentId}
      >
        <DialogContext.Provider value={dialogContext}>
          <HarvestDialog
            {...dialogContext.dialogProps}
            aria-label={konnectorWithTriggers.name}
          >
            {closable !== false ? (
              <DialogCloseButton onClick={onDismiss} />
            ) : null}
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
        </DialogContext.Provider>
        <VaultUnlockPlaceholder />
      </HarvestWrapper>
    </DatacardOptions>
  )
}

Routes.propTypes = {
  /** The root URL of the konnector */
  konnectorRoot: PropTypes.string,
  /** The konnector object */
  konnector: PropTypes.object,
  /** The slug of the konnector */
  konnectorSlug: PropTypes.string.isRequired,
  /** The function to call when the harvest is successful */
  onSuccess: PropTypes.func.isRequired,
  /** The function to call when the dialog is dismissed */
  onDismiss: PropTypes.func.isRequired,
  /** The props for the components */
  ComponentsProps: PropTypes.object,
  /** Whether the dialog is closable or not */
  closable: PropTypes.bool,
  /** Data received from the Intent if called from an intent */
  intentData: PropTypes.object,
  /** Id of the intent if called from an intent */
  intentId: PropTypes.string
}

export default Routes
