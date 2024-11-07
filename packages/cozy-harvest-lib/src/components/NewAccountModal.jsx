import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'
import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useDialogContext } from './DialogContext'
import KonnectorIcon from './KonnectorIcon'
import KonnectorModalHeader from './KonnectorModalHeader'
import KonnectorMaintenance from './Maintenance'
import LegacyTriggerManager from './TriggerManager'
import { InformationsCard } from './cards/InformationsCard'
import useMaintenanceStatus from './hooks/useMaintenanceStatus'

/**
 * We need to deal with `onLoginSuccess` and `onSucess` because we
 * can have a `onSuccess` without having a `onLoginSuccess` since only
 * few konnectors know if the login is success or not.
 *
 */
const NewAccountModal = ({ konnector, onSuccess, onDismiss }) => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const {
    fetchStatus,
    data: { isInMaintenance, messages: maintenanceMessages }
  } = useMaintenanceStatus(konnector.slug)
  const isMaintenanceLoaded =
    fetchStatus === 'loaded' || fetchStatus === 'failed'
  const serverSideKonnector = !(konnector.oauth || konnector.clientSide)
  const { dialogTitleProps } = useDialogContext()
  const fieldOptions = {
    displaySecretPlaceholder: false
  }

  const handleSuccess = trigger => {
    if (onSuccess) {
      return onSuccess()
    }

    const accountId = triggersModel.getAccountId(trigger)
    navigate(`../accounts/${accountId}`, { replace: true, relative: 'path' })
  }

  return (
    <>
      {serverSideKonnector ? (
        <DialogTitle
          {...dialogTitleProps}
          className={cx(
            dialogTitleProps.className,
            'u-ta-center u-flex-column u-stack-m u-pb-1'
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
      ) : (
        <KonnectorModalHeader
          className="u-elevation-1 u-mb-1"
          konnector={konnector}
        />
      )}

      {!isMaintenanceLoaded ? (
        <DialogContent className="u-ta-center u-pt-1 u-pb-3">
          <Spinner size="xxlarge" />
        </DialogContent>
      ) : isInMaintenance ? (
        <DialogContent className="u-pt-0 u-pb-2">
          <KonnectorMaintenance maintenanceMessages={maintenanceMessages} />
        </DialogContent>
      ) : (
        <DialogContent className="u-pt-0">
          <LegacyTriggerManager
            konnector={konnector}
            onLoginSuccess={handleSuccess}
            onSuccess={handleSuccess}
            onVaultDismiss={onDismiss}
            fieldOptions={fieldOptions}
            onClose={onDismiss}
          />

          {!serverSideKonnector && (
            <InformationsCard className="u-mt-1" konnector={konnector} />
          )}

          {/*
            Necessary for correct padding-bottom in the DialogContent scroll
            container. u-pb-2 on DialogContent would not work in Firefox.
          */}
          <div className="u-mb-2" />
        </DialogContent>
      )}
    </>
  )
}

NewAccountModal.propTypes = {
  konnector: PropTypes.object.isRequired
}

export default NewAccountModal
