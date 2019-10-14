import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { withClient } from 'cozy-client'

import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Stack from 'cozy-ui/transpiled/react/Stack'
import flow from 'lodash/flow'

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
const NewAccountModal = ({ konnector, history, client, t }) => {
  const maintenanceStatus = useMaintenanceStatus(client, konnector.slug)
  const isInMaintenance = maintenanceStatus.isInMaintenance
  const maintenanceMessages = maintenanceStatus.messages

  return (
    <>
      <ModalContent className="u-mh-2">
        <Stack className="u-mb-3">
          <div className="u-w-3 u-h-3 u-mh-auto">
            <KonnectorIcon konnector={konnector} />
          </div>
          <h3 className="u-title-h3 u-ta-center">
            {t('modal.addAccount.title', { name: konnector.name })}
          </h3>
        </Stack>
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

export default flow(
  withRouter,
  translate(),
  withClient
)(NewAccountModal)
