import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles(theme => ({
  root: ({ hasChildren }) => ({
    marginTop: 1,
    marginBottom: hasChildren ? 8 : -1,
    fontWeight: theme.typography.fontWeightRegular
  })
}))

/**
 * Component that represents the design template for trigger alerts.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The label for the alert.
 * @param {string} props.icon - The icon for the alert.
 * @param {string} [props.color] - The color of the alert.
 * @param {string} [props.severity] - The severity of the alert.
 * @param {string} [props.labelColor] - The color of the label.
 * @param {boolean} [props.block] - Whether the alert should be displayed as a block element.
 * @param {ReactNode} [props.menu] - The menu component to be displayed on the right of the alert.
 * @param {ReactNode} [props.button] - The button component to be displayed on the right of the alert or below the alert if it is a block element.
 * @param {ReactNode} [props.children] - The content of the alert.
 * @param {boolean} [props.showAction=true] - Whether to show the action components.
 * @returns {JSX.Element} The rendered trigger alert template.
 */
function TriggerAlertTemplate({
  label,
  icon,
  color,
  severity,
  labelColor,
  block = false,
  menu,
  button,
  children,
  showAction = true,
  className
} = {}) {
  const styles = useStyles({ hasChildren: !!children })
  const { isMobile } = useBreakpoints()

  return (
    <Alert
      className={cx('u-pos-relative', className)}
      block={block}
      icon={icon}
      color={color}
      severity={severity}
      square={isMobile}
      action={
        showAction && (
          <>
            {button}
            {!block && (
              <ListItemIcon className="u-ml-half">{menu}</ListItemIcon>
            )}
          </>
        )
      }
    >
      {block && showAction && (
        <ListItemIcon className="u-pos-absolute u-top-xs u-right-xs">
          {menu}
        </ListItemIcon>
      )}
      <AlertTitle classes={styles} variant="caption" color={labelColor}>
        {label}
      </AlertTitle>
      {children}
    </Alert>
  )
}

TriggerAlertTemplate.propsTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  severity: PropTypes.string,
  labelColor: PropTypes.string,
  block: PropTypes.bool,
  menu: PropTypes.node,
  button: PropTypes.node,
  children: PropTypes.node,
  showAction: PropTypes.bool
}

export { TriggerAlertTemplate }
