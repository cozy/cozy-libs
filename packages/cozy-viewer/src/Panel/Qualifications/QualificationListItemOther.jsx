import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'
import { useI18n } from 'twake-i18n'

import {
  getTranslatedNameForOtherMetadata,
  formatOtherMetadataValue
} from 'cozy-client/dist/models/paper'
import { copyToClipboard } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Dots from 'cozy-ui/transpiled/react/Icons/Dots'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import QualificationListItemText from './QualificationListItemText'
import IntentOpener from '../../components/IntentOpener'

const QualificationListItemOther = forwardRef(
  (
    { file, isReadOnly, formattedMetadataQualification, toggleActionsMenu },
    ref
  ) => {
    const { lang } = useI18n()
    const { showAlert } = useAlert()

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

    const handleClick = async () => {
      if (!value) return
      await copyToClipboard().action(undefined, { showAlert, copyValue: value })
    }

    return (
      <IntentOpener
        action="OPEN"
        doctype="io.cozy.files.paper"
        options={{
          path: `${qualificationLabel}/${file._id}/edit/information?metadata=${name}`
        }}
        disabled={!!value || isReadOnly}
      >
        <ListItem button={!!value || !isReadOnly} onClick={handleClick}>
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
            !isReadOnly && (
              <ListItemIcon>
                <Icon icon={RightIcon} color="var(--secondaryTextColor)" />
              </ListItemIcon>
            )
          )}
        </ListItem>
      </IntentOpener>
    )
  }
)
QualificationListItemOther.displayName = 'QualificationListItemOther'

QualificationListItemOther.propTypes = {
  file: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool,
  formattedMetadataQualification: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  }).isRequired,
  toggleActionsMenu: PropTypes.func.isRequired
}

export default QualificationListItemOther
