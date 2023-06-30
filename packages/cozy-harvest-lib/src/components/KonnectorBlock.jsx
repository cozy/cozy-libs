import cx from 'classnames'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useCallback } from 'react'

import { useClient } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Divider from 'cozy-ui/transpiled/react/Divider'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'

import Markdown from './Markdown'
import withLocales from './hoc/withLocales'
import { fetchKonnectorData } from '../helpers/konnectorBlock'

/**
 * KonnectorBlock is a standalone component and can be imported directly.
 * It needs GET permission on io.cozy.konnectors, io.cozy.accounts and
 * io.cozy.triggers to work properly.
 */
const KonnectorBlock = ({ file }) => {
  const [konnector, setKonnector] = useState()
  const client = useClient()
  const { t } = useI18n()
  const slug = get(file, 'cozyMetadata.uploadedBy.slug')
  const sourceAccount = get(file, 'cozyMetadata.sourceAccount')

  // TODO To be removed when UI's AppIcon use getIconURL from Cozy-Client
  // instead of its own see https://github.com/cozy/cozy-ui/issues/1723
  const fetchIcon = useCallback(() => {
    return client.getStackClient().getIconURL({
      type: 'konnector',
      slug,
      priority: 'registry'
    })
  }, [client, slug])

  useEffect(() => {
    const fetchKonnector = async ({ client, t, slug, sourceAccount }) => {
      const konnector = await fetchKonnectorData({
        client,
        t,
        slug,
        sourceAccount
      })
      setKonnector(konnector)
    }
    fetchKonnector({ client, t, slug, sourceAccount })
  }, [client, t, slug, sourceAccount])

  if (!konnector) {
    return (
      <div data-testid="KonnectorBlock-spinner">
        <Spinner className="u-flex u-flex-justify-center u-p-2" size="large" />
      </div>
    )
  }

  const { name, link, vendorLink, iconStatus, message, fatalError } = konnector

  if (fatalError) {
    return (
      <Typography className="u-pv-1-half u-ph-2" variant="body1">
        <Markdown source={fatalError} />
      </Typography>
    )
  }

  return (
    <List>
      <ListItem
        className="u-ph-2 u-h-3"
        button
        component="a"
        href={link}
        target="_blank"
      >
        <ListItemIcon>
          <AppIcon
            app={slug}
            className={cx({
              'u-filter-gray-100 u-o-50': iconStatus === 'disabled'
            })}
            fetchIcon={fetchIcon}
          />
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={{ variant: 'h6' }}
          secondary={get(message, 'text')}
          secondaryTypographyProps={
            get(message, 'color') && { color: message.color }
          }
        />
        <ListItemSecondaryAction>
          <Icon
            icon={RightIcon}
            className="u-mr-1"
            color="var(--secondaryTextColor)"
          />
        </ListItemSecondaryAction>
      </ListItem>

      <Divider component="li" />

      <ListItem className="u-ph-2" button {...vendorLink}>
        <ListItemIcon>
          <Icon icon={GlobeIcon} color="var(--primaryTextColor)" />
        </ListItemIcon>
        <ListItemText
          primary={t('konnectorBlock.account')}
          secondary={get(vendorLink, 'href')}
        />
      </ListItem>
    </List>
  )
}

KonnectorBlock.propTypes = {
  file: PropTypes.object.isRequired
}

export default withLocales(KonnectorBlock)
