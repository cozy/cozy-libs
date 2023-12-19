import { useEffect, useRef, useState } from 'react'

import minilog from 'cozy-minilog'

import { makeRotatedImage } from '../ModelSteps/helpers'

const log = minilog('useRotatedImage')

export const useRotatedImage = (imageSrc, rotation) => {
  const imageRef = useRef(null)
  const [rotatedImage, setRotatedImage] = useState(imageSrc)

  useEffect(() => {
    const rotateImage = async () => {
      let currImage = imageRef.current

      if (currImage?.currentSrc !== imageSrc) {
        currImage = new Image()
        imageRef.current = currImage

        currImage.src = imageSrc
      }

      try {
        await currImage.decode()
        setRotatedImage(makeRotatedImage(currImage, rotation))
      } catch (err) {
        log.error('Rotate image failed', err)
        setRotatedImage(imageSrc)
      }
    }

    if (typeof rotation === 'number' && rotation !== 0) {
      rotateImage()
    }
  }, [imageSrc, rotation])

  return rotatedImage
}
