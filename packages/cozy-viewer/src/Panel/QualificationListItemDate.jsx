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
import Dots from 'cozy-ui/transpiled/react/Icons/Dots'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import QualificationListItemText from './QualificationListItemText'
import ExpirationAnnotation from '../components/ExpirationAnnotation'

const QualificationListItemDate = forwardRef(
  ({ file, formattedMetadataQualification, toggleActionsMenu }, ref) => {
    const { f, lang } = useI18n()
    const { name, value } = formattedMetadataQualification
    const formattedTitle = getTranslatedNameForDateMetadata(name, { lang })
    const formattedDate = formatDateMetadataValue(value, {
      f,
      lang
    })
    const isExpirationDate = name === 'expirationDate'

    return (
      <ListItem className="u-pl-2 u-pr-3">
        <QualificationListItemText
          primary={formattedTitle}
          secondary={
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
                    <ExpirationAnnotation file={file} />
                  </>
                )}
            </>
          }
          disabled={!value}
        />
        <ListItemSecondaryAction>
          <IconButton
            ref={ref}
            onClick={() => toggleActionsMenu(formattedDate)}
          >
            <Icon icon={Dots} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
)

QualificationListItemDate.displayName = 'QualificationListItemDate'

QualificationListItemDate.propTypes = {
  file: PropTypes.object.isRequired,
  formattedMetadataQualification: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  }).isRequired,
  toggleActionsMenu: PropTypes.func.isRequired
}

export default QualificationListItemDate
