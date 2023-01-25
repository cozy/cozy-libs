import React from 'react'
import PropTypes from 'prop-types'

import { findKonnectorPolicy } from '../../konnector-policies'
import RedirectToAccountFormButton from '../RedirectToAccountFormButton'
import OpenOAuthWindowButton from './OpenOAuthWindowButton'
import { intentsApiProptype } from '../../helpers/proptypes'

const TriggerErrorAction = ({
  flow,
  konnector,
  account,
  trigger,
  error,
  intentsApi
}) => {
  const konnectorPolicy = findKonnectorPolicy(konnector)

  if (!error.isSolvableViaReconnect()) return null

  if (konnectorPolicy.isBIWebView)
    return (
      <OpenOAuthWindowButton
        flow={flow}
        account={account}
        konnector={konnector}
        intentsApi={intentsApi}
      />
    )

  return <RedirectToAccountFormButton konnector={konnector} trigger={trigger} />
}

TriggerErrorAction.propTypes = {
  flow: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  account: PropTypes.object,
  trigger: PropTypes.object,
  error: PropTypes.object.isRequired,
  intentsApi: intentsApiProptype
}

export default TriggerErrorAction
