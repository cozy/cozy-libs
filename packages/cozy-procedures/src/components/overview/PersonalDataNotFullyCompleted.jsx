import React from 'react'
import PropTypes from 'prop-types'

import { Button, Chip, translate } from 'cozy-ui/transpiled/react'
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
      icon="pen"
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
