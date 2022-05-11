import React from 'react'
import cx from 'classnames'

import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'

const useStyles = makeStyles(theme => ({
  disabledItem: {
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'initial'
    }
  },
  disabledIcon: {
    fill: theme.palette.text.disabled
  },
  disabledTypography: {
    color: theme.palette.text.disabled
  }
}))

const ActionMenuItemWrapper = ({
  icon,
  children,
  className = '',
  onClick = undefined,
  isEnabled = true,
  iconProps = {},
  typographyProps = {}
}) => {
  const styles = useStyles()

  return (
    <ActionMenuItem
      onClick={onClick}
      className={cx(`u-flex-items-center ${className}`, {
        [styles.disabledItem]: !isEnabled
      })}
      left={
        <Icon
          icon={icon}
          className={cx({
            [styles.disabledIcon]: !isEnabled
          })}
          {...iconProps}
        />
      }
    >
      <Typography
        className={cx({
          [styles.disabledTypography]: !isEnabled
        })}
        variant="body1"
        {...typographyProps}
      >
        {children}
      </Typography>
    </ActionMenuItem>
  )
}

export default ActionMenuItemWrapper
