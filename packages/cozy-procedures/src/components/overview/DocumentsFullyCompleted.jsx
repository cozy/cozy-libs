import React from 'react'
import PropTypes from 'prop-types'

import { InlineCard, Icon } from 'cozy-ui/transpiled/react'
import FileTypeFilesIcon from 'cozy-ui/transpiled/react/Icons/FileTypeFiles'

function DocumentsFullyCompleted({ documents, navigateTo }) {
  const flatennedFiles = []
  Object.values(documents).map(document => {
    Object.values(document.files).map(file => {
      if (file) flatennedFiles.push(file)
    })
  })
  return (
    <InlineCard
      className="u-c-pointer u-ph-1 u-pv-half u-flex u-flex-column"
      onClick={() => navigateTo('documents')}
    >
      {flatennedFiles.map((file, index) => (
        <div className="u-flex u-pv-half" key={index}>
          <Icon icon={FileTypeFilesIcon} className="u-flex-shrink-0" />
          <span className="u-ml-half u-ellipsis ">{file.name}</span>
        </div>
      ))}
    </InlineCard>
  )
}

DocumentsFullyCompleted.propTypes = {
  documents: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired
}
export default DocumentsFullyCompleted
