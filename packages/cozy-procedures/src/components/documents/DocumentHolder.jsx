import React from 'react'
import PropTypes from 'prop-types'
import { translate, Chip, Icon } from 'cozy-ui/transpiled/react/'
import { CozyFile } from 'cozy-doctypes'

import DocumentsDataFormContainer from '../../containers/DocumentsDataForm'

const DocumentHolder = ({ document, unlinkDocument, documentId }) => {
  const splittedName = CozyFile.splitFilename(document)
  return (
    <Chip variant="dashed" className="u-w-100">
      <Icon icon={`file-type-${document.class}`} size={24} className="u-mr-1" />
      <span className="u-flex-grow-1">
        {splittedName.filename}
        <span className="u-coolGrey">{splittedName.extension}</span>
      </span>
      <Icon
        icon="cross"
        size={16}
        className="u-pr-1 u-c-pointer"
        onClick={() => unlinkDocument({ document, documentId })}
      />
    </Chip>
  )
}

DocumentHolder.propTypes = {
  unlinkDocument: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
  //io.cozy.files
  document: PropTypes.object.isRequired
}
export default translate()(DocumentsDataFormContainer(DocumentHolder))
