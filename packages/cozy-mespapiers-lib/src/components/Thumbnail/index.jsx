import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import CozyIcon from 'cozy-ui/transpiled/react/Icon'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'

import styles from './Thumbnail.styl'

const getSkeletonSize = isStacked => (isStacked ? 23 : 26)

const ThumbnailWrapper = ({ children, isStacked }) => {
  return (
    <div
      className={cx(styles['image__wrapper'], {
        [styles['image__wrapper__multiple']]: isStacked
      })}
      data-testid="ThumbnailWrapper"
    >
      {children}
    </div>
  )
}

const BackgroundThumbnailWrapper = ({ children }) => {
  return (
    <div
      className={cx(
        styles['image__wrapper'],
        styles['image__wrapper__background'],
        styles['image__wrapper__multiple']
      )}
      data-testid="ThumbnailBackgroundWrapper"
    >
      {children}
    </div>
  )
}

const BackgroundThumbnailImage = ({ image }) => {
  return (
    <BackgroundThumbnailWrapper>
      <img
        src={image}
        className={cx(
          styles['image'],
          styles['image__background'],
          styles['image__multiple']
        )}
        data-testid="BackgroundThumbnailImage"
      />
    </BackgroundThumbnailWrapper>
  )
}

const ThumbnailImage = ({ image, isStacked }) => {
  return (
    <ThumbnailWrapper isStacked={isStacked}>
      <img
        src={image}
        className={cx(styles['image'], {
          [styles['image__multiple']]: isStacked
        })}
        data-testid="ThumbnailImage"
      />
    </ThumbnailWrapper>
  )
}

const BackgroundThumbnailIcon = ({ icon: Icon }) => {
  const skeletonSize = getSkeletonSize(true)

  return (
    <BackgroundThumbnailWrapper>
      <CozyIcon
        icon={Icon}
        height={skeletonSize}
        width={skeletonSize}
        data-testid="BackgroundThumbnailIcon"
      />
    </BackgroundThumbnailWrapper>
  )
}

const ThumbnailIcon = ({ icon: Icon, isStacked }) => {
  const skeletonSize = getSkeletonSize(isStacked)

  return (
    <ThumbnailWrapper isStacked={isStacked}>
      <CozyIcon
        icon={Icon}
        height={skeletonSize}
        width={skeletonSize}
        data-testid="ThumbnailIcon"
      />
    </ThumbnailWrapper>
  )
}

const BackgroundThumbnailFallback = () => {
  const skeletonSize = getSkeletonSize(true)

  return (
    <BackgroundThumbnailWrapper>
      <Skeleton
        variant="rect"
        animation={false}
        width={skeletonSize}
        height={skeletonSize}
        data-testid="SkeletonBackground"
      />
    </BackgroundThumbnailWrapper>
  )
}

const ThumbnailFallback = ({ isStacked }) => {
  const skeletonSize = getSkeletonSize(isStacked)

  return (
    <ThumbnailWrapper>
      <Skeleton
        variant="rect"
        animation="wave"
        width={skeletonSize}
        height={skeletonSize}
        style={{ borderRadius: 3 }}
        data-testid="Skeleton"
      />
    </ThumbnailWrapper>
  )
}

const Thumbnail = ({ image, icon, isStacked }) => {
  if (icon) {
    return (
      <>
        <ThumbnailIcon icon={icon} isStacked={isStacked} />
        {isStacked && <BackgroundThumbnailIcon icon={icon} />}
      </>
    )
  }

  if (image) {
    return (
      <>
        <ThumbnailImage image={image} isStacked={isStacked} />
        {isStacked && <BackgroundThumbnailImage image={image} />}
      </>
    )
  }

  return (
    <>
      <ThumbnailFallback isStacked={isStacked} />
      {isStacked && <BackgroundThumbnailFallback />}
    </>
  )
}

/**
 * Thumbnail component
 * The `icon` property takes precedence over the `image` property
 * @param {Object} props
 * @param {string} props.image - Image source
 * @param {React.ElementType} props.icon - Icon component
 * @param {boolean} props.isStacked - Is the image stacked
 * @example
 * <Thumbnail image="https://example.com/image.jpg" isStacked={<condition>} />
 * <Thumbnail icon={IconExample} isStacked={<condition>} />
 * <Thumbnail icon={"icon-example"} isStacked={<condition>} />
 */
const ThumbnailContainer = ({ image, icon, isStacked }) => {
  return (
    <div className={styles['container']} aria-hidden="true">
      <Thumbnail image={image} icon={icon} isStacked={isStacked} />
    </div>
  )
}

ThumbnailContainer.propTypes = {
  image: PropTypes.string,
  icon: PropTypes.elementType,
  isStacked: PropTypes.bool
}

export default ThumbnailContainer
