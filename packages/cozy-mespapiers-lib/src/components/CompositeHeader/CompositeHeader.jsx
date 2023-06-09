import cx from 'classnames'
import isArray from 'lodash/isArray'
import PropTypes from 'prop-types'
import React, { isValidElement } from 'react'

import { iconPropType } from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import CompositeHeaderImage from './CompositeHeaderImage'

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100%',
    maxWidth: '100%',
    '&.is-focused': {
      height: 'initial'
    },
    '& img': {
      width: 'fit-content',
      margin: '0 auto'
    }
  }
}))

const CompositeHeader = ({
  icon,
  fallbackIcon,
  iconSize = 'large',
  title: Title,
  text: Text,
  className,
  ...restProps
}) => {
  const { isMobile } = useBreakpoints()
  const styles = useStyles()

  return (
    <div className={cx(styles.container, className)} {...restProps}>
      <CompositeHeaderImage
        icon={icon}
        fallbackIcon={fallbackIcon}
        iconSize={iconSize}
      />
      {Title &&
        (isValidElement(Title) ? (
          Title
        ) : (
          <Typography variant="h5" color="textPrimary" className="u-mh-2">
            {Title}
          </Typography>
        ))}
      {Text &&
        (isValidElement(Text) || isArray(Text) ? (
          <div
            className={cx({
              ['u-mt-1']: !isMobile || (isArray(Text) && Text.length <= 1),
              ['u-mt-1 u-mah-5 u-pv-1 u-ov-scroll']:
                isMobile && isArray(Text) && Text.length > 1
            })}
          >
            {Text}
          </div>
        ) : (
          <Typography className="u-mt-1">{Text}</Typography>
        ))}
    </div>
  )
}

CompositeHeader.propTypes = {
  icon: iconPropType,
  fallbackIcon: iconPropType,
  iconSize: PropTypes.oneOf(['small', 'medium', 'large']),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  className: PropTypes.string
}

export default CompositeHeader
