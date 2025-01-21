import PropTypes from 'prop-types'
import React from 'react'

import { ShareButton } from 'cozy-sharing'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'

import { useShareModal } from '../providers/ShareModalProvider'

const SharingButton = ({ className, file, variant }) => {
  const { setShowShareModal } = useShareModal()

  if (variant === 'iconButton')
    return (
      <IconButton className="u-white" onClick={() => setShowShareModal(true)}>
        <Icon icon={ShareIcon} />
      </IconButton>
    )

  return (
    <ShareButton
      className={className}
      fullWidth
      useShortLabel
      docId={file.id}
      onClick={() => setShowShareModal(true)}
    />
  )
}

SharingButton.propTypes = {
  file: PropTypes.object,
  variant: PropTypes.oneOf(['default', 'iconButton'])
}

SharingButton.defaultProptypes = {
  variant: 'default'
}

export default SharingButton
