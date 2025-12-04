import PropTypes from 'prop-types'
import React from 'react'
import { useI18n } from 'twake-i18n'

import { formatOtherMetadataValue } from 'cozy-client/dist/models/paper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import QualificationIcon from 'cozy-ui-plus/dist/Qualification/QualificationIcon'

import { canEditQualification } from '../helpers'

const QualificationListItemQualification = ({ file, isReadOnly, onClick }) => {
  const { lang } = useI18n()
  const value = file.metadata.qualification.label

  const formattedValue = formatOtherMetadataValue(value, {
    lang,
    name: 'qualification'
  })

  return (
    <ListItem
      size="large"
      divider
      button={canEditQualification(file, isReadOnly)}
      onClick={canEditQualification(file, isReadOnly) ? onClick : undefined}
    >
      <ListItemIcon>
        <QualificationIcon qualification={value} />
      </ListItemIcon>
      <ListItemText
        primary={<MidEllipsis text={formattedValue} />}
        primaryTypographyProps={{ variant: 'h6' }}
      />
      {canEditQualification(file, isReadOnly) && (
        <ListItemIcon>
          <Icon icon={RightIcon} color="var(--secondaryTextColor)" />
        </ListItemIcon>
      )}
    </ListItem>
  )
}

QualificationListItemQualification.displayName =
  'QualificationListItemQualification'

QualificationListItemQualification.propTypes = {
  file: PropTypes.object,
  onClick: PropTypes.func
}

export default QualificationListItemQualification
