import React from 'react'
import PropTypes from 'prop-types'
import DocumentHolder from './DocumentHolder'
import EmptyDocumentHolder from './EmptyDocumentHolder'
import LoadingDocumentHolder from './LoadingDocumentHolder'
const DocumentsGroup = ({
  files,
  templateDocumentsCount,
  documentId,
  filesStatusByCategory
}) => {
  const slots = [...files, ...new Array(templateDocumentsCount - files.length)]
  return slots.map((value, index) =>
    value ? (
      <DocumentHolder
        document={value}
        key={index}
        documentId={documentId}
        index={index}
      />
    ) : filesStatusByCategory[index].loading ? (
      <LoadingDocumentHolder key={index} />
    ) : (
      <EmptyDocumentHolder key={index} documentId={documentId} index={index} />
    )
  )
}

DocumentsGroup.propTypes = {
  files: PropTypes.array.isRequired,
  templateDocumentsCount: PropTypes.number.isRequired,
  documentId: PropTypes.string.isRequired,
  filesStatusByCategory: PropTypes.array.isRequired
}
export default DocumentsGroup
