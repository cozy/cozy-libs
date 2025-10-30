import PropTypes from 'prop-types'
import React from 'react'

import { withClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'
import AppLinker from 'cozy-ui-plus/dist/AppLinker'

import withLocales from '../../hoc/withLocales'
import useAppLinkWithStoreFallback from '../../hooks/useAppLinkWithStoreFallback'

const BanksLinkRedirectStore = ({ client, t }) => {
  const slug = 'banks'
  const { fetchStatus, url } = useAppLinkWithStoreFallback(slug, client)

  if (fetchStatus === 'loaded') {
    return (
      <AppLinker app={{ slug }} href={url}>
        {({ href, name, onClick }) => (
          <Button
            component="a"
            icon={OpenwithIcon}
            href={href}
            label={t('account.success.banksLinkText', {
              appName: name
            })}
            onClick={onClick}
            variant="text"
          />
        )}
      </AppLinker>
    )
  } else {
    return (
      <Button
        component="a"
        icon={OpenwithIcon}
        label={t('account.success.banksLinkText', {
          appName: name
        })}
        busy
        variant="text"
      />
    )
  }
}

BanksLinkRedirectStore.propTypes = {
  client: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}
const ConnectedBanksLinkRedirectStore = withClient(
  withLocales(BanksLinkRedirectStore)
)

export default ConnectedBanksLinkRedirectStore
