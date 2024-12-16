import PropTypes from 'prop-types'
import React from 'react'

import { formatOtherMetadataValue } from 'cozy-client/dist/models/paper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import QualificationIconStack from 'cozy-ui/transpiled/react/QualificationIconStack'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { canEditQualification } from './helpers'

const QualificationListItemQualification = ({ file, onClick }) => {
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
      button={canEditQualification(file)}
      onClick={canEditQualification(file) ? onClick : undefined}
    >
      <ListItemIcon>
        <QualificationIconStack qualification={value} />
      </ListItemIcon>
      <ListItemText
        primary={<MidEllipsis text={formattedValue} />}
        primaryTypographyProps={{ variant: 'h6' }}
      />
      {canEditQualification(file) && (
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
