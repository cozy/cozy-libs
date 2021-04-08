import React from 'react'
import PropTypes from 'prop-types'

import logger from '../../logger'
import Card from 'cozy-ui/transpiled/react/Card'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Link from '@material-ui/core/Link'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'

const linkStyle = { textTransform: 'lowercase' }

const WebsiteLinkCard = ({ link }) => {
  const { t } = useI18n()
  let url = null
  try {
    url = new URL(link)
  } catch (err) {
    logger('warn', err.message)
    return null
  }

  const label = url.host

  return (
    <Card>
      <Typography className="u-mb-1" variant="h5">
        {t('card.websiteLink.title')}
      </Typography>
      <Divider className="u-ml-0 u-maw-100" />
      <Media className="u-mt-1">
        <Img className="u-pr-1">
          <Typography color="textSecondary">
            <Icon icon={GlobeIcon} />
          </Typography>
        </Img>
        <Bd>
          <Link
            target="_blank"
            href={link}
            className="u-m-0 u-fw-bold"
            style={linkStyle}
          >
            {label}
          </Link>
          <Typography variant="caption" color="textSecondary">
            {t('card.websiteLink.description')}
          </Typography>
        </Bd>
      </Media>
    </Card>
  )
}

WebsiteLinkCard.propTypes = {
  link: PropTypes.string.isRequired
}

export default WebsiteLinkCard
