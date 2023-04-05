import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import Fab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'

import withLocales from '../../locales/withLocales'

const ForwardFab = ({ t, className, innerRef, onClick }) => {
  return (
    <Fab
      className={cx('u-mr-half', className)}
      innerRef={innerRef}
      onClick={onClick}
      aria-label={t('Home.Fab.forwardPaper')}
    >
      <Icon icon="paperplane" />
    </Fab>
  )
}

ForwardFab.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  }),
  t: PropTypes.func
}

export default withLocales(ForwardFab)
