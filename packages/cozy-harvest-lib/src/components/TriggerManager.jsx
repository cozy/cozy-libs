import compose from 'lodash/flowRight'
import React from 'react'

import { withClient } from 'cozy-client'
import {
  useVaultClient,
  withVaultUnlockContext,
  VaultUnlockPlaceholder
} from 'cozy-keys-lib'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import { DumbTriggerManager } from './DumbTriggerManager'
import FlowProvider from './FlowProvider'
import HarvestWrapper from './HarvestWrapper'
import withConnectionFlow from '../models/withConnectionFlow'

const TriggerManager = compose(
  translate(),
  withClient,
  withVaultUnlockContext,
  withConnectionFlow()
)(DumbTriggerManager)

// TriggerManager is exported wrapped in FlowProvider to avoid breaking changes.
export default function LegacyTriggerManager(props) {
  const {
    onLaunch,
    onSuccess,
    onLoginSuccess,
    onError,
    initialTrigger,
    konnector,
    ...otherProps
  } = props

  // Since the 4.1.0 of cozy-keys-lib, we
  // render children even if vaultClient is
  // not defined yet. In that case we we were
  // displaying TriggerManager without vaultClient.
  // It was raising an error.
  // The current fix, is to not display the
  // TriggerManager when vaultClient is null.
  const vaultClient = useVaultClient()
  if (!vaultClient) return null

  return (
    <FlowProvider
      onLaunch={onLaunch}
      onSuccess={onSuccess}
      onLoginSuccess={onLoginSuccess}
      onError={onError}
      konnector={konnector}
      initialTrigger={initialTrigger}
    >
      {({ flow }) => (
        <TriggerManager
          {...otherProps}
          error={flow.getState().error}
          flow={flow}
          konnector={konnector}
        />
      )}
    </FlowProvider>
  )
}

export const IntentTriggerManager = ({ vaultUnlockFormProps, ...props }) => {
  return (
    <HarvestWrapper>
      <LegacyTriggerManager {...props} />
      <VaultUnlockPlaceholder unlockFormProps={vaultUnlockFormProps} />
    </HarvestWrapper>
  )
}
