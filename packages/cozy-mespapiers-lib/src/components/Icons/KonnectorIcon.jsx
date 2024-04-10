import PropTypes from 'prop-types'
import React from 'react'

import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Icon from 'cozy-ui/transpiled/react/Icon'

import KonnectorEnergy from '../../assets/icons/Energy.svg'
import Konnectors from '../../assets/icons/Konnectors.svg'
import KonnectorPayslip from '../../assets/icons/Payslip.svg'
import KonnectorTelecom from '../../assets/icons/Telecom.svg'

export const KonnectorIcon = ({ konnectorCriteria, ...props }) => {
  if (konnectorCriteria.name) {
    return (
      <AppIcon
        app={{ slug: konnectorCriteria.name }}
        priority="registry"
        type="konnector"
        {...props}
      />
    )
  }

  const categoryOrQualificationLabel =
    konnectorCriteria.category || konnectorCriteria.qualificationLabel

  switch (categoryOrQualificationLabel) {
    case 'telecom':
    case 'isp':
      return <Icon icon={KonnectorTelecom} {...props} />

    case 'energy':
      return <Icon icon={KonnectorEnergy} {...props} />

    case 'pay-sheet':
      return <Icon icon={KonnectorPayslip} {...props} />

    default:
      return <Icon icon={Konnectors} {...props} />
  }
}

KonnectorIcon.prototype = {
  konnectorCriteria: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    qualificationLabel: PropTypes.string
  }).isRequired
}
