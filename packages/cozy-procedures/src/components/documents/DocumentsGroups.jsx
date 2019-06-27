import React from 'react'
import PropTypes from 'prop-types'
import DocumentHolder from './DocumentHolder'
import EmptyDocumentHolder from './EmptyDocumentHolder'

const DocumentsGroups = ({ documents, templateDoc, keyDoc }) => {
  const slots = [
    ...documents,
    ...new Array(templateDoc.count - documents.length)
  ]
  return slots.map((value, index) =>
    value ? (
      <DocumentHolder document={value} key={index} keyDoc={keyDoc} />
    ) : (
      <EmptyDocumentHolder key={index} />
    )
  )
}

DocumentsGroups.propTypes = {
  documents: PropTypes.array,
  templateDoc: PropTypes.object,
  keyDoc: PropTypes.string.isRequired
}
export default DocumentsGroups
