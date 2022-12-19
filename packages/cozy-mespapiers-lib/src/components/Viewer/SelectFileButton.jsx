import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { useMultiSelection } from '../Hooks/useMultiSelection'

const SelectFileButton = ({ file }) => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { addMultiSelectionFile } = useMultiSelection()

  return (
    <Button
      label={t('action.select')}
      className="u-ml-half"
      fullWidth
      onClick={() => {
        navigate(`${pathname}/multiselect`)
        addMultiSelectionFile(file)
      }}
      variant="secondary"
      startIcon={<Icon icon="select-all" />}
    />
  )
}

export default SelectFileButton
