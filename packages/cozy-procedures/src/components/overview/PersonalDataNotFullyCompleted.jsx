import PropTypes from 'prop-types'
import React from 'react'

import { Button, Chip, translate } from 'cozy-ui/transpiled/react'
import PenIcon from 'cozy-ui/transpiled/react/Icons/Pen'
const PersonalDataNotFullyCompleted = ({
  navigateTo,
  personalDataFieldsCompleted,
  personalDataFieldsTotal,
  t
}) => {
  return (
    <Button
      label={t('overview.complete')}
      extraRight={
        <Chip
          theme="primary"
          size="tiny"
        >{`${personalDataFieldsCompleted}/${personalDataFieldsTotal}`}</Chip>
      }
      onClick={() => navigateTo('personal')}
      theme="ghost"
      extension="full"
      size="large"
      icon={PenIcon}
    />
  )
}

PersonalDataNotFullyCompleted.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  personalDataFieldsCompleted: PropTypes.number.isRequired,
  personalDataFieldsTotal: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
}
export default translate()(PersonalDataNotFullyCompleted)
