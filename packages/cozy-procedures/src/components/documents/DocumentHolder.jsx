import React from 'react'
import { translate, Chip, Icon } from 'cozy-ui/transpiled/react/'
import { CozyFile } from 'cozy-doctypes'

const DocumentHolder = ({ document }) => {
  //!TODO to be removed. No need to check because the component should be mounted only when we have info
  if (!document) return null
  const splittedName = CozyFile.splitFilename(document)
  return (
    <Chip variant="dashed" className="u-w-100">
      <Icon icon={`file-type-${document.class}`} size={24} className="u-mr-1" />
      <span className="u-flex-grow-1">
        {splittedName.filename}
        <span className="u-coolGrey">{splittedName.extension}</span>
      </span>
      <Icon icon="cross" size={16} className="u-pr-1" />
    </Chip>
  )
}

export default translate()(DocumentHolder)
