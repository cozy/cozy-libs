import React from 'react'
import { useHistory } from 'react-router-dom'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'

import MultiselectContent from './MultiselectContent'
import MultiselectViewActions from './MultiselectViewActions'

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
  const history = useHistory()
  const classes = useStyles()

  const handleClose = () => history.goBack()

  return (
    <FixedDialog
      open
      classes={classes}
      onClose={handleClose}
      title={t('Multiselect.title')}
      content={<MultiselectContent />}
      actions={<MultiselectViewActions />}
    />
  )
}

export default MultiselectView
