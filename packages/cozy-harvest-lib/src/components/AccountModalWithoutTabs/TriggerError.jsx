import React from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'

import useMaintenanceStatus from '../hooks/useMaintenanceStatus'
import TriggerErrorInfo from '../infos/TriggerErrorInfo'
import TriggerErrorAction from './TriggerErrorAction'

const TriggerError = ({ flow, konnector, account, trigger }) => {
  const client = useClient()
  const flowState = flow.getState()
  const { error } = flowState

  const {
    data: { isInMaintenance }
  } = useMaintenanceStatus(client, konnector)

  if (!error || isInMaintenance) return null

  return (
    <TriggerErrorInfo
      error={error}
      konnector={konnector}
      action={
        <TriggerErrorAction
          error={error}
          flow={flow}
          konnector={konnector}
          account={account}
          trigger={trigger}
        />
      }
      className="u-mt-1"
    />
  )
}

export default TriggerError

TriggerError.propTypes = {
  flow: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  account: PropTypes.object,
  trigger: PropTypes.object
}
