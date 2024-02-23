import PropTypes from 'prop-types'
import React from 'react'

import { translate, Spinner } from 'cozy-ui/transpiled/react/'
import Card from 'cozy-ui/transpiled/react/Card'

const LoadingDocumentHolder = ({ t }) => (
  <Card className="u-flex u-flex-row u-flex-items-center">
    <Spinner className="u-ml-0 u-mr-1" size="large" />
    <span className="u-flex-grow-1 u-coolGrey">{t('documents.importing')}</span>
  </Card>
)

LoadingDocumentHolder.propTypes = {
  t: PropTypes.func.isRequired
}

export default translate()(LoadingDocumentHolder)
