import React from 'react'
import PropTypes from 'prop-types'

import { InlineCard, Icon } from 'cozy-ui/transpiled/react'
const DocumentsFullyCompleted = ({ documents, navigateTo }) => {
  const flatenedFiles = []
  Object.values(documents).map(document => {
    Object.values(document['files']).map(file => {
      flatenedFiles.push(file)
    })
  })
  return (
    <InlineCard
      className="u-c-pointer u-p-1 u-flex u-flex-column"
      onClick={() => navigateTo('documents')}
    >
      {flatenedFiles.map((file, index) => {
        let style = 'u-ellipsis u-flex'
        if (index !== 0) style += ' u-mt-1'
        return (
          <div className={style} key={index}>
            <Icon icon="file-type-files" />
            <span className="u-ml-half">{file.name}</span>
          </div>
        )
      })}
    </InlineCard>
  )
}

DocumentsFullyCompleted.propTypes = {
  documents: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired
}
export default DocumentsFullyCompleted
