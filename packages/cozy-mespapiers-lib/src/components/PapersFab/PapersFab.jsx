import React from 'react'
import { useHistory } from 'react-router-dom'
import cx from 'classnames'

import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'
import { useLocation } from 'react-router-dom'
import Fab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import withLocales from '../../locales/withLocales'

const useStyles = makeStyles(() => ({
  fab: {
    position: 'fixed',
    zIndex: 10,
    bottom: '1rem',
    right: isDesktop => (isDesktop ? '6rem' : '1rem')
  }
}))

const PapersFab = ({ t, className, ...props }) => {
  const { isDesktop } = useBreakpoints()
  const classes = useStyles(isDesktop)
  const history = useHistory()
  const { pathname } = useLocation()

  const handleClick = () => {
    history.push({
      pathname: `/paper/create`,
      search: `backgroundPath=${pathname}`
    })
  }

  return (
    <Fab
      color="primary"
      aria-label={t('Home.Fab.ariaLabel')}
      className={cx(classes.fab, className)}
      onClick={handleClick}
      {...props}
    >
      <Icon icon="plus" />
    </Fab>
  )
}

export default withLocales(PapersFab)
