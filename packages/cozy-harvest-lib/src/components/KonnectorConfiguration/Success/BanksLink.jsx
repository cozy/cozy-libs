import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppLinker from 'cozy-ui/react/AppLinker'
import { ButtonLink } from 'cozy-ui/react/Button'
import { queryConnect } from 'cozy-client'
import {
  getStoreUrltoInstallAnApp,
  isAppIsInstalled,
  getUrlForApp
} from '../../../helpers/apps'
import withLocales from '../../hoc/withLocales'

class BanksLinkRedirectStore extends Component {
  render() {
    const { apps, t } = this.props
    if (apps.fetchStatus === 'loaded') {
      const banksApp = {
        slug: 'banks'
      }
      let url = ''
      const banksInstalled = isAppIsInstalled(apps.data, banksApp)
      if (banksInstalled) {
        url = getUrlForApp(banksInstalled)
      } else {
        url = getStoreUrltoInstallAnApp(apps.data, banksApp)
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
    query: client => client.all('io.cozy.apps'),
    as: 'apps'
  }
})(withLocales(BanksLinkRedirectStore))

export default ConnectedBanksLinkRedirectStore
