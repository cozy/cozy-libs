import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { withClient } from 'cozy-client'
import useAppLinkWithStoreFallback from '../../hooks/useAppLinkWithStoreFallback'

const DriveLink = memo(({ folderId, client, t }) => {
  const { fetchStatus, url, isInstalled } = useAppLinkWithStoreFallback(
    'drive',
    client,
    `#/files/${folderId}`
  )
  const href = fetchStatus === 'loaded' && isInstalled ? url : undefined

  return (
    <ButtonLink
      href={href}
      target="_parent"
      disabled={!isInstalled}
      subtle
      icon="openwith"
      label={t('account.success.driveLinkText')}
    />
  )
})

DriveLink.displayName = 'DriveLink'
DriveLink.propTypes = {
  t: PropTypes.func.isRequired,
  folderId: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired
}
export default withClient(translate()(DriveLink))
