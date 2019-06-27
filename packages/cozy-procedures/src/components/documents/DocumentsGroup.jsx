import React from 'react'
import PropTypes from 'prop-types'
import DocumentHolder from './DocumentHolder'
import EmptyDocumentHolder from './EmptyDocumentHolder'

const DocumentsGroup = ({ documents, templateDoc }) => {
  const slots = [
    ...documents,
    ...new Array(templateDoc.count - documents.length)
  ]
  return slots.map((value, index) =>
    value ? (
      <DocumentHolder document={value} key={index} />
    ) : (
      <EmptyDocumentHolder key={index} />
    )
  )
}

DocumentsGroup.propTypes = {
  documents: PropTypes.array,
  templateDoc: PropTypes.object
}
export default DocumentsGroup
