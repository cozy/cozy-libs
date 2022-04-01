import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { makeStyles } from '@material-ui/styles'

import {
  useCozyDialog,
  DialogBackButton,
  DialogCloseButton
} from 'cozy-ui/transpiled/react/CozyDialogs'
import MUIDialog, {
  DialogTitle,
  DialogContent
} from 'cozy-ui/transpiled/react/Dialog'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const useStyles = makeStyles(() => ({
  root: {
    padding: '0',
    margin: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  typography: {
    marginTop: isMobile => (!isMobile ? '2px' : '')
  }
}))

const StepperDialog = ({
  onClose,
  onBack,
  title,
  content,
  stepper,
  ...rest
}) => {
  const { isMobile } = useBreakpoints()
  const classes = useStyles(isMobile)
  const { dialogProps, dialogTitleProps, fullScreen } = useCozyDialog(rest)

  return (
    <MUIDialog {...dialogProps}>
      {!fullScreen && onClose && <DialogCloseButton onClick={onClose} />}
      {onBack && <DialogBackButton onClick={onBack} />}
      <DialogTitle
        {...dialogTitleProps}
        className={cx('u-ellipsis u-pl-3', {
          ['u-flex u-flex-justify-between u-flex-items-center']: stepper
        })}
      >
        <Typography
          variant="h4"
          classes={{ h4: classes.typography }}
          className={cx({
            'u-ml-1': !isMobile
          })}
        >
          {title}
        </Typography>
        {stepper && (
          <Typography
            variant="h6"
            classes={{ h6: classes.typography }}
            className={cx({
              'u-mr-2': !isMobile
            })}
          >
            {stepper}
          </Typography>
        )}
      </DialogTitle>
      <Divider />
      <DialogContent classes={{ root: classes.root }}>{content}</DialogContent>
    </MUIDialog>
  )
}

StepperDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onBack: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  size: PropTypes.oneOf(['small', 'medium', 'large'])
}

export default StepperDialog
