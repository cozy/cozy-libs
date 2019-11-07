import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'

import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import flow from 'lodash/flow'

import TriggerManager from '../components/TriggerManager'
import KonnectorIcon from './KonnectorIcon'
import * as triggersModel from '../helpers/triggers'
import KonnectorMaintenance from './Maintenance'
import useMaintenanceStatus from './hooks/useMaintenanceStatus'
import { MountPointContext } from './MountPointContext'

/**
 * We need to deal with `onLoginSuccess` and `onSucess` because we
 * can have a `onSuccess` without having a `onLoginSuccess` since only
 * few konnectors know if the login is success or not.
 *
 */
const NewAccountModal = ({ konnector, client, t }) => {
  const { pushHistory } = useContext(MountPointContext)
  const {
    fetchStatus,
    data: { isInMaintenance, messages: maintenanceMessages }
  } = useMaintenanceStatus(client, konnector.slug)
  const isMaintenanceLoaded =
    fetchStatus === 'loaded' || fetchStatus === 'failed'

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
        {!isMaintenanceLoaded && (
          <div className="u-ta-center">
            <Spinner size="xxlarge" />
          </div>
        )}
        {isMaintenanceLoaded && isInMaintenance && (
          <KonnectorMaintenance maintenanceMessages={maintenanceMessages} />
        )}
        {isMaintenanceLoaded && !isInMaintenance && (
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
          />
        )}
      </ModalContent>
    </>
  )
}

NewAccountModal.propTypes = {
  konnector: PropTypes.object.isRequired
}

export default flow(
  translate(),
  withClient
)(NewAccountModal)
