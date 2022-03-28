import React, { useState, useEffect, isValidElement } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import isArray from 'lodash/isArray'
import { makeStyles } from '@material-ui/core/styles'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon, { iconPropType } from 'cozy-ui/transpiled/react/Icon'

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100%',
    maxWidth: '100%',
    margin: '2rem 0 1rem',
    '&.is-focused': {
      height: 'initial'
    },
    '& img': {
      width: 'fit-content',
      margin: '0 auto'
    }
  },
  image: {
    '&--small': {
      height: '4rem'
    },
    '&--medium': {
      height: '6rem'
    },
    '&--large': {
      height: '8rem'
    }
  }
}))

const CompositeHeaderImage = ({ isBitmap, src, iconSize }) => {
  const styles = useStyles()

  return isBitmap ? (
    <img src={src} alt="illustration" />
  ) : (
    <div
      className={cx('u-pb-1', {
        [`${styles.image}--${iconSize}`]: iconSize
      })}
    >
      <Icon icon={src} size={'100%'} />
    </div>
  )
}

// TODO Test and improve it & PR cozy-ui
const CompositeHeader = ({
  icon,
  fallbackIcon,
  iconSize,
  title: Title,
  text: Text,
  className,
  ...restProps
}) => {
  const [imgScr, setImgSrc] = useState(null)
  const { isMobile } = useBreakpoints()
  const styles = useStyles()

  const isPNG = icon && icon.endsWith('.png')
  const subFolder = isPNG ? 'images' : 'icons'

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      let src = await import(`../../assets/${subFolder}/${icon}`).catch(() => ({
        default: fallbackIcon
      }))
      isMounted && setImgSrc(src.default)
    })()

    return () => {
      isMounted = false
    }
  }, [icon, fallbackIcon, subFolder])

  return (
    <div className={cx(styles.container, className)} {...restProps}>
      {imgScr && (
        <CompositeHeaderImage
          isBitmap={isPNG}
          src={imgScr}
          iconSize={iconSize}
        />
      )}
      {Title &&
        (isValidElement(Title) ? (
          Title
        ) : (
          <Typography variant="h5" color="textPrimary" className={'u-mh-2'}>
            {Title}
          </Typography>
        ))}
      {Text &&
        (isValidElement(Text) || isArray(Text) ? (
          <div
            className={cx({
              ['u-mv-1']: !isMobile || (isArray(Text) && Text.length <= 1),
              ['u-mt-1 u-mah-5 u-pv-1 u-ov-scroll']:
                isMobile && isArray(Text) && Text.length > 1
            })}
          >
            {Text}
          </div>
        ) : (
          <Typography variant="body1" className={'u-mt-1'}>
            {Text}
          </Typography>
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
CompositeHeader.defaultProps = {
  iconSize: 'large'
}

export default CompositeHeader
