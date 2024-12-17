import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import {
  getTranslatedNameForOtherMetadata,
  formatOtherMetadataValue
} from 'cozy-client/dist/models/paper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Dots from 'cozy-ui/transpiled/react/Icons/Dots'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import QualificationListItemText from './QualificationListItemText'
import IntentOpener from '../components/IntentOpener'

const QualificationListItemOther = forwardRef(
  ({ file, formattedMetadataQualification, toggleActionsMenu }, ref) => {
    const { lang } = useI18n()
    const { name, value } = formattedMetadataQualification
    const qualificationLabel = file.metadata.qualification.label

    if (!value) return null

    const formattedTitle = getTranslatedNameForOtherMetadata(name, {
      lang
    })
    const formattedValue = formatOtherMetadataValue(value, {
      lang,
      name
    })

    return (
      <IntentOpener
        action="OPEN"
        doctype="io.cozy.files.paper"
        options={{
          path: `${qualificationLabel}/${file._id}/edit/information?metadata=${name}`
        }}
        disabled={!!value}
      >
        <ListItem>
          <ListItemIcon>
            <Icon icon={FileIcon} />
          </ListItemIcon>
          <QualificationListItemText
            primary={value ? formattedTitle : undefined}
            secondary={
              value ? <MidEllipsis text={formattedValue} /> : formattedTitle
            }
          />
          {value ? (
            <ListItemSecondaryAction>
              <IconButton
                ref={ref}
                onClick={() => toggleActionsMenu(formattedValue)}
              >
                <Icon icon={Dots} />
              </IconButton>
            </ListItemSecondaryAction>
          ) : (
            <ListItemIcon>
              <Icon icon={RightIcon} color="var(--secondaryTextColor)" />
            </ListItemIcon>
          )}
        </ListItem>
      </IntentOpener>
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
