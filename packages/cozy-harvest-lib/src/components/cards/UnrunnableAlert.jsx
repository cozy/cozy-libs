import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import InfoIcon from 'cozy-ui/transpiled/react/Icons/Info'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { TriggerAlertTemplate } from './TriggerAlertTemplate'

/**
 * This component warns the user that the connector is not executable on their device.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.konnectorName - The name of the konnector.
 * @param {string} props.className - The class name.
 * @param {boolean} props.withoutIcon - Whether to display the icon.
 * @returns {JSX.Element} The rendered UnrunnableAlert component.
 */
function UnrunnableAlert({
  konnectorName,
  className,
  withoutIcon = false
} = {}) {
  const { t } = useI18n()
  return (
    <TriggerAlertTemplate
      color="var(--grey100)"
      icon={
        withoutIcon ? (
          false
        ) : (
          <Icon icon={InfoIcon} color="var(--iconTextColor)" />
        )
      }
      label={t('accountForm.notClientSide', { name: konnectorName })}
      className={className}
    />
  )
}

UnrunnableAlert.propTypes = {
  konnectorName: PropTypes.string.isRequired,
  className: PropTypes.string,
  withoutIcon: PropTypes.bool
}

export { UnrunnableAlert }
