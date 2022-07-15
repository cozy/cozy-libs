import React, { useState, useRef } from 'react'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'
import Fab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import withLocales from '../../locales/withLocales'
import ActionMenuWrapper from '../Actions/ActionMenuWrapper'
import { makeActions } from '../Actions/utils'
import { ActionsItems } from '../Actions/ActionsItems'
import { select } from '../Actions/Items/select'
import { createPaper } from '../Actions/Items/createPaper'

const useStyles = makeStyles(() => ({
  fab: {
    position: 'fixed',
    zIndex: 10,
    bottom: '1rem',
    right: isDesktop => (isDesktop ? '6rem' : '1rem')
  }
}))

const PapersFab = ({ t, className, ...props }) => {
  const [generalOptions, setGeneralOptions] = useState(false)
  const actionBtnRef = useRef()
  const { isDesktop } = useBreakpoints()
  const classes = useStyles(isDesktop)
  const client = useClient()

  const hideActionsMenu = () => setGeneralOptions(false)
  const toggleActionsMenu = () => setGeneralOptions(prev => !prev)
  const actions = makeActions([createPaper, select], {
    client,
    hideActionsMenu
  })

  return (
    <>
      <Fab
        color="primary"
        aria-label={t('Home.Fab.ariaLabel')}
        className={cx(classes.fab, className)}
        onClick={toggleActionsMenu}
        ref={actionBtnRef}
        {...props}
      >
        <Icon icon="plus" />
      </Fab>

      {generalOptions && (
        <ActionMenuWrapper onClose={hideActionsMenu} ref={actionBtnRef}>
          <ActionsItems actions={actions} />
        </ActionMenuWrapper>
      )}
    </>
  )
}

export default withLocales(PapersFab)
