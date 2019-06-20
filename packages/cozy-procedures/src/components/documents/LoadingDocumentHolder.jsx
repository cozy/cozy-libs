import React from 'react'
import PropTypes from 'prop-types'
import { translate, Chip, Icon, Spinner } from 'cozy-ui/transpiled/react/'

const LoadingDocumentHolder = ({ t }) => (
  <Chip variant="dashed" className="u-w-100">
    <Spinner className="u-ml-0 u-mr-1" size="large" />
    <span className="u-flex-grow-1">{t('documents.importing')}</span>
    <Icon icon="cross" size={16} className="u-pr-1" />
  </Chip>
)

LoadingDocumentHolder.propTypes = {
  t: PropTypes.func.isRequired
}

export default translate()(LoadingDocumentHolder)
