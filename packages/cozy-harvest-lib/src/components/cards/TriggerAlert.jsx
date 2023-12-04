import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ErrorAlert } from './ErrorAlert'
import { MaintenanceAlert } from './MaintenanceAlert'
import { RunnableAlert } from './RunnableAlert'
import { makeLabel } from './helpers'

const TriggerAlert = ({
  trigger,
  isInMaintenance,
  isInError,
  isRunning,
  isRunnable,
  withMaintenanceDescription,
  error,
  maintenanceMessages,
  account,
  konnectorRoot,
  historyAction,
  intentsApi,
  flow
}) => {
  const { t } = useI18n()
  const { konnector } = flow

  const label = makeLabel({
    t,
    konnector,
    trigger,
    isRunning,
    isInMaintenance
  })

  if (isInMaintenance) {
    return (
      <MaintenanceAlert
        label={label}
        withDescription={withMaintenanceDescription}
        messages={maintenanceMessages}
        isRunnable={isRunnable}
        historyAction={historyAction}
        konnectorRoot={konnectorRoot}
        trigger={trigger}
        konnector={konnector}
      />
    )
  }

  if (isInError) {
    return (
      <ErrorAlert
        label={label}
        error={error}
        konnectorRoot={konnectorRoot}
        trigger={trigger}
        isRunning={isRunning}
        isRunnable={isRunnable}
        historyAction={historyAction}
        flow={flow}
        account={account}
        intentsApi={intentsApi}
      />
    )
  }

  return (
    <RunnableAlert
      label={label}
      isRunning={isRunning}
      konnectorSlug={konnector.slug}
      konnectorRoot={konnectorRoot}
      trigger={trigger}
      error={error}
      historyAction={historyAction}
      flow={flow}
      account={account}
      intentsApi={intentsApi}
      isRunnable={isRunnable}
    />
  )
}

export { TriggerAlert }
