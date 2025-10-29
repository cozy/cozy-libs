import PropTypes from 'prop-types'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomSelectIcon from 'cozy-ui/transpiled/react/Icons/BottomSelect'
import { useI18n, useExtendI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { locales } from '../locales'

const Control = ({
  innerRef,
  innerProps,
  selectProps: { onControlClicked }
}) => {
  useExtendI18n(locales)
  const { t } = useI18n()

  return (
    <div ref={innerRef} {...innerProps}>
      <Button
        variant="secondary"
        size="small"
        onClick={onControlClicked}
        onTouchStart={onControlClicked}
        label={t('Contacts.GroupsSelect.manage')}
        startIcon={<Icon icon={BottomSelectIcon} width="12" />}
      />
    </div>
  )
}

Control.propTypes = {
  selectProps: PropTypes.object.isRequired
}

export default Control
