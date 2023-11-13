import React from 'react'
import { useNavigate } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useMultiSelection } from '../Hooks/useMultiSelection'

const SelectFileButton = ({ file }) => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { addMultiSelectionFile } = useMultiSelection()

  return (
    <Button
      label={t('action.select')}
      fullWidth
      onClick={() => {
        navigate(`/paper/multiselect`)
        addMultiSelectionFile(file)
      }}
      variant="secondary"
      startIcon={<Icon icon="select-all" />}
    />
  )
}

export default SelectFileButton
