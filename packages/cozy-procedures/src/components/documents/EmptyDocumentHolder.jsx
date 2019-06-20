import React from 'react'
import PropTypes from 'prop-types'
import { translate, Button, Icon } from 'cozy-ui/transpiled/react/'

const EmptyDocumentHolder = ({ t }) => (
  <Button theme="ghost" extension="full" align="left">
    <Icon icon="plus" size={16} className="u-mr-1 u-pa-half" />
    <span>{t('documents.import')}</span>
  </Button>
)

EmptyDocumentHolder.propTypes = {
  t: PropTypes.func.isRequired
}

export default translate()(EmptyDocumentHolder)
