import React, { memo } from 'react'
import PropTypes from 'prop-types'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { withClient } from 'cozy-client'
import useAppLinkWithStoreFallback from '../../hooks/useAppLinkWithStoreFallback'

const DriveLink = memo(({ folderId, client, t }) => {
  const slug = 'drive'
  const path = `#/files/${folderId}`
  const { fetchStatus, url } = useAppLinkWithStoreFallback(slug, client, path)

  if (fetchStatus === 'loaded') {
    return (
      <AppLinker slug={slug} href={url} nativePath={path}>
        {({ href, name }) => (
          <ButtonLink
            icon="openwith"
            href={href}
            label={t('account.success.driveLinkText', {
              appName: name
            })}
            subtle
          />
        )}
      </AppLinker>
    )
  } else {
    return (
      <ButtonLink
        icon="openwith"
        label={t('account.success.banksLinkText', {
          appName: name
        })}
        busy
        subtle
      />
    )
  }
})

DriveLink.displayName = 'DriveLink'
DriveLink.propTypes = {
  t: PropTypes.func.isRequired,
  folderId: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired
}
export default withClient(translate()(DriveLink))
