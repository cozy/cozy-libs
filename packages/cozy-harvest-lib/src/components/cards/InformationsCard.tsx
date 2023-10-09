/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import cx from 'classnames'
import React from 'react'

import { useClient, generateWebLink } from 'cozy-client'
import Card from 'cozy-ui/transpiled/react/Card'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'
import StoreIcon from 'cozy-ui/transpiled/react/Icons/Store'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getErrorMessage } from '../../helpers/getErrorMessage'
import logger from '../../logger'

interface Konnector {
  vendor_link: string
  slug: string
}
interface InformationsCardProps {
  className?: string
  konnector: Konnector
}

interface StoreButtonProps {
  appSlug: string
}
interface VendorLinkButtonProps {
  vendorLink: string
}
interface ExternalLinkButtonProps {
  url: string
  primaryText: string
  secondaryText: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
}

const getHost = (link?: string): string | null => {
  if (!link) return null

  try {
    const url = new URL(link)
    return url.host
  } catch (error) {
    logger('warn', getErrorMessage(error))
    return null
  }
}

const ExternalLinkButton = ({
  url,
  primaryText,
  secondaryText,
  icon
}: ExternalLinkButtonProps): JSX.Element | null => {
  return (
    <ListItem
      button
      className="u-mb-half"
      component="a"
      href={url}
      target="_blank"
    >
      <ListItemIcon>
        <Icon icon={icon} size={16} color="textPrimary" />
      </ListItemIcon>

      <ListItemText primary={primaryText} secondary={secondaryText} />
    </ListItem>
  )
}

const StoreButton = ({ appSlug }: StoreButtonProps): JSX.Element | null => {
  const client = useClient()
  const { t } = useI18n()
  if (!client) {
    return null
  }
  if (!appSlug) {
    return null
  }
  const { cozySubdomainType: subDomainType }: any = client.getInstanceOptions()

  const storeAppName = 'store'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  const cozyURL = new URL(client.getStackClient().uri)
  const nativePath = `/myapps/${appSlug}`
  const url = generateWebLink({
    cozyUrl: cozyURL.origin,
    searchParams: [],
    pathname: '/',
    hash: nativePath,
    slug: storeAppName,
    subDomainType
  })
  return (
    <ExternalLinkButton
      url={url}
      primaryText={t('card.information.store')}
      secondaryText={t('card.information.storeDescription')}
      icon={StoreIcon}
    />
  )
}

const VendorLinkButton = ({
  vendorLink
}: VendorLinkButtonProps): JSX.Element | null => {
  const { t } = useI18n()
  const host = getHost(vendorLink)

  if (!host) {
    return null
  }

  return (
    <ExternalLinkButton
      url={vendorLink}
      primaryText={t('card.information.websiteLink')}
      secondaryText={host}
      icon={GlobeIcon}
    />
  )
}

export const InformationsCard = ({
  className,
  konnector
}: InformationsCardProps): JSX.Element | null => {
  const { t } = useI18n()

  return (
    <Card className={cx('u-p-0', className)}>
      <div
        className="u-ph-1 u-flex u-flex-items-center"
        style={{ minHeight: '64px' }}
      >
        <Typography variant="h5">{t('card.information.title')}</Typography>
      </div>

      <Divider className="u-ml-0 u-maw-100 u-mb-half" />

      <List className="u-p-0">
        <StoreButton appSlug={konnector.slug} />
        <VendorLinkButton vendorLink={konnector.vendor_link} />
      </List>
    </Card>
  )
}
