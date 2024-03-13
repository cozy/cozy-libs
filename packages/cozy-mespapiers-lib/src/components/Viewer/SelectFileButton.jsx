import React from 'react'
import { useNavigate } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useMultiSelection } from '../Hooks/useMultiSelection'

const SelectFileButton = ({ file }) => {
  const { isDesktop } = useBreakpoints()
  const { t } = useI18n()
  const navigate = useNavigate()
  const { addMultiSelectionFile } = useMultiSelection()

  const label = t('action.select')
  const icon = <Icon icon="select-all" />

  const handleClick = () => {
    navigate(`/paper/multiselect`)
    addMultiSelectionFile(file)
  }

  if (isDesktop) {
    return (
      <IconButton className="u-white" aria-label={label} onClick={handleClick}>
        {icon}
      </IconButton>
    )
  }

  return (
    <Button
      variant="secondary"
      aria-label={label}
      label={icon}
      onClick={handleClick}
    />
  )
}

export default SelectFileButton
