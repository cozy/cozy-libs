import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import { LinearProgress } from 'cozy-ui/transpiled/react/Progress'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { useMultiSelection } from '../Hooks/useMultiSelection'
import useActions from '../SearchResult/useActions'

const useStyles = makeStyles(theme => ({
  backdropRoot: {
    zIndex: 'var(--zIndex-modal)'
  },
  barText: {
    color: 'var(--primaryContrastTextColor)'
  },
  bar: {
    borderRadius: theme.shape.borderRadius
  },
  barBackgroundColorPrimary: {
    backgroundColor: 'var(--secondaryTextColor)'
  },
  barBackgroundActiveColorPrimary: {
    backgroundColor: 'var(--primaryContrastTextColor)'
  }
}))

const MultiselectViewActions = () => {
  const { t } = useI18n()
  const classes = useStyles()
  const { allMultiSelectionFiles } = useMultiSelection()
  const [isBackdropOpen, setIsBackdropOpen] = useState(false)
  const navigate = useNavigate()

  const actions = useActions(allMultiSelectionFiles, {
    isActionBar: true,
    actionsOptions: { navigate, setIsBackdropOpen }
  })

  return (
    <>
      <Backdrop classes={{ root: classes.backdropRoot }} open={isBackdropOpen}>
        <div className="u-w-100 u-mh-2 u-ta-center">
          <Typography classes={{ root: classes.barText }} className="u-mb-1">
            {t('Multiselect.backdrop')}
          </Typography>
          <LinearProgress
            classes={{
              root: classes.bar,
              colorPrimary: classes.barBackgroundColorPrimary,
              barColorPrimary: classes.barBackgroundActiveColorPrimary
            }}
          />
        </div>
      </Backdrop>

      <ActionsBar actions={actions} docs={allMultiSelectionFiles} />
    </>
  )
}

export default MultiselectViewActions
