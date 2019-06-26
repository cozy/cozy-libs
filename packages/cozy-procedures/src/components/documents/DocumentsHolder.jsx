import React from 'react'
import DocumentHolder from './DocumentHolder'
import EmptyDocumentHolder from './EmptyDocumentHolder'
const DocumentsHolder = ({ documents, templateDoc }) => {
  const toRender = documents.map((document, index) => {
    return <DocumentHolder document={document} key={index} />
  })
  for (let i = 0; i < templateDoc.count - documents.length; i++) {
    toRender.push(<EmptyDocumentHolder />)
  }

  return toRender
}

export default DocumentsHolder
