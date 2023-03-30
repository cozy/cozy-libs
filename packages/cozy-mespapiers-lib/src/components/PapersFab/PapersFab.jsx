import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import Fab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import withLocales from '../../locales/withLocales'

const useStyles = makeStyles(() => ({
  fab: {
    position: 'fixed',
    zIndex: 10,
    bottom: '1rem',
    right: isDesktop => (isDesktop ? '6rem' : '1rem')
  }
}))

const PapersFab = ({ t, className, innerRef, onClick, a11y }) => {
  const { isDesktop } = useBreakpoints()
  const classes = useStyles(isDesktop)

  return (
    <Fab
      color="primary"
      className={cx(classes.fab, className)}
      innerRef={innerRef}
      onClick={onClick}
      aria-label={t('Home.Fab.ariaLabel')}
      {...a11y}
    >
      <Icon icon="plus" />
    </Fab>
  )
}

PapersFab.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  }),
  t: PropTypes.func,
  a11y: PropTypes.shape({
    'aria-controls': PropTypes.string,
    'aria-haspopup': PropTypes.bool,
    'aria-expanded': PropTypes.bool
  })
}

export default withLocales(PapersFab)
