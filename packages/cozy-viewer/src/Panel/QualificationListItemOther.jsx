import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import {
  getTranslatedNameForOtherMetadata,
  formatOtherMetadataValue
} from 'cozy-client/dist/models/paper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Dots from 'cozy-ui/transpiled/react/Icons/Dots'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import QualificationListItemText from './QualificationListItemText'

const QualificationListItemOther = forwardRef(
  ({ formattedMetadataQualification, toggleActionsMenu }, ref) => {
    const { lang } = useI18n()
    const { name, value } = formattedMetadataQualification

    if (!value) return null

    const formattedTitle = getTranslatedNameForOtherMetadata(name, {
      lang
    })
    const formattedValue = formatOtherMetadataValue(value, {
      lang,
      name
    })

    return (
      <ListItem className="u-pl-2 u-pr-3">
        <QualificationListItemText
          primary={formattedTitle}
          secondary={<MidEllipsis text={formattedValue} />}
        />
        <ListItemSecondaryAction>
          <IconButton
            ref={ref}
            onClick={() => toggleActionsMenu(formattedValue)}
          >
            <Icon icon={Dots} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
)
QualificationListItemOther.displayName = 'QualificationListItemOther'

QualificationListItemOther.propTypes = {
  formattedMetadataQualification: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  }).isRequired,
  toggleActionsMenu: PropTypes.func.isRequired
}

export default QualificationListItemOther
