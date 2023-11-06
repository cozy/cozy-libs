import PropTypes from 'prop-types'
import React from 'react'

import TriggerErrorAction from './TriggerErrorAction'
import { intentsApiProptype } from '../../helpers/proptypes'
import useMaintenanceStatus from '../hooks/useMaintenanceStatus'
import TriggerErrorInfo from '../infos/TriggerErrorInfo'

const TriggerError = ({ flow, konnector, account, trigger, intentsApi }) => {
  const flowState = flow.getState()
  const { error } = flowState

  const {
    data: { isInMaintenance }
  } = useMaintenanceStatus(konnector.slug)

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
          intentsApi={intentsApi}
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
  trigger: PropTypes.object,
  intentsApi: intentsApiProptype
}
