import PropTypes from 'prop-types'
import React from 'react'

import Fab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'

import withLocales from '../../locales/withLocales'
import { useScroll } from '../Hooks/useScroll'

const PapersFab = ({ t, className, innerRef, onClick, a11y }) => {
  const scroll = useScroll()
  const isOnTop = scroll.scrollTop < 80

  return (
    <Fab
      color="primary"
      variant={isOnTop ? 'extended' : 'circular'}
      className={className}
      innerRef={innerRef}
      onClick={onClick}
      aria-label={t('Home.Fab.createPaper')}
      {...a11y}
    >
      <Icon icon="plus" {...(isOnTop && { className: 'u-mr-half' })} />
      {isOnTop && t('common.add')}
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
