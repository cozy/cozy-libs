import PropTypes from 'prop-types'
import React from 'react'

import { formatOtherMetadataValue } from 'cozy-client/dist/models/paper'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import QualificationIconStack from 'cozy-ui/transpiled/react/QualificationIconStack'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const QualificationListItemQualification = ({
  formattedMetadataQualification
}) => {
  const { lang } = useI18n()
  const { name, value } = formattedMetadataQualification

  if (!value) return null

  const formattedValue = formatOtherMetadataValue(value, {
    lang,
    name
  })

  return (
    <ListItem size="large" divider>
      <ListItemIcon>
        <QualificationIconStack qualification={value} />
      </ListItemIcon>
      <ListItemText
        primary={<MidEllipsis text={formattedValue} />}
        primaryTypographyProps={{ variant: 'h6' }}
      />
    </ListItem>
  )
}

QualificationListItemQualification.displayName =
  'QualificationListItemQualification'

QualificationListItemQualification.propTypes = {
  formattedMetadataQualification: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  })
}

export default QualificationListItemQualification
