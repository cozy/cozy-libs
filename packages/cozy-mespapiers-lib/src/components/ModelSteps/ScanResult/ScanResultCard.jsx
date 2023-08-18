import PropTypes from 'prop-types'
import React, { useState, forwardRef } from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import styles from './ScanResultCard.styl'
import ScanResultCardActions from './ScanResultCardActions'
import { useFormData } from '../../Hooks/useFormData'
import { useStepperDialog } from '../../Hooks/useStepperDialog'
import { getLastFormDataFile, isSameFile } from '../helpers'
import RotateImage from '../widgets/RotateImage'

const isImageType = file => file.type.match(/image\/.*/)

const ScanResultCard = forwardRef(
  ({ currentFile, setCurrentFile, setRotationImage, rotationImage }, ref) => {
    const { setFormData, formData } = useFormData()
    const { currentStepIndex } = useStepperDialog()
    const [imgWrapperMinHeight, setImgWrapperMinHeight] = useState(0)
    const [isImageRotating, setIsImageRotating] = useState(false)

    const handleSelectedFile = () => {
      const newData = formData.data.filter(
        data => !isSameFile(currentFile, data.file)
      )
      setCurrentFile(
        getLastFormDataFile({ formData: { data: newData }, currentStepIndex })
      )

      setFormData(prev => ({
        ...prev,
        data: newData
      }))
    }

    const handleRotate = () => {
      setIsImageRotating(true)
      setRotationImage(prev => prev - 90)
    }

    const handleImageLoaded = () => {
      setIsImageRotating(false)
      // We don't want to recalculate the size on every rotation
      if (ref.current && imgWrapperMinHeight === 0) {
        const maxSize = Math.max(
          ref.current.offsetWidth,
          ref.current.offsetHeight
        )
        setImgWrapperMinHeight(maxSize)
      }
    }

    return (
      <Card className="u-ta-center u-p-1 u-flex u-flex-column u-flex-justify-between">
        <div className={styles['image-container']}>
          {isImageType(currentFile) ? (
            <RotateImage
              image={URL.createObjectURL(currentFile)}
              onLoaded={handleImageLoaded}
              rotation={rotationImage}
              a11n={{ 'aria-hidden': true }}
              ref={ref}
            />
          ) : (
            <>
              <Icon icon="file-type-pdf" size={80} aria-hidden="true" />
              <Typography>{currentFile.name}</Typography>
            </>
          )}
        </div>
        <Box display="flex" gridGap="1rem" marginTop="1rem">
          <ScanResultCardActions
            onRotate={handleRotate}
            onCancel={handleSelectedFile}
            isImageRotating={isImageRotating}
          />
        </Box>
      </Card>
    )
  }
)
ScanResultCard.displayName = 'ScanResultCard'

ScanResultCard.propTypes = {
  currentFile: PropTypes.object.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  setRotationImage: PropTypes.func.isRequired,
  rotationImage: PropTypes.number.isRequired
}

export default ScanResultCard
