import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import { queryConnect, Q } from 'cozy-client'

import { Application } from 'cozy-doctypes'

import withLocales from '../../hoc/withLocales'

class BanksLinkRedirectStore extends Component {
  render() {
    const { apps, t } = this.props
    if (apps.fetchStatus === 'loaded') {
      const banksApp = {
        slug: 'banks'
      }
      let url = ''
      const banksInstalled = Application.isInstalled(apps.data, banksApp)
      if (banksInstalled) {
        url = Application.getUrl(banksInstalled)
      } else {
        url = Application.getStoreInstallationURL(apps.data, banksApp)
      }

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
  apps: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
}
const ConnectedBanksLinkRedirectStore = queryConnect({
  apps: {
    query: () => Q('io.cozy.apps'),
    as: 'apps'
  }
})(withLocales(BanksLinkRedirectStore))

export default ConnectedBanksLinkRedirectStore
