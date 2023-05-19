import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'

import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import ScanResultCardActions from './ScanResultCardActions'
import { isSameFile } from './helpers'
import RotateImage from './widgets/RotateImage'
import { useFormData } from '../Hooks/useFormData'

const isImageType = file => file.type.match(/image\/.*/)

const ScanResultCard = ({ currentFile, setCurrentFile }) => {
  const imageRef = useRef(null)
  const { setFormData, formData } = useFormData()
  const [rotationImage, setRotationImage] = useState(0)

  const handleSelectedFile = () => {
    const newData = formData.data.filter(
      data => !isSameFile(currentFile, data.file)
    )

    setFormData(prev => ({
      ...prev,
      data: newData
    }))

    setCurrentFile(null)
  }

  const handleRotate = () => {
    setRotationImage(prev => prev - 90)
  }

  return (
    <Card className="u-ta-center u-p-1">
      <div className="u-mah-5">
        {isImageType(currentFile) ? (
          <RotateImage
            image={URL.createObjectURL(currentFile)}
            rotation={rotationImage}
            a11n={{ 'aria-hidden': true }}
            ref={imageRef}
          />
        ) : (
          <>
            <Icon icon="file-type-pdf" size={80} aria-hidden="true" />
            <Typography>{currentFile.name}</Typography>
          </>
        )}
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

ScanResultCard.propTypes = {
  currentFile: PropTypes.object.isRequired,
  setCurrentFile: PropTypes.func.isRequired
}

export default ScanResultCard
