import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import Skeleton from 'cozy-ui/transpiled/react/Skeleton'

import styles from './Thumbnail.styl'

/**
 * StackedThumbnail component
 * @param {Object} props
 * @param {string} props.image - Image url
 * @param {boolean} props.isStacked - Is the image stacked
 * @example
 * <StackedThumbnail image="https://example.com/image.jpg" isStacked={<condition>} />
 */
const StackedThumbnail = ({ image, fallback, isStacked }) => {
  // TODO Ne pas utiliser la prop fallback mais regarder si l'image est valide ?
  return (
    <div className={styles['container']} aria-hidden="true">
      <div
        className={cx(styles['image__wrapper'], {
          [styles['image__wrapper__multiple']]: isStacked
        })}
        data-testid="ThumbnailContainer"
        style={{ backgroundColor: '#fff' }}
      >
        {fallback ? (
          <Skeleton
            variant="rect"
            animation="wave"
            width={isStacked ? 23 : 26}
            height={isStacked ? 23 : 26}
            style={{ borderRadius: '3px' }}
          />
        ) : (
          <img
            src={image}
            className={cx(styles['image'], {
              [styles['image__multiple']]: isStacked
            })}
          />
        )}
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
          {fallback ? (
            <Skeleton variant="rect" animation="wave" width={23} height={23} />
          ) : (
            <img
              src={image}
              className={cx(
                styles['image'],
                styles['image__background'],
                styles['image__multiple']
              )}
            />
          )}
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
