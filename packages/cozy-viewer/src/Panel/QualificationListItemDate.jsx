import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import {
  isExpired,
  isExpiringSoon,
  getTranslatedNameForDateMetadata,
  formatDateMetadataValue
} from 'cozy-client/dist/models/paper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import CalendarIcon from 'cozy-ui/transpiled/react/Icons/Calendar'
import Dots from 'cozy-ui/transpiled/react/Icons/Dots'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import QualificationListItemText from './QualificationListItemText'
import ExpirationAnnotation from '../components/ExpirationAnnotation'
import IntentOpener from '../components/IntentOpener'

const QualificationListItemDate = forwardRef(
  (
    { file, isReadOnly, formattedMetadataQualification, toggleActionsMenu },
    ref
  ) => {
    const { f, lang } = useI18n()
    const { name, value } = formattedMetadataQualification
    const qualificationLabel = file.metadata.qualification.label
    const formattedTitle = getTranslatedNameForDateMetadata(name, { lang })
    const formattedDate = formatDateMetadataValue(value, {
      f,
      lang
    })
    const isExpirationDate = name === 'expirationDate'

    return (
      <IntentOpener
        action="OPEN"
        doctype="io.cozy.files.paper"
        options={{
          path: `${qualificationLabel}/${file._id}/edit/information?metadata=${name}`
        }}
        disabled={!!value || isReadOnly}
      >
        <ListItem button={!value && !isReadOnly}>
          <ListItemIcon>
            <Icon icon={CalendarIcon} />
          </ListItemIcon>
          <QualificationListItemText
            primary={value ? formattedTitle : undefined}
            secondary={
              value ? (
                <>
                  <Typography component="span" variant="inherit">
                    {formattedDate}
                  </Typography>
                  {isExpirationDate &&
                    (isExpired(file) || isExpiringSoon(file)) && (
                      <>
                        <Typography component="span" variant="inherit">
                          {' · '}
                        </Typography>
                        <ExpirationAnnotation />
                      </>
                    )}
                </>
              ) : (
                formattedTitle
              )
            }
            disabled={!value}
          />
          {value ? (
            <ListItemSecondaryAction>
              <IconButton
                ref={ref}
                onClick={() => toggleActionsMenu(formattedDate)}
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

QualificationListItemDate.displayName = 'QualificationListItemDate'

QualificationListItemDate.propTypes = {
  file: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool,
  formattedMetadataQualification: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  }).isRequired,
  toggleActionsMenu: PropTypes.func.isRequired
}

export default QualificationListItemDate
