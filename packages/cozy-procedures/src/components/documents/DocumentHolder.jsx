import React from 'react'
import { translate, Chip, Icon } from 'cozy-ui/transpiled/react/'

const DocumentHolder = () => (
  <Chip variant="dashed" className="u-w-100">
    <Icon icon="file-type-pdf" size={24} className="u-mr-1" />
    <span className="u-flex-grow-1">Impots gouv 2019.pdf</span>
    <Icon icon="cross" size={16} className="u-pr-1" />
  </Chip>
)

export default translate()(DocumentHolder)
