import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import { useRotatedImage } from '../../Hooks/useRotatedImage'

const RotateImage = forwardRef(
  ({ image, onLoaded, rotation, a11n, ...props }, ref) => {
    const src = useRotatedImage(image, rotation) ?? {}

    return (
      <img
        ref={ref}
        onLoad={onLoaded}
        src={src}
        style={{ maxWidth: '100%', objectFit: 'contain' }}
        {...a11n}
        {...props}
      />
    )
  }
)
RotateImage.displayName = 'RotateImage'

RotateImage.propTypes = {
  image: PropTypes.string,
  onLoaded: PropTypes.func,
  rotation: PropTypes.number,
  alt: PropTypes.string,
  a11n: PropTypes.object
}

RotateImage.defaultProps = {
  onLoaded: () => {},
  rotation: 0,
  alt: '',
  a11n: {}
}

export default RotateImage
