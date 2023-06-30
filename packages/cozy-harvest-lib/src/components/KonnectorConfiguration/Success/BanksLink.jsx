import PropTypes from 'prop-types'
import React from 'react'

import { withClient } from 'cozy-client'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'
import { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'

import withLocales from '../../hoc/withLocales'
import useAppLinkWithStoreFallback from '../../hooks/useAppLinkWithStoreFallback'

const BanksLinkRedirectStore = ({ client, t }) => {
  const slug = 'banks'
  const { fetchStatus, url } = useAppLinkWithStoreFallback(slug, client)

  if (fetchStatus === 'loaded') {
    return (
      <AppLinker app={{ slug }} href={url}>
        {({ href, name, onClick }) => (
          <ButtonLink
            icon={OpenwithIcon}
            href={href}
            label={t('account.success.banksLinkText', {
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
}

BanksLinkRedirectStore.propTypes = {
  client: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}
const ConnectedBanksLinkRedirectStore = withClient(
  withLocales(BanksLinkRedirectStore)
)

export default ConnectedBanksLinkRedirectStore
