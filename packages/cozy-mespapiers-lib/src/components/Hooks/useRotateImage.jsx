import { useEffect, useRef, useState } from 'react'

import { makeRotatedImage } from '../ModelSteps/helpers'

export const useRotateImage = (imageSrc, rotation) => {
  const imageEle = useRef(null)
  const [rotatedImage, setRotatedImage] = useState(null)

  useEffect(() => {
    ;(async () => {
      if (typeof rotation === 'number') {
        let currImage = imageEle.current

        if (currImage?.currentSrc !== imageSrc) {
          currImage = new Image()
          imageEle.current = currImage

          currImage.src = imageSrc
        }

        try {
          await currImage.decode()
          setRotatedImage(makeRotatedImage(currImage, rotation))
        } catch (e) {
          setRotatedImage(null)
        }
      }
    })()
  }, [imageSrc, rotation])

  return rotatedImage
}
