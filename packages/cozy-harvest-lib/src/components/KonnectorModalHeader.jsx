import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { Media, Img } from 'cozy-ui/transpiled/react/deprecated/Media'

import { useDialogContext } from './DialogContext'
import KonnectorIcon from './KonnectorIcon'

const resetFontStyles = { fontSize: '1rem', fontWeight: 'normal' }
const KonnectorModalHeader = ({ konnector, children, className }) => {
  const { dialogTitleProps } = useDialogContext()
  const { className: dialogTitlePropsClassName, ...rest } = dialogTitleProps
  return (
    <DialogTitle
      {...rest}
      className={cx('u-pb-half', className, dialogTitlePropsClassName)}
      disableTypography
    >
      <Media>
        <Img
          className={cx('u-mr-1', {
            [children === null ? 'u-w-2 u-h-2' : 'u-w-3 u-h-3']: true
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
