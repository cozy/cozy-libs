import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon, { iconPropType } from 'cozy-ui/transpiled/react/Icon'
import { ActionMenuHeader } from 'cozy-ui/transpiled/react/ActionMenu'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'

import FileIcon from '../Icons/FileIcon'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import ImportDropdownItems from './ImportDropdownItems'

const ImportDropdown = ({ placeholder, onClick, onClose }) => {
  const { t } = useI18n()
  const scannerT = useScannerI18n()
  const { label, icon } = placeholder

  return (
    <>
      <ActionMenuHeader>
        <Media>
          <Img>
            <FileIcon icon={icon} />
          </Img>
          <Bd className="u-ml-1 u-flex u-flex-items-center u-flex-justify-between">
            <Typography variant="h6">
              {t('ImportDropdown.title', {
                name: scannerT(`items.${label}`)
              })}
            </Typography>
            {onClose && (
              <div className="u-flex">
                <Icon
                  icon="cross-medium"
                  className="u-c-pointer u-pl-half"
                  onClick={onClose}
                />
              </div>
            )}
          </Bd>
        </Media>
      </ActionMenuHeader>
      <ImportDropdownItems onClick={onClick} placeholder={placeholder} />
    </>
  )
}

ImportDropdown.propTypes = {
  placeholder: PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: iconPropType.isRequired,
    acquisitionSteps: PropTypes.array.isRequired,
    konnectorCriteria: PropTypes.shape({
      name: PropTypes.string,
      category: PropTypes.string
    })
  }).isRequired,
  onClose: PropTypes.func,
  onClick: PropTypes.func
}

export default ImportDropdown
