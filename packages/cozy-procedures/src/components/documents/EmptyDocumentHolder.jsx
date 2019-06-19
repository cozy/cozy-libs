import React from 'react'
import PropTypes from 'prop-types'
import { translate, Chip, Icon } from 'cozy-ui/transpiled/react/'

const EmptyDocumentHolder = ({ t }) => (
  <Chip variant="dashed" className="u-w-100">
    <Icon icon="plus" size={16} className="u-mr-half u-p-half" />
    <span className="u-flex-grow-1">{t('documents.import')}</span>
  </Chip>
)

EmptyDocumentHolder.propTypes = {
  t: PropTypes.func.isRequired
}

export default translate()(EmptyDocumentHolder)
