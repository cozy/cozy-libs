import React from 'react'
import PropTypes from 'prop-types'
import Card from 'cozy-ui/transpiled/react/Card'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Text, SubTitle } from 'cozy-ui/transpiled/react/Text'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useClient } from 'cozy-client'
import palette from 'cozy-ui/transpiled/react/palette'
import useAppLinkWithStoreFallback from '../hooks/useAppLinkWithStoreFallback'

const AppLinkCard = ({ slug, path, icon, iconColor }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()
  const cozyURL = new URL(client.getStackClient().uri)
  const { fetchStatus, url, isInstalled } = useAppLinkWithStoreFallback(
    slug,
    client,
    path
  )

  if (fetchStatus !== 'loaded') return null

  return (
    <Card>
      <Stack>
        <SubTitle>
          <Circle
            size="small"
            backgroundColor={palette[iconColor]}
            className="u-mr-half"
          >
            <Icon icon={icon} color={palette['white']} />
          </Circle>
          {t(`card.appLink.${slug}.title`)}
        </SubTitle>
        <Text>{t(`card.appLink.${slug}.description`)}</Text>
        <AppLinker slug={slug} nativePath={path} href={url}>
          {({ onClick, href }) => (
            <ButtonLink
              onClick={onClick}
              href={href}
              icon={
                isInstalled ? (
                  <AppIcon
                    app={slug}
                    domain={cozyURL.host}
                    secure={cozyURL.protocol === 'https:'}
                    className="u-w-1 u-h-1 u-mr-half"
                  />
                ) : (
                  'openwith'
                )
              }
              theme="secondary"
              label={t(
                `card.appLink.${slug}.${isInstalled ? 'button' : 'install'}`
              )}
              className={isMobile ? 'u-w-100' : null}
            />
          )}
        </AppLinker>
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
