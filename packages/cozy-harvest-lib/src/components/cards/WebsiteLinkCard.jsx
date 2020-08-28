import React from 'react'
import PropTypes from 'prop-types'

import Card from 'cozy-ui/transpiled/react/Card'
import { SubTitle, Caption } from 'cozy-ui/transpiled/react/Text'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Icon from 'cozy-ui/transpiled/react/Icon'
import palette from 'cozy-ui/transpiled/react/palette'

import { translate } from 'cozy-ui/transpiled/react/I18n'

const WebsiteLinkCard = ({ link, t }) => {
  const linkStyle = { textTransform: 'lowercase' }
  const label = new URL(link).host

  return (
    <Card>
      <SubTitle className="u-mb-1">{t('card.websiteLink.title')}</SubTitle>
      <hr className="u-silver" />
      <Media align="top">
        <Img className="u-pr-1">
          <Icon icon="globe" color={palette['coolGrey']} />
        </Img>
        <Bd>
          <ButtonLink
            subtle
            target="_blank"
            href={link}
            label={label}
            theme="text"
            className="u-dodgerBlue u-m-0"
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

export default translate()(WebsiteLinkCard)
