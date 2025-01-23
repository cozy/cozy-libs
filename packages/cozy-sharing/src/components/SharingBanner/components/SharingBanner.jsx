import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'

import { SharingBannerByLink, SharingBannerCozyToCozy } from './PublicBanner'

export const SharingBanner = ({ sharingInfos }) => {
  const [isOpened, setIsOpened] = useState(true)
  const onClose = useCallback(() => setIsOpened(false), [setIsOpened])

  const { loading, addSharingLink, sharing, isSharingShortcutCreated } =
    sharingInfos

  if (loading) return null
  return (
    isOpened &&
    (!addSharingLink ? (
      <SharingBannerByLink onClose={onClose} />
    ) : (
      <SharingBannerCozyToCozy
        isSharingShortcutCreated={isSharingShortcutCreated}
        sharing={sharing}
        addSharingLink={addSharingLink}
        onClose={onClose}
      />
    ))
  )
}

SharingBanner.propTypes = {
  sharingInfos: PropTypes.object
}

export default SharingBanner
