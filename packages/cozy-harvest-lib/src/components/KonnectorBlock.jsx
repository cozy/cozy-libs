import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'

import { useQuery, useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { generateUniversalLink } from 'cozy-ui/transpiled/react/AppLinker'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
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

import withLocales from './hoc/withLocales'
import { buildKonnectorQuery } from '../helpers/queries'

const KonnectorBlock = ({ file }) => {
  const client = useClient()
  const { t } = useI18n()

  const slug = get(file, 'cozyMetadata.uploadedBy.slug')

  const konnectorQuery = buildKonnectorQuery(slug)
  const konnectorQueryDef = konnectorQuery.definition()
  konnectorQueryDef.sources = ['stack', 'registry']

  const { data, fetchStatus } = useQuery(
    konnectorQueryDef,
    konnectorQuery.options
  )

  if (fetchStatus !== 'loaded' || !data.length > 0) {
    return (
      <div data-testid="KonnectorBlock-spinner">
        <Spinner className="u-flex u-flex-justify-center u-p-2" size="large" />
      </div>
    )
  }

  const sourceAccount = get(file, 'cozyMetadata.sourceAccount')
  const link = generateUniversalLink({
    cozyUrl: client.getStackClient().uri,
    slug: 'home',
    subDomainType: client.getInstanceOptions().cozySubdomainType,
    nativePath: `connected/${slug}/accounts/${sourceAccount}`
  })
  const konnector = data[0].attributes

  return (
    <List>
      <ListItem className="u-ph-2 u-h-3" button component="a" href={link}>
        <ListItemIcon>
          <AppIcon app={konnector.slug} />
        </ListItemIcon>
        <ListItemText
          primary={konnector.name}
          primaryTypographyProps={{ variant: 'h6' }}
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

      <ListItem
        className="u-ph-2"
        button
        component="a"
        href={konnector.vendor_link}
        target="_blank"
      >
        <ListItemIcon>
          <Icon icon={GlobeIcon} color="var(--primaryTextColor)" />
        </ListItemIcon>
        <ListItemText
          primary={t('konnectorBlock.account')}
          secondary={konnector.vendor_link}
        />
      </ListItem>
    </List>
  )
}

KonnectorBlock.propTypes = {
  file: PropTypes.object.isRequired
}

export default withLocales(KonnectorBlock)
