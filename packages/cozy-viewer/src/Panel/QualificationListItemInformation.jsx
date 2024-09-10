import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import {
  getTranslatedNameForInformationMetadata,
  formatInformationMetadataValue
} from 'cozy-client/dist/models/paper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Dots from 'cozy-ui/transpiled/react/Icons/Dots'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import QualificationListItemText from './QualificationListItemText'

const QualificationListItemInformation = forwardRef(
  ({ formattedMetadataQualification, file, toggleActionsMenu }, ref) => {
    const { lang } = useI18n()
    const { name, value } = formattedMetadataQualification
    const qualificationLabel = file.metadata.qualification.label

    const formattedTitle = getTranslatedNameForInformationMetadata(name, {
      lang,
      qualificationLabel
    })
    const formattedValue = formatInformationMetadataValue(value, {
      lang,
      name,
      qualificationLabel
    })

    const titleComponent =
      formattedTitle === name ? <MidEllipsis text={name} /> : formattedTitle

    return (
      <ListItem className="u-pl-2 u-pr-3">
        <QualificationListItemText
          primary={titleComponent}
          secondary={formattedValue}
          disabled={!value}
        />
        <ListItemSecondaryAction>
          <IconButton
            ref={ref}
            onClick={() => toggleActionsMenu(value)}
            data-testid="toggleActionsMenuBtn"
          >
            <Icon icon={Dots} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
)

QualificationListItemInformation.displayName = 'QualificationListItemNumber'

QualificationListItemInformation.propTypes = {
  formattedMetadataQualification: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  toggleActionsMenu: PropTypes.func.isRequired
}

export default QualificationListItemInformation
