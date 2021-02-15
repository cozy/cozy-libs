import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import flow from 'lodash/flow'
import { withStyles } from '@material-ui/core/styles'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'

import Markdown from './Markdown'
import withLocales from './hoc/withLocales'

import { fetchKonnectorData } from '../helpers/konnectorBlock'

const customStyles = () => ({
  disabled: {
    filter: 'grayscale(1)',
    opacity: 0.5
  }
})

/**
 * KonnectorBlock is a standalone component and can be imported directly.
 * It needs GET permission on io.cozy.konnectors, io.cozy.accounts and
 * io.cozy.triggers to work properly.
 */
const KonnectorBlock = ({ classes, file }) => {
  const [konnector, setKonnector] = useState()
  const client = useClient()
  const { t } = useI18n()
  const slug = get(file, 'cozyMetadata.uploadedBy.slug')
  const sourceAccount = get(file, 'cozyMetadata.sourceAccount')

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
          <AppIcon app={slug} className={classes[iconStatus]} />
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

export default flow(
  withLocales,
  withStyles(customStyles)
)(KonnectorBlock)
