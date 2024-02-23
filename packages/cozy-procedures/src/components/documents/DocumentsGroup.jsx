import PropTypes from 'prop-types'
import React from 'react'

import DocumentHolder from './DocumentHolder'
import EmptyDocumentHolder from './EmptyDocumentHolder'
import LoadingDocumentHolder from './LoadingDocumentHolder'
const DocumentsGroup = ({
  files,
  templateDocumentsCount,
  categoryId,
  filesStatusByCategory
}) => {
  const slots = [...files, ...new Array(templateDocumentsCount - files.length)]
  return slots.map((value, index) =>
    value ? (
      <DocumentHolder
        document={value}
        key={index}
        categoryId={categoryId}
        index={index}
      />
    ) : filesStatusByCategory[index].loading ? (
      <LoadingDocumentHolder key={index} />
    ) : (
      <EmptyDocumentHolder key={index} categoryId={categoryId} index={index} />
    )
  )
}

DocumentsGroup.propTypes = {
  files: PropTypes.array.isRequired,
  templateDocumentsCount: PropTypes.number.isRequired,
  categoryId: PropTypes.string.isRequired,
  filesStatusByCategory: PropTypes.array.isRequired
}
export default DocumentsGroup
