import React from 'react'
import PropTypes from 'prop-types'

import { Button, Chip, translate } from 'cozy-ui/transpiled/react'

const DocumentsNotFullyCompleted = ({
  documentsCompleted,
  documentsTotal,
  navigateTo,
  t
}) => {
  return (
    <Button
      label={t('overview.complete')}
      extraRight={
        <Chip
          theme="primary"
          size="tiny"
        >{`${documentsCompleted}/${documentsTotal}`}</Chip>
      }
      onClick={() => navigateTo('documents')}
      theme="ghost"
      extension="full"
      size="large"
      icon="pen"
    />
  )
}

DocumentsNotFullyCompleted.propTypes = {
  documentsCompleted: PropTypes.number.isRequired,
  documentsTotal: PropTypes.number.isRequired,
  navigateTo: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(DocumentsNotFullyCompleted)
