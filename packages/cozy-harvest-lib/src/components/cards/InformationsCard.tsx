import { ListItemText } from '@material-ui/core'
import cx from 'classnames'
import React from 'react'

import Card from 'cozy-ui/transpiled/react/Card'
import Divider from 'cozy-ui/transpiled/react/Divider'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { getErrorMessage } from '../../helpers/getErrorMessage'
import logger from '../../logger'

interface InformationsCardProps {
  className?: string
  link: string
}

const getLabel = (link?: string): string | null => {
  if (!link) return null

  try {
    const url = new URL(link)
    return url.host
  } catch (error) {
    logger('warn', getErrorMessage(error))
    return null
  }
}

export const InformationsCard = ({
  className,
  link
}: InformationsCardProps): JSX.Element | null => {
  const { t } = useI18n()
  const label = getLabel(link)

  if (!label) return null

  return (
    <Card className={cx('u-p-0', className)}>
      <div
        className="u-ph-1 u-flex u-flex-items-center"
        style={{ minHeight: '64px' }}
      >
        <Typography variant="h5">{t('card.websiteLink.title')}</Typography>
      </div>

      <Divider className="u-ml-0 u-maw-100 u-mb-half" />

      <List className="u-p-0">
        <ListItem
          button
          className="u-mb-half"
          component="a"
          href={link}
          target="_blank"
        >
          <ListItemIcon>
            <Icon icon={GlobeIcon} size={16} color="textPrimary" />
          </ListItemIcon>

          <ListItemText
            primary={t('card.websiteLink.description')}
            secondary={label}
          />
        </ListItem>
      </List>
    </Card>
  )
}
