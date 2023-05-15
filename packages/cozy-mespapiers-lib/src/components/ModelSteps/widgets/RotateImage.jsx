import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import { useRotateImage } from '../../Hooks/useRotateImage'

const RotateImage = forwardRef(
  ({ image, rotation = 0, alt = '', a11n = {} }, ref) => {
    const { src } = useRotateImage(image, rotation) ?? {}

    if (!src) return null

    return (
      <img
        ref={ref}
        src={src}
        style={{ maxWidth: '100%', maxHeight: 'inherit' }}
        alt={alt}
        {...a11n}
      />
    )
  }
)
RotateImage.displayName = 'RotateImage'

RotateImage.propTypes = {
  image: PropTypes.string,
  rotation: PropTypes.number,
  alt: PropTypes.string,
  a11n: PropTypes.object
}

export default RotateImage
