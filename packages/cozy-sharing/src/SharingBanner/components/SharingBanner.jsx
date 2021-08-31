import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { SharingBannerByLink, SharingBannerCozyToCozy } from './PublicBanner'
import { I18n } from 'cozy-ui/transpiled/react'

export const SharingBanner = ({ sharingInfos, lang }) => {
  const [isOpened, setIsOpened] = useState(true)
  const onClose = useCallback(() => setIsOpened(false), [setIsOpened])

  const {
    loading,
    discoveryLink,
    sharing,
    isSharingShortcutCreated
  } = sharingInfos

  if (loading) return null
  return (
    isOpened && (
      <I18n dictRequire={() => require('../locales/en.json')} lang={lang}>
        {!discoveryLink ? (
          <SharingBannerByLink onClose={onClose} />
        ) : (
          <SharingBannerCozyToCozy
            isSharingShortcutCreated={isSharingShortcutCreated}
            sharing={sharing}
            discoveryLink={discoveryLink}
            onClose={onClose}
          />
        )}
      </I18n>
    )
  )
}

SharingBanner.propTypes = {
  sharingInfos: PropTypes.object
}

export default SharingBanner
