import React from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Fab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const useStyles = makeStyles(() => ({
  fab: {
    position: 'fixed',
    zIndex: 10,
    bottom: '1rem',
    right: isDesktop => (isDesktop ? '6rem' : '1rem')
  }
}))

export const PapersFab = () => {
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()
  const classes = useStyles(isDesktop)
  const history = useHistory()

  const handleClick = () => {
    history.push({
      pathname: `/create`
    })
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label={t('Home.Fab.ariaLabel')}
        className={classes.fab}
        onClick={handleClick}
      >
        <Icon icon={PlusIcon} />
      </Fab>
    </>
  )
}
