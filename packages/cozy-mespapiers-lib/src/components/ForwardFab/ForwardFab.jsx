import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import Fab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../locales/withLocales'

const ForwardFab = ({ className, innerRef, onClick }) => {
  const { t } = useI18n()

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
  })
}

export default withLocales(ForwardFab)
