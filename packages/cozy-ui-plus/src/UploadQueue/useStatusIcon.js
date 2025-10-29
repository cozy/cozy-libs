import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckCircleIcon from 'cozy-ui/transpiled/react/Icons/CheckCircle'
import CrossCircleIcon from 'cozy-ui/transpiled/react/Icons/CrossCircle'
import WarningIcon from 'cozy-ui/transpiled/react/Icons/Warning'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { uploadStatus } from './index'

export const useStatusIcon = (statusToUse, progress) => {
  const { CANCEL, LOADING, DONE_STATUSES, ERROR_STATUSES, PENDING } =
    uploadStatus
  const SuccessIcon = CheckCircleIcon
  const ErrorIcon = CrossCircleIcon

  let statusIcon

  if (statusToUse === LOADING) {
    statusIcon = !progress ? <Spinner color="var(--primaryColor)" /> : null
  } else if (statusToUse === CANCEL) {
    statusIcon = <Icon icon={ErrorIcon} color="var(--errorColor)" />
  } else if (ERROR_STATUSES.includes(statusToUse)) {
    statusIcon = <Icon icon={WarningIcon} color="var(--errorColor)" />
  } else if (DONE_STATUSES.includes(statusToUse)) {
    statusIcon = <Icon icon={SuccessIcon} color="var(--successColor)" />
  } else if (statusToUse === PENDING) {
    statusIcon = null
  }

  return statusIcon
}
