import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import { ShareModal, ShareButton } from 'cozy-sharing'
import { SharingProvider } from 'cozy-sharing/dist/SharingProvider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'

const Sharing = ({ file, variant }) => {
  const client = useClient()
  const [showShareModal, setShowShareModal] = useState(false)

  const SharingButton =
    variant === 'iconButton' ? (
      <IconButton className="u-white" onClick={() => setShowShareModal(true)}>
        <Icon icon={ShareIcon} />
      </IconButton>
    ) : (
      <ShareButton
        fullWidth
        useShortLabel
        docId={file.id}
        onClick={() => setShowShareModal(true)}
      />
    )

  return (
    <>
      <SharingProvider
        client={client}
        doctype="io.cozy.files"
        documentType="Files"
      >
        {showShareModal && (
          <ShareModal
            document={file}
            documentType="Files"
            sharingDesc={file.name}
            onClose={() => setShowShareModal(false)}
          />
        )}
        {SharingButton}
      </SharingProvider>
    </>
  )
}

Sharing.propTypes = {
  file: PropTypes.object,
  variant: PropTypes.oneOf(['default', 'iconButton'])
}

Sharing.defaultProptypes = {
  variant: 'default'
}

export default Sharing
