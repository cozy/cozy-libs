import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useI18n } from 'twake-i18n'

import { useVaultUnlockContext, VaultUnlockPlaceholder } from 'cozy-keys-lib'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { DatacardOptions } from './Datacards/DatacardOptionsContext'
import DialogContext from './DialogContext'
import HarvestWrapper from './HarvestWrapper'
import { InternalRoutes } from './InternalRoutes'
import KonnectorAccounts from './KonnectorAccounts'
import { useKonnectorWithTriggers } from '../helpers/useKonnectorWithTriggers'

const HarvestDialog = props => {
  const { showingUnlockForm } = useVaultUnlockContext()
  if (showingUnlockForm) {
    return null
  }

  return <Dialog disableRestoreFocus {...props} />
}

const HarvestRoutes = ({
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
                  <InternalRoutes
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

HarvestRoutes.propTypes = {
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

export default HarvestRoutes
