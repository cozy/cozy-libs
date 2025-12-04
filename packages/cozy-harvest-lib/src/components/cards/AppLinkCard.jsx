import PropTypes from 'prop-types'
import React from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Card from 'cozy-ui/transpiled/react/Card'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Typography from 'cozy-ui/transpiled/react/Typography'
import palette from 'cozy-ui/transpiled/react/palette'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import AppIcon from 'cozy-ui-plus/dist/AppIcon'
import AppLinker from 'cozy-ui-plus/dist/AppLinker'

import { useIntentProviderData } from '../Providers/IntentProvider'
import useAppLinkWithStoreFallback from '../hooks/useAppLinkWithStoreFallback'

export const AppLinkButton = ({ slug, path }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()
  const cozyURL = new URL(client.getStackClient().uri)
  const { fetchStatus, url, isInstalled } = useAppLinkWithStoreFallback(
    slug,
    client,
    path
  )

  const { intentId } = useIntentProviderData()
  return (
    <AppLinker app={{ slug }} nativePath={path} href={url || '#'}>
      {({ onClick, href }) => (
        <Button
          disabled={fetchStatus !== 'loaded'}
          onClick={fetchStatus === 'loaded' ? onClick : null}
          href={href}
          component="a"
          {...(intentId ? { target: '_blank' } : {})}
          startIcon={
            isInstalled ? (
              <AppIcon
                app={slug}
                domain={cozyURL.host}
                secure={cozyURL.protocol === 'https:'}
                className="u-w-1 u-h-1 u-mr-half"
              />
            ) : (
              <Icon icon="openwith" />
            )
          }
          variant="secondary"
          label={t(
            `card.appLink.${slug}.${isInstalled ? 'button' : 'install'}`
          )}
          className={isMobile ? 'u-w-100' : null}
        />
      )}
    </AppLinker>
  )
}

const AppLinkCard = ({ slug, path, icon, iconColor }) => {
  const { t } = useI18n()

  return (
    <Card>
      <Stack>
        <Typography variant="h6" gutterBottom>
          {icon ? (
            <Circle
              size="small"
              backgroundColor={palette[iconColor]}
              className="u-mr-half"
            >
              <Icon icon={icon} color={palette['white']} />
            </Circle>
          ) : null}
          {t(`card.appLink.${slug}.title`)}
        </Typography>
        <Typography variant="body1">
          {t(`card.appLink.${slug}.description`)}
        </Typography>
        <AppLinkButton path={path} slug={slug} />
      </Stack>
    </Card>
  )
}

AppLinkCard.propTypes = {
  slug: PropTypes.string.isRequired,
  path: PropTypes.string,
  icon: PropTypes.string.isRequired,
  iconColor: PropTypes.string
}

AppLinkCard.defaultProps = {
  path: '/',
  iconColor: 'primaryColor'
}

export default AppLinkCard
