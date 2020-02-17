import React from 'react'
import PropTypes from 'prop-types'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import { withClient } from 'cozy-client'
import useAppLinkWithStoreFallback from '../../hooks/useAppLinkWithStoreFallback'

import withLocales from '../../hoc/withLocales'

const BanksLinkRedirectStore = ({ client, t }) => {
  const slug = 'banks'
  const { fetchStatus, url } = useAppLinkWithStoreFallback(slug, client)

  if (fetchStatus === 'loaded') {
    return (
      <AppLinker slug={slug} href={url}>
        {({ href, name }) => (
          <ButtonLink
            icon="openwith"
            href={href}
            label={t('account.success.banksLinkText', {
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
}

BanksLinkRedirectStore.propTypes = {
  client: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}
const ConnectedBanksLinkRedirectStore = withClient(
  withLocales(BanksLinkRedirectStore)
)

export default ConnectedBanksLinkRedirectStore
