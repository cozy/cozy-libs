import PropTypes from 'prop-types'
import React, { memo } from 'react'

import { withClient } from 'cozy-client'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'
import { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import useAppLinkWithStoreFallback from '../../hooks/useAppLinkWithStoreFallback'

const DriveLink = memo(({ folderId, client, t }) => {
  const slug = 'drive'
  const path = `#/files/${folderId}`
  const { fetchStatus, url } = useAppLinkWithStoreFallback(slug, client, path)

  if (fetchStatus === 'loaded') {
    return (
      <AppLinker app={{ slug }} href={url} nativePath={path}>
        {({ href, name, onClick }) => (
          <ButtonLink
            icon={OpenwithIcon}
            href={href}
            label={t('account.success.driveLinkText', {
              appName: name
            })}
            onClick={onClick}
            subtle
          />
        )}
      </AppLinker>
    )
  } else {
    return (
      <ButtonLink
        icon={OpenwithIcon}
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
