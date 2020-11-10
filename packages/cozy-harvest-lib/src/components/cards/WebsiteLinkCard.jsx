import React from 'react'
import PropTypes from 'prop-types'

import logger from '../../logger'
import Card from 'cozy-ui/transpiled/react/Card'
import { SubTitle, Caption } from 'cozy-ui/transpiled/react/Text'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Icon from 'cozy-ui/transpiled/react/Icon'
import palette from 'cozy-ui/transpiled/react/palette'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'

const WebsiteLinkCard = ({ link }) => {
  const { t } = useI18n()
  let url = null
  try {
    url = new URL(link)
  } catch (err) {
    logger('warn', err.message)
    return null
  }

  const linkStyle = { textTransform: 'lowercase' }
  const label = url.host

  return (
    <Card>
      <SubTitle className="u-mb-1">{t('card.websiteLink.title')}</SubTitle>
      <Divider className="u-ml-0 u-maw-100" />
      <Media className="u-mt-1" align="top">
        <Img className="u-pr-1">
          <Icon icon={GlobeIcon} color={palette['coolGrey']} />
        </Img>
        <Bd>
          <ButtonLink
            subtle
            target="_blank"
            href={link}
            label={label}
            theme="text"
            className="u-primaryColor u-m-0"
            style={linkStyle}
          />
          <Caption>{t('card.websiteLink.description')}</Caption>
        </Bd>
      </Media>
    </Card>
  )
}

WebsiteLinkCard.propTypes = {
  link: PropTypes.string.isRequired
}

export default WebsiteLinkCard
