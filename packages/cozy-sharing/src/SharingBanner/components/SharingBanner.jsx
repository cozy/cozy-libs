import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'

import { SharingBannerByLink, SharingBannerCozyToCozy } from './PublicBanner'

export const SharingBanner = ({ sharingInfos }) => {
  const [isOpened, setIsOpened] = useState(true)
  const onClose = useCallback(() => setIsOpened(false), [setIsOpened])

  const { loading, discoveryLink, sharing, isSharingShortcutCreated } =
    sharingInfos

  if (loading) return null
  return (
    isOpened &&
    (!discoveryLink ? (
      <SharingBannerByLink onClose={onClose} />
    ) : (
      <SharingBannerCozyToCozy
        isSharingShortcutCreated={isSharingShortcutCreated}
        sharing={sharing}
        discoveryLink={discoveryLink}
        onClose={onClose}
      />
    ))
  )
}

SharingBanner.propTypes = {
  sharingInfos: PropTypes.object
}

export default SharingBanner
