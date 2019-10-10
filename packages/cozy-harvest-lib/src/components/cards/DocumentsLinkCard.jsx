import React from 'react'
import PropTypes from 'prop-types'
import Card from 'cozy-ui/transpiled/react/Card'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import AppLinker, { generateWebLink } from 'cozy-ui/transpiled/react/AppLinker'
import AppIcon from 'cozy-ui/react/AppIcon'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Text, SubTitle } from 'cozy-ui/transpiled/react/Text'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import palette from 'cozy-ui/transpiled/react/palette'
import { withBreakpoints } from 'cozy-ui/transpiled/react'
import { withClient } from 'cozy-client'

const DocumentsLinkCard = ({
  folderId,
  breakpoints: { isMobile },
  client,
  t
}) => {
  const nativePath = `/files/${folderId}`
  const appSlug = 'drive'
  const cozyURL = new URL(client.getStackClient().uri)

  return (
    <Card>
      <Stack>
        <SubTitle>
          <Circle
            size="small"
            backgroundColor={palette['puertoRico']}
            className="u-mr-half"
          >
            <Icon icon="file" color={palette['white']} />
          </Circle>
          {t('card.documentsLink.title')}
        </SubTitle>
        <Text>{t('card.documentsLink.description')}</Text>
        <AppLinker
          slug={appSlug}
          nativePath={nativePath}
          href={generateWebLink({
            cozyUrl: cozyURL.origin,
            slug: appSlug,
            nativePath: nativePath
          })}
        >
          {({ onClick, href }) => (
            <ButtonLink
              onClick={onClick}
              href={href}
              icon={
                <AppIcon
                  app={appSlug}
                  domain={cozyURL.host}
                  secure={cozyURL.protocol === 'https:'}
                  className="u-w-1 u-h-1 u-mr-half"
                />
              }
              theme="secondary"
              label={t('card.documentsLink.button')}
              className={isMobile ? 'u-w-100' : null}
            />
          )}
        </AppLinker>
      </Stack>
    </Card>
  )
}

DocumentsLinkCard.propTypes = {
  folderId: PropTypes.string.isRequired,
  breakpoints: PropTypes.shape({
    isMobile: PropTypes.bool
  }),
  client: PropTypes.object,
  t: PropTypes.func
}

export default withClient(withBreakpoints()(translate()(DocumentsLinkCard)))
