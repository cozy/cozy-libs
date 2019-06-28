import React from 'react'
import PropTypes from 'prop-types'
import DocumentHolder from './DocumentHolder'
import EmptyDocumentHolder from './EmptyDocumentHolder'

const DocumentsGroup = ({ files, templateDocumentsCount, documentId }) => {
  const slots = [...files, ...new Array(templateDocumentsCount - files.length)]
  return slots.map((value, index) =>
    value ? (
      <DocumentHolder document={value} key={index} documentId={documentId} />
    ) : (
      <EmptyDocumentHolder key={index} />
    )
  )
}

DocumentsGroup.propTypes = {
  files: PropTypes.array.isRequired,
  templateDocumentsCount: PropTypes.number.isRequired,
  documentId: PropTypes.string.isRequired
}
export default DocumentsGroup
