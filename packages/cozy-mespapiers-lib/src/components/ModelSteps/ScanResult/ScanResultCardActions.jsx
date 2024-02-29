import PropTypes from 'prop-types'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles(theme => ({
  root: {
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: 0,
    '&.small': {
      padding: '0 1rem'
    }
  }
}))

const ScanResultCardActions = ({ onRotate, onCancel, isImageRotating }) => {
  const classes = useStyles()
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()

  const device = isDesktop ? 'desktop' : 'mobile'

  return (
    <>
      <Button
        data-testid="retry-button"
        label={t(`Acquisition.${device}.retry`)}
        fullWidth
        variant="secondary"
        onClick={onCancel}
      />
      <IconButton
        data-testid="rotate-button"
        classes={classes}
        size="small"
        onClick={onRotate}
        aria-label={t('Acquisition.rotate')}
        title={t('Acquisition.rotate')}
        disabled={isImageRotating}
      >
        <Icon icon="rotate-left" />
      </IconButton>
    </>
  )
}

ScanResultCardActions.propTypes = {
  onCancel: PropTypes.func,
  onRotate: PropTypes.func,
  isImageRotating: PropTypes.bool
}

export default ScanResultCardActions
