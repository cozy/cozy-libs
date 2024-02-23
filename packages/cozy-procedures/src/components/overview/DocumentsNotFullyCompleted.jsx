import PropTypes from 'prop-types'
import React from 'react'

import { Button, Chip, translate } from 'cozy-ui/transpiled/react'
import PenIcon from 'cozy-ui/transpiled/react/Icons/Pen'

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
      icon={PenIcon}
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
