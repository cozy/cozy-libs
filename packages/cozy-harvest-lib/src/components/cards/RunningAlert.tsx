import React, { useState } from 'react'

import { isFlagshipApp } from 'cozy-device-helper'
import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ArrowUp from 'cozy-ui/transpiled/react/Icons/ArrowUp'

export const RunningAlert = (): JSX.Element | null => {
  const { t } = useI18n()
  const [isVisible, setIsVisible] = useState(isFlagshipApp())
  const handleClose = (): void => setIsVisible(false)

  return isVisible ? (
    <Alert
      action={
        <Button
          variant="text"
          size="small"
          label={t('card.launchTrigger.runningAlert.button')}
          onClick={handleClose}
        />
      }
      block
      className="u-mt-1"
      icon={<Icon icon={ArrowUp} />}
    >
      <AlertTitle>{t('card.launchTrigger.runningAlert.title')}</AlertTitle>

      {t('card.launchTrigger.runningAlert.body')}
    </Alert>
  ) : null
}
