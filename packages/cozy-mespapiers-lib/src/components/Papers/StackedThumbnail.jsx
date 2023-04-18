import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './Thumbnail.styl'

/**
 * StackedThumbnail component
 * @param {Object} props
 * @param {string} props.image - Image url
 * @param {boolean} props.isStacked - Is the image stacked
 * @example
 * <StackedThumbnail image="https://example.com/image.jpg" isStacked={<condition>} />
 */
const StackedThumbnail = ({ image, isStacked }) => {
  return (
    <div className={styles['container']} aria-hidden="true">
      <div
        className={cx(styles['image__wrapper'], {
          [styles['image__wrapper__multiple']]: isStacked
        })}
        data-testid="ThumbnailContainer"
      >
        <img
          src={image}
          className={cx(styles['image'], {
            [styles['image__multiple']]: isStacked
          })}
        />
      </div>
      {isStacked && (
        <div
          className={cx(
            styles['image__wrapper'],
            styles['image__wrapper__background'],
            styles['image__wrapper__multiple']
          )}
          data-testid="ThumbnailBackgroundContainer"
        >
          <img
            src={image}
            className={cx(
              styles['image'],
              styles['image__background'],
              styles['image__multiple']
            )}
          />
        </div>
      )}
    </div>
  )
}

StackedThumbnail.propTypes = {
  image: PropTypes.string,
  isStacked: PropTypes.bool
}

export default StackedThumbnail
