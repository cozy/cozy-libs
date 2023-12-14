import PropTypes from 'prop-types'
import React, { useState } from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import CompositeHeader from '../../CompositeHeader/CompositeHeader'
import CompositeHeaderImage from '../../CompositeHeader/CompositeHeaderImage'
import { useFormData } from '../../Hooks/useFormData'
import { useStepperDialog } from '../../Hooks/useStepperDialog'
import { getAttributesFromOcr, makeMetadataFromOcr } from '../helpers'

const SelectPaperFormat = ({ onBack, ocrFromFlagship }) => {
  const { t } = useI18n()
  const { setFormData } = useFormData()
  const { currentDefinition, nextStep } = useStepperDialog()
  const [selectedVersion, setSelectedVersion] = useState()
  const { ocrAttributes } = currentDefinition

  const handleClick = () => {
    const attributesSelected = ocrAttributes.find(
      attr => attr.version === selectedVersion
    )
    const attributesFound = getAttributesFromOcr(
      ocrFromFlagship,
      attributesSelected
    )

    const metadataFromOcr = makeMetadataFromOcr(attributesFound)
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        ...metadataFromOcr
      }
    }))

    nextStep()
  }

  const handleCheck = version => {
    setSelectedVersion(version)
  }

  return (
    <Dialog
      open
      onBack={onBack}
      transitionDuration={0}
      content={
        <CompositeHeader
          title={t('SelectPaperFormat.title')}
          text={ocrAttributes.map(attr => (
            <Box
              key={attr.version}
              borderRadius="0.5rem"
              border="1px solid var(--borderMainColor)"
              marginTop="0.5rem"
            >
              <List className="u-p-0">
                <ListItem
                  button
                  size="large"
                  ellipsis={false}
                  onClick={() => handleCheck(attr.version)}
                >
                  <CompositeHeaderImage
                    icon={attr.illustration}
                    iconSize="xsmall"
                  />
                  <ListItemText primary={t(attr.versionLabel)} />
                  <ListItemSecondaryAction>
                    <Radio
                      checked={selectedVersion === attr.version}
                      onChange={() => handleCheck(attr.version)}
                      value={attr.version}
                      name={attr.version}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Box>
          ))}
        />
      }
      actions={
        <Button
          data-testid="next-button"
          fullWidth
          label={t('common.next')}
          onClick={handleClick}
          disabled={!selectedVersion}
        />
      }
    />
  )
}

SelectPaperFormat.propTypes = {
  onBack: PropTypes.func.isRequired,
  ocrFromFlagship: PropTypes.object.isRequired
}

export default SelectPaperFormat
