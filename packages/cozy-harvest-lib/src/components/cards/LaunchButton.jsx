// @ts-check on
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'
import Button from 'cozy-ui/transpiled/react/Buttons'

import { isDisconnected } from '../../helpers/konnectors'
import { findKonnectorPolicy } from '../../konnector-policies'
import OpenOAuthWindowButton from '../AccountModalWithoutTabs/OpenOAuthWindowButton'

function LaunchButton({
  konnectorRoot,
  trigger,
  isInError = false,
  isRunning = false,
  error,
  flow,
  account,
  intentsApi
} = {}) {
  const { t } = useI18n()
  const navigate = useNavigate()

  const { launch, konnector } = flow

  const isKonnectorDisconnected = isDisconnected(konnector, trigger)
  const konnectorPolicy = findKonnectorPolicy(konnector)

  const onSync = () => {
    if (konnectorPolicy.shouldLaunchRedirectToEdit(error)) {
      return navigate(
        konnectorRoot
          ? `${konnectorRoot}/accounts/${triggersModel.getAccountId(
              trigger
            )}/edit`
          : '/edit'
      )
    } else {
      launch({ autoSuccessTimer: false })
    }
  }

  if (isKonnectorDisconnected) {
    return null
  }

  if (konnectorPolicy.shouldLaunchDisplayOAuthWindow(error)) {
    return (
      <OpenOAuthWindowButton
        flow={flow}
        account={account}
        intentsApi={intentsApi}
        konnector={konnector}
      />
    )
  }

  return (
    <Button
      variant="text"
      color={isInError ? 'error' : undefined}
      size="small"
      disabled={isRunning}
      label={t('card.launchTrigger.button.label')}
      onClick={onSync}
    />
  )
}

export { LaunchButton }
