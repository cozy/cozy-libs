import React, { Component } from 'react'

import AppLinker from 'cozy-ui/react/AppLinker'
import { ButtonLink } from 'cozy-ui/react/Button'
import { queryConnect } from 'cozy-client'
import { getStoreUrltoInstallAnApp } from '../../../helpers/apps'
import withLocales from '../../hoc/withLocales'
class BanksLinkRedirectStore extends Component {
  render() {
    const { apps, t } = this.props
    if (apps.fetchStatus === 'loaded') {
      const url = getStoreUrltoInstallAnApp(apps.data, { slug: 'banks' })

      return (
        <AppLinker slug="banks" href={url}>
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
    }
    return null
  }
}
const ConnectedBanksLinkRedirectStore = queryConnect({
  apps: {
    query: client => client.all('io.cozy.apps'),
    as: 'apps'
  }
})(withLocales(BanksLinkRedirectStore))

const BanksLink = withLocales(({ banksUrl, t }) =>
  banksUrl ? (
    <AppLinker slug="banks" href={banksUrl}>
      {({ href, onClick, name }) => (
        <ButtonLink
          target="_top"
          icon="openwith"
          href={href}
          onClick={onClick}
          label={t('account.success.banksLinkText', {
            appName: name
          })}
          subtle
        />
      )}
    </AppLinker>
  ) : (
    /**
     * TODO AppLinker vers le store
     */
    <ConnectedBanksLinkRedirectStore />
  )
)

export default BanksLink
