import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { useClient } from 'cozy-client'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'

import TriggerManager from './TriggerManager'
import KonnectorIcon from './KonnectorIcon'
import * as triggersModel from '../helpers/triggers'
import KonnectorMaintenance from './Maintenance'
import useMaintenanceStatus from './hooks/useMaintenanceStatus'
import { MountPointContext } from './MountPointContext'
import DialogContent from '@material-ui/core/DialogContent'
import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import { useDialogContext } from './DialogContext'

/**
 * We need to deal with `onLoginSuccess` and `onSucess` because we
 * can have a `onSuccess` without having a `onLoginSuccess` since only
 * few konnectors know if the login is success or not.
 *
 */
const NewAccountModal = ({ konnector, onDismiss }) => {
  const { t } = useI18n()
  const client = useClient()
  const { pushHistory } = useContext(MountPointContext)
  const {
    fetchStatus,
    data: { isInMaintenance, messages: maintenanceMessages }
  } = useMaintenanceStatus(client, konnector)
  const isMaintenanceLoaded =
    fetchStatus === 'loaded' || fetchStatus === 'failed'

  const { dialogTitleProps } = useDialogContext()
  return (
    <>
      <DialogTitle
        {...dialogTitleProps}
        className={cx(
          dialogTitleProps.className,
          'u-ta-center u-stack-m u-pb-1'
        )}
        disableTypography
      >
        <KonnectorIcon className="u-w-3 u-h-3" konnector={konnector} />
        <div>
          <Typography variant="h5">
            {t('modal.addAccount.title', { name: konnector.name })}
          </Typography>
        </div>
      </DialogTitle>
      {!isMaintenanceLoaded ? (
        <DialogContent className="u-ta-center u-pt-1 u-pb-3">
          <Spinner size="xxlarge" />
        </DialogContent>
      ) : (
        <DialogContent className="u-pt-0">
          {isInMaintenance ? (
            <KonnectorMaintenance maintenanceMessages={maintenanceMessages} />
          ) : (
            <TriggerManager
              konnector={konnector}
              onLoginSuccess={trigger => {
                const accountId = triggersModel.getAccountId(trigger)
                pushHistory(`/accounts/${accountId}/success`)
              }}
              onSuccess={trigger => {
                const accountId = triggersModel.getAccountId(trigger)
                pushHistory(`/accounts/${accountId}/success`)
              }}
              onVaultDismiss={onDismiss}
            />
          )}
        </DialogContent>
      )}
    </>
  )
}

NewAccountModal.propTypes = {
  konnector: PropTypes.object.isRequired
}

export default NewAccountModal
