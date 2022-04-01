import React, { useState, useEffect, isValidElement } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import isArray from 'lodash/isArray'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon, { iconPropType } from 'cozy-ui/transpiled/react/Icon'

// import './styles.styl'

const CompositeHeaderImage = ({ isBitmap, src, iconSize }) => {
  return isBitmap ? (
    <img src={src} alt="illustration" />
  ) : (
    <div
      className={cx('u-pb-1', {
        [`composite-header-img--${iconSize}`]: iconSize
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
    <div className={cx('composite-header-container', className)} {...restProps}>
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
