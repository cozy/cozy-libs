/* global cozy */

import React from 'react'

import AppLinker from 'cozy-ui/react/AppLinker'
import { translate } from 'cozy-ui/react/I18n'
import { ButtonLink } from 'cozy-ui/react/Button'

const BanksLink = translate()(({ banksUrl, t }) =>
  banksUrl ? (
    <AppLinker slug="banks" href={banksUrl}>
      {({ href, onClick, name }) => (
        <ButtonLink
          target="_top"
          icon="openwith"
          href={href}
          onClick={onClick}
          label={t('modal.account.success.banksLinkText', {
            appName: name
          })}
          subtle
        />
      )}
    </AppLinker>
  ) : (
    <ButtonLink
      icon="openwith"
      onClick={() =>
        cozy.client.intents.redirect('io.cozy.apps', { slug: 'banks' }, url => {
          window.top.location.href = url
        })
      }
      label={t('modal.account.success.banksLinkText')}
      subtle
    />
  )
)

export default BanksLink
