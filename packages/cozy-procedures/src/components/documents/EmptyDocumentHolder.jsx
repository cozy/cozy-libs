import React from 'react'
import PropTypes from 'prop-types'
import { translate, Button } from 'cozy-ui/transpiled/react/'

const EmptyDocumentHolder = ({ t }) => (
  <Button
    label={t('documents.import')}
    icon="plus"
    theme="ghost"
    extension="full"
    align="left"
  />
)

EmptyDocumentHolder.propTypes = {
  t: PropTypes.func.isRequired
}

export default translate()(EmptyDocumentHolder)
