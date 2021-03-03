import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Media, Img } from 'cozy-ui/transpiled/react/Media'
import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import Typography from 'cozy-ui/transpiled/react/Typography'

import KonnectorIcon from './KonnectorIcon'
import { useDialogContext } from './DialogContext'

const resetFontStyles = { fontSize: '1rem', fontWeight: 'normal' }
const KonnectorModalHeader = ({ konnector, children }) => {
  const { dialogTitleProps } = useDialogContext()
  return (
    <DialogTitle {...dialogTitleProps} className="u-pb-half" disableTypography>
      <Media>
        <Img
          className={cx('u-mr-1', {
            'u-w-3 u-h-3': children,
            'u-w-2 u-h-2': !children
          })}
        >
          <KonnectorIcon konnector={konnector} />
        </Img>
        <div className="u-flex-grow-1 u-mr-1">
          <Typography variant="h5" className="u-m-0">
            {konnector.name}
          </Typography>
          <div className="u-w-100" style={resetFontStyles}>
            {children}
          </div>
        </div>
      </Media>
    </DialogTitle>
  )
}

KonnectorModalHeader.propTypes = {
  konnector: PropTypes.object.isRequired,
  children: PropTypes.node
}

export default KonnectorModalHeader
