import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import MultiselectContent from './MultiselectContent'
import MultiselectViewActions from './MultiselectViewActions'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const MultiselectView = () => {
  const { t } = useI18n()
  const history = useHistory()
  const location = useLocation()
  const { setIsMultiSelectionActive } = useMultiSelection()

  const backgroundPath = new URLSearchParams(location.search).get(
    'backgroundPath'
  )
  useEffect(() => {
    setIsMultiSelectionActive(true)
  }, [setIsMultiSelectionActive, history])

  const handleClose = () => {
    history.push(backgroundPath || '/paper')
    setIsMultiSelectionActive(false)
  }

  return (
    <FixedDialog
      open
      transitionDuration={0}
      onClose={handleClose}
      title={t('Multiselect.title.default')}
      content={<MultiselectContent />}
      actions={<MultiselectViewActions onClose={handleClose} />}
    />
  )
}

export default MultiselectView
