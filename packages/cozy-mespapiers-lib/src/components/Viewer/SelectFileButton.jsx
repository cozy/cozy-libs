import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { useMultiSelection } from '../Hooks/useMultiSelection'

const SelectFileButton = ({ file }) => {
  const { t } = useI18n()
  const history = useHistory()
  const { pathname } = useLocation()
  const { addMultiSelectionFile } = useMultiSelection()

  return (
    <Button
      label={t('action.select')}
      className="u-ml-half"
      fullWidth
      onClick={() => {
        history.push({
          pathname: `/paper/multiselect`,
          search: `backgroundPath=${pathname}`
        })
        addMultiSelectionFile(file)
      }}
      variant="secondary"
      startIcon={<Icon icon="select-all" />}
    />
  )
}

export default SelectFileButton
