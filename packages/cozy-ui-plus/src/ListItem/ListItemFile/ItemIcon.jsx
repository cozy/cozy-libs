import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import { isNote } from 'cozy-client/dist/models/file'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FiletypeNoteIcon from 'cozy-ui/transpiled/react/Icons/FileTypeNote'
import FiletypeTextIcon from 'cozy-ui/transpiled/react/Icons/FileTypeText'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'
import Thumbnail from 'cozy-ui/transpiled/react/Thumbnail'

import FileImageLoader from '../../FileImageLoader'

const ItemIcon = ({ icon, file }) => {
  const client = useClient()

  if (icon) return icon

  return (
    <FileImageLoader
      client={client}
      file={file}
      linkType="tiny"
      render={src => {
        return (
          <Thumbnail>
            {src ? (
              <img src={src} alt="" />
            ) : (
              <Skeleton variant="rect" animation="wave" />
            )}
          </Thumbnail>
        )
      }}
      renderFallback={() => (
        <Thumbnail>
          <Icon icon={isNote(file) ? FiletypeNoteIcon : FiletypeTextIcon} />
        </Thumbnail>
      )}
    />
  )
}

ItemIcon.propTypes = {
  icon: PropTypes.node,
  file: PropTypes.object
}

export default ItemIcon
