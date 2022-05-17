import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'

import MultiselectContent from './MultiselectContent'
import MultiselectViewActions from './MultiselectViewActions'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const useStyles = makeStyles({
  paper: {
    '& .dialogContentInner': {
      padding: 0,
      margin: 0,
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }
})

const MultiselectView = () => {
  const { t } = useI18n()
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const { setMultiSelectionState } = useMultiSelection()

  const backgroundPath = new URLSearchParams(location.search).get(
    'backgroundPath'
  )
  useEffect(() => {
    setMultiSelectionState(true)
  }, [setMultiSelectionState, history])

  const handleClose = () => {
    history.push(backgroundPath || '/paper')
    setMultiSelectionState(false)
  }

  return (
    <FixedDialog
      open
      transitionDuration={0}
      classes={classes}
      onClose={handleClose}
      title={t('Multiselect.title')}
      content={<MultiselectContent />}
      actions={<MultiselectViewActions />}
    />
  )
}

export default MultiselectView
