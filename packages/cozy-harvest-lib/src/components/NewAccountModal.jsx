import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { withClient } from 'cozy-client'
import cx from 'classnames'
import compose from 'lodash/flowRight'

import { ModalContent, ModalHeader } from 'cozy-ui/transpiled/react/Modal'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import TriggerManager from '../components/TriggerManager'
import KonnectorIcon from './KonnectorIcon'
import * as triggersModel from '../helpers/triggers'
import KonnectorMaintenance from './Maintenance'
import useMaintenanceStatus from './hooks/useMaintenanceStatus'

/**
 * We need to deal with `onLoginSuccess` and `onSucess` because we
 * can have a `onSuccess` without having a `onLoginSuccess` since only
 * few konnectors know if the login is success or not.
 *
 */
const NewAccountModal = ({
  konnector,
  history,
  client,
  breakpoints: { isMobile },
  onDismiss
}) => {
  const maintenanceStatus = useMaintenanceStatus(client, konnector.slug)
  const isInMaintenance = maintenanceStatus.isInMaintenance
  const maintenanceMessages = maintenanceStatus.messages

  return (
    <>
      <ModalHeader className="u-pr-2 u-mb-1">
        <KonnectorIcon
          konnector={konnector}
          className="u-db u-w-3 u-h-3 u-ml-auto u-mr-auto"
        />
      </ModalHeader>
      <ModalContent className={cx({ 'u-ph-1': isMobile })}>
        {isInMaintenance ? (
          <KonnectorMaintenance maintenanceMessages={maintenanceMessages} />
        ) : (
          <TriggerManager
            konnector={konnector}
            onLoginSuccess={trigger => {
              const accountId = triggersModel.getAccountId(trigger)
              history.push(`../accounts/${accountId}/success`)
            }}
            onSuccess={trigger => {
              const accountId = triggersModel.getAccountId(trigger)
              history.push(`../accounts/${accountId}/success`)
            }}
            onVaultDismiss={onDismiss}
          />
        )}
      </ModalContent>
    </>
  )
}

NewAccountModal.propTypes = {
  konnector: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default compose(
  withBreakpoints(),
  withRouter,
  withClient
)(NewAccountModal)
