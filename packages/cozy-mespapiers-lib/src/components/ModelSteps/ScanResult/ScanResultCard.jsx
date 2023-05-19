import PropTypes from 'prop-types'
import React, { useState, forwardRef } from 'react'

import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import ScanResultCardActions from './ScanResultCardActions'
import { useFormData } from '../../Hooks/useFormData'
import { getLastFormDataFile, isSameFile } from '../helpers'
import RotateImage from '../widgets/RotateImage'

const isImageType = file => file.type.match(/image\/.*/)

const ScanResultCard = forwardRef(
  (
    {
      currentFile,
      setCurrentFile,
      currentStep,
      setRotationImage,
      rotationImage
    },
    ref
  ) => {
    const { setFormData, formData } = useFormData()
    const [imgWrapperMinHeight, setImgWrapperMinHeight] = useState(0)
    const { stepIndex } = currentStep

    const handleSelectedFile = () => {
      const newData = formData.data.filter(
        data => !isSameFile(currentFile, data.file)
      )
      setCurrentFile(
        getLastFormDataFile({ formData: { data: newData }, stepIndex })
      )

      setFormData(prev => ({
        ...prev,
        data: newData
      }))
    }

    const handleRotate = () => {
      setRotationImage(prev => prev - 90)
    }

    const handleImageLoaded = () => {
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
        <div
          className="u-flex u-flex-justify-center u-flex-items-center u-h-100"
          style={{ minHeight: imgWrapperMinHeight }}
        >
          <div className="u-mah-5">
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
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <ScanResultCardActions
            onRotate={handleRotate}
            onCancel={handleSelectedFile}
          />
        </div>
      </Card>
    )
  }
)
ScanResultCard.displayName = 'ScanResultCard'

ScanResultCard.propTypes = {
  currentFile: PropTypes.object.isRequired,
  setCurrentFile: PropTypes.func.isRequired
}

export default ScanResultCard
