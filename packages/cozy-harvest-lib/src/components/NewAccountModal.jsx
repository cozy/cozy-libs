import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { withClient } from 'cozy-client'

import { ModalContent } from 'cozy-ui/transpiled/react/Modal'

import TriggerManager from '../components/TriggerManager'
import KonnectorModalHeader from './KonnectorModalHeader'
import * as triggersModel from '../helpers/triggers'
import KonnectorMaintenance from './Maintenance'
import useMaintenanceStatus from './hooks/useMaintenanceStatus'

/**
 * We need to deal with `onLoginSuccess` and `onSucess` because we
 * can have a `onSuccess` without having a `onLoginSuccess` since only
 * few konnectors know if the login is success or not.
 *
 */
const NewAccountModal = ({ konnector, history, client }) => {
  const maintenanceStatus = useMaintenanceStatus(client, konnector.slug)
  const isInMaintenance = maintenanceStatus.isInMaintenance
  const maintenanceMessages = maintenanceStatus.messages

  return (
    <>
      <KonnectorModalHeader konnector={konnector} />
      <ModalContent>
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

export default withRouter(withClient(NewAccountModal))
