import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { IllustrationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import IntentModal from 'cozy-ui/transpiled/react/deprecated/IntentModal'

import { APPS_DOCTYPE } from '../../doctypes'

const InstallAppFromIntent = () => {
  const [showIntent, setShowIntent] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const client = useClient()
  const { t } = useI18n()

  const handleTerminate = () => {
    return navigate(`${searchParams.get('redirect')}`, {
      replace: true
    })
  }

  const handleClose = () => {
    return navigate('..')
  }

  if (showIntent) {
    return (
      <IntentModal
        action="INSTALL"
        doctype={APPS_DOCTYPE}
        mobileFullscreen
        options={{ slug: 'notes' }}
        create={client.intents.create}
        onComplete={handleTerminate}
        dismissAction={handleClose}
      />
    )
  }

  return (
    <IllustrationDialog
      open
      size="small"
      onClose={handleClose}
      title={
        <div className="u-flex u-flex-column u-flex-items-center">
          <div className="u-mv-1">
            <Icon icon="file-type-note" size={96} />
          </div>
          <Typography variant="h3" className="u-ta-center">
            {t('InstallAppFromIntent.title')}
          </Typography>
        </div>
      }
      content={
        <Typography className="u-ta-center">
          {t('InstallAppFromIntent.text')}
        </Typography>
      }
      actions={
        <Button
          fullWidth
          label={t('InstallAppFromIntent.action')}
          endIcon={<Icon icon="openwith" aria-hidden />}
          onClick={() => setShowIntent(true)}
        />
      }
    />
  )
}

export default InstallAppFromIntent
