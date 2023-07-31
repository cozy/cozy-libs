import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useClient, useQuery } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { IllustrationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import IntentModal from 'cozy-ui/transpiled/react/deprecated/IntentModal'

import { APPS_DOCTYPE } from '../../doctypes'
import { buildAppRegistryQueryBySlug } from '../../helpers/queries'

const InstallAppFromIntent = () => {
  const [showIntent, setShowIntent] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const client = useClient()
  const { t } = useI18n()

  const appRegistryQuery = buildAppRegistryQueryBySlug('notes')
  const { data: appData } = useQuery(
    appRegistryQuery.definition,
    appRegistryQuery.options
  )

  const { name: noteName, slug: noteSlug } =
    appData?.latest_version?.manifest || {}

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
        options={{ slug: noteSlug }}
        create={client.intents.create}
        onComplete={handleTerminate}
        dismissAction={handleClose}
      />
    )
  }

  const title = (
    <div className="u-flex u-flex-column u-flex-items-center">
      <div className="u-mv-1" style={{ height: 96, width: 96 }}>
        {noteSlug ? (
          <AppIcon app={noteSlug} />
        ) : (
          <Skeleton variant="rect" width={96} height={96} />
        )}
      </div>
      <Typography variant="h3" className="u-ta-center">
        {t('InstallAppFromIntent.title')}
      </Typography>
    </div>
  )

  const content = noteName ? (
    <Typography className="u-ta-center">
      {t('InstallAppFromIntent.text', { appName: noteName })}
    </Typography>
  ) : (
    <div className="u-ta-center">
      <Spinner size="xxlarge" />
    </div>
  )

  return (
    <IllustrationDialog
      open
      size="small"
      onClose={handleClose}
      title={title}
      content={content}
      actions={
        <Button
          fullWidth
          label={t('InstallAppFromIntent.action')}
          endIcon={<Icon icon="openwith" aria-hidden />}
          onClick={() => setShowIntent(true)}
          disabled={!noteName}
        />
      }
    />
  )
}

export default InstallAppFromIntent
