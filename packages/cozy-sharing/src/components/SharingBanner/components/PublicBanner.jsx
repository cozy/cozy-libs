import PropTypes from 'prop-types'
import React from 'react'
import snarkdown from 'snarkdown'

import { useClient } from 'cozy-client'
import Banner from 'cozy-ui/transpiled/react/Banner'
import Button, { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import CozyHomeLinkIcon from './CozyHomeLinkIcon'
import styles from '../../../styles/publicBanner.styl'

const HOME_LINK_HREF = 'https://manager.cozycloud.cc/cozy/create'

const getPublicNameFromSharing = sharing =>
  sharing.attributes.members[0].public_name

const PublicBannerCozyToCozyContent = ({
  sharing,
  isSharingShortcutCreated
}) => {
  const { t } = useI18n()
  const client = useClient()
  const name = getPublicNameFromSharing(sharing)
  const text = isSharingShortcutCreated
    ? t('Share.banner.synchronise')
    : t('Share.banner.whats_cozy')
  const avatarURL = `${client.options.uri}/public/avatar?fallback=initials`
  const knowMore = (
    <a
      href="https://cozy.io"
      target="_blank"
      className="u-link"
      rel="noopener noreferrer"
    >
      {t('Share.banner.know_more')}
    </a>
  )

  const withAvatar = snarkdown(
    t('Share.banner.shared_from', {
      name: name,
      image: avatarURL
    })
  )
  const beginning = withAvatar.split('<img src')
  const translated = beginning[1].split('alt="avatar">')
  return (
    <>
      <span className={styles['bannermarkdown']}>
        {beginning[0]}
        <img src={avatarURL} alt="avatar" />
        {translated[1]}
      </span>
      <span>
        {' '}
        {text} {knowMore}
      </span>
    </>
  )
}
PublicBannerCozyToCozyContent.propTypes = {
  isSharingShortcutCreated: PropTypes.bool.isRequired,
  sharing: PropTypes.object.isRequired
}

const openExternalLink = url => (window.location = url)

const SharingBannerCozyToCozy = ({
  sharing,
  isSharingShortcutCreated,
  discoveryLink,
  onClose
}) => {
  const { t } = useI18n()

  const action = () => openExternalLink(discoveryLink)
  const buttonOne = isSharingShortcutCreated
    ? {
        label: t('Share.banner.sync_to_mine'),
        icon: 'sync-cozy',
        action
      }
    : {
        label: t('Share.banner.add_to_mine'),
        icon: 'to-the-cloud',
        action
      }
  return (
    <Banner
      bgcolor="var(--defaultBackgroundColor)"
      text={
        <PublicBannerCozyToCozyContent
          isSharingShortcutCreated={isSharingShortcutCreated}
          sharing={sharing}
        />
      }
      buttonOne={
        <Button
          theme="text"
          label={buttonOne.label}
          icon={buttonOne.icon}
          onClick={buttonOne.action}
        />
      }
      buttonTwo={
        <Button
          theme="text"
          label={t('Share.banner.close')}
          onClick={onClose}
        />
      }
      inline
    />
  )
}

const SharingBannerByLinkText = () => {
  const { t } = useI18n()
  const text = t('Share.banner.whats_cozy')
  const knowMore = (
    <a
      href="https://cozy.io"
      target="_blank"
      className="u-link"
      rel="noopener noreferrer"
    >
      {t('Share.banner.know_more')}
    </a>
  )
  return (
    <span style={{ color: 'var(--iconTextColor)' }}>
      {text} {knowMore}
    </span>
  )
}

const SharingBannerByLink = ({ onClose }) => {
  const { t } = useI18n()
  return (
    <Banner
      bgcolor="var(--defaultBackgroundColor)"
      text={<SharingBannerByLinkText />}
      buttonOne={
        <ButtonLink
          theme="text"
          label={t('Share.create-cozy')}
          icon={CozyHomeLinkIcon}
          href={HOME_LINK_HREF}
        />
      }
      buttonTwo={
        <Button
          theme="text"
          label={t('Share.banner.close')}
          onClick={onClose}
        />
      }
      inline
    />
  )
}
SharingBannerCozyToCozy.propTypes = {
  sharing: PropTypes.object.isRequired,
  isSharingShortcutCreated: PropTypes.bool.isRequired,
  discoveryLink: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}
export { SharingBannerCozyToCozy, SharingBannerByLink }
