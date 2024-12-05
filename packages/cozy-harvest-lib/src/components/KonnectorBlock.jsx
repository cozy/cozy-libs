import cx from 'classnames'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { useClient, generateWebLink } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Markdown from './Markdown'
import { makeLabel } from './cards/helpers'
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
  const sourceAccountIdentifier = get(
    file,
    'cozyMetadata.sourceAccountIdentifier'
  )
  const storeLink = generateWebLink({
    slug: 'store',
    cozyUrl: client.getStackClient().uri,
    subDomainType: client.getInstanceOptions().subdomain,
    pathname: '/',
    hash: `/discover/${slug}`
  })

  useEffect(() => {
    const fetchKonnector = async ({
      client,
      t,
      slug,
      sourceAccountIdentifier
    }) => {
      const konnector = await fetchKonnectorData({
        client,
        t,
        slug,
        sourceAccountIdentifier
      })
      setKonnector(konnector)
    }
    fetchKonnector({ client, t, slug, sourceAccountIdentifier })
  }, [client, t, slug, sourceAccountIdentifier])

  if (!konnector) {
    return (
      <div data-testid="KonnectorBlock-spinner">
        <Spinner className="u-flex u-flex-justify-center u-p-2" size="large" />
      </div>
    )
  }

  const { name, link, vendorLink, iconStatus, message, trigger, fatalError } =
    konnector

  if (fatalError) {
    return (
      <Typography className="u-pv-1-half u-ph-2" variant="body1">
        <Markdown source={fatalError} />
      </Typography>
    )
  }

  const label = makeLabel({
    t,
    konnector,
    trigger,
    isRunning: trigger.current_state.status === 'running'
  })

  return (
    <>
      <ListItem
        size="large"
        button
        divider
        component="a"
        href={link}
        target="_blank"
      >
        <ListItemIcon>
          <AppIcon
            app={slug}
            type="konnector"
            priority="registry"
            className={cx({
              'u-filter-gray-100 u-o-50': iconStatus === 'disabled'
            })}
          />
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={{ variant: 'h6' }}
          secondary={get(message, 'text', label)}
          secondaryTypographyProps={
            get(message, 'color') && { color: message.color }
          }
        />
        <ListItemIcon>
          <Icon icon={RightIcon} />
        </ListItemIcon>
      </ListItem>
      <List>
        <ListItem button component="a" href={storeLink} target="_blank">
          <ListItemIcon>
            <AppIcon app="store" className="u-w-1 u-h-1" />
          </ListItemIcon>
          <ListItemText
            primary={t('konnectorBlock.store.primary')}
            secondary={t('konnectorBlock.store.secondary')}
          />
        </ListItem>

        <Divider component="li" variant="inset" />

        <ListItem button {...vendorLink}>
          <ListItemIcon>
            <Icon icon={GlobeIcon} />
          </ListItemIcon>
          <ListItemText
            primary={t('konnectorBlock.open')}
            secondary={get(vendorLink, 'href')}
          />
        </ListItem>
      </List>
    </>
  )
}

KonnectorBlock.propTypes = {
  file: PropTypes.object.isRequired
}

export default withLocales(KonnectorBlock)
