import React from 'react'
import PropTypes from 'prop-types'
import { translate, Icon, Spinner } from 'cozy-ui/transpiled/react/'
import Card from 'cozy-ui/transpiled/react/Card'

const LoadingDocumentHolder = ({ t }) => (
  <Card className="u-flex u-flex-row u-flex-items-center">
    <Spinner className="u-ml-0 u-mr-1" size="large" />
    <span className="u-flex-grow-1 u-coolGrey">{t('documents.importing')}</span>
    <Icon icon="cross" size={16} className="u-pr-1" />
  </Card>
)

LoadingDocumentHolder.propTypes = {
  t: PropTypes.func.isRequired
}

export default translate()(LoadingDocumentHolder)
