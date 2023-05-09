import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

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

const Thumbnail = ({ image, isStacked }) => {
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
 * StackedThumbnail component
 * @param {Object} props
 * @param {string} props.image - Image source
 * @param {boolean} props.isStacked - Is the image stacked
 * @example
 * <StackedThumbnail image="https://example.com/image.jpg" isStacked={<condition>} />
 */
const StackedThumbnail = ({ image, isStacked }) => {
  return (
    <div className={styles['container']} aria-hidden="true">
      <Thumbnail image={image} isStacked={isStacked} />
    </div>
  )
}

StackedThumbnail.propTypes = {
  image: PropTypes.string,
  isStacked: PropTypes.bool
}

export default StackedThumbnail
