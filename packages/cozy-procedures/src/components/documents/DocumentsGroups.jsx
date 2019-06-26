import React from 'react'
import DocumentHolder from './DocumentHolder'
import EmptyDocumentHolder from './EmptyDocumentHolder'
//TODO Remove default values. Should be called only after initiated
const DocumentsGroups = ({ documents, templateDoc }) => {
  const slots = [
    ...documents,
    ...new Array(templateDoc.count - documents.length)
  ]
  return slots.map((value, index) =>
    value ? (
      <DocumentHolder document={value} key={index} />
    ) : (
      <EmptyDocumentHolder />
    )
  )
}

export default DocumentsGroups
