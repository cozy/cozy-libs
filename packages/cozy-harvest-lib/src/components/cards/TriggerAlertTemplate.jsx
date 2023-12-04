import PropTypes from 'prop-types'
import React from 'react'

import Alert from 'cozy-ui/transpiled/react/Alert'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

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
const useStyles = makeStyles({
  root: {
    padding: '.5rem 1rem'
  },
  message: ({ block }) =>
    block && {
      maxWidth: 'calc(100% - 16px - .5rem)' // 16px is the size of the icon
    },
  action: {
    marginRight: '-.5rem'
  },
  icon: {
    marginRight: '.5rem'
  }
})

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
  const styles = useStyles({ block })
  const { isMobile } = useBreakpoints()

  return (
    <Alert
      block={block}
      icon={icon}
      color={color}
      severity={severity}
      square={isMobile}
      action={
        showAction ? (
          <>
            {button}
            {!block ? (
              <div
                style={{
                  margin: '-.5rem -.5rem -.5rem 0'
                }}
              >
                {menu}
              </div>
            ) : null}
          </>
        ) : null
      }
      className={className}
      classes={styles}
    >
      <div
        className="u-flex-auto u-flex u-flex-column"
        style={{ gap: '.5rem' }}
      >
        <div className="u-flex u-flex-items-center">
          <Typography
            variant="caption"
            className="u-flex-auto"
            color={labelColor}
          >
            {label}
          </Typography>
          {block && showAction ? (
            <div
              style={{
                margin: '-1rem -1rem -1rem 0'
              }}
            >
              {menu}
            </div>
          ) : null}
        </div>
        {children}
      </div>
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
