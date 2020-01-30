import React from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'

import Stack from 'cozy-ui/transpiled/react/Stack'
import get from 'lodash/get'

import * as konnectorsModel from '../../helpers/konnectors'
import KonnectorUpdateInfos from '../infos/KonnectorUpdateInfos'
import LaunchTriggerCard from '../cards/LaunchTriggerCard'
import KonnectorMaintenance from '../Maintenance'
import AppLinkCard from '../cards/AppLinkCard'
import TriggerErrorInfo from '../infos/TriggerErrorInfo'
import useMaintenanceStatus from '../hooks/useMaintenanceStatus'

export const DataTab = ({
  konnector,
  trigger,
  error,
  shouldDisplayError,
  hasLoginError,
  client
}) => {
  const hasError = !!error
  const hasTermsVersionMismatchError =
    hasError && error.isTermsVersionMismatchError()
  const isTermsVersionMismatchErrorWithVersionAvailable =
    hasTermsVersionMismatchError &&
    konnectorsModel.hasNewVersionAvailable(konnector)
  const hasGenericError =
    hasError &&
    !hasLoginError &&
    !isTermsVersionMismatchErrorWithVersionAvailable

  const folderToSaveId = get(trigger, 'message.folder_to_save')
  const showBanksLink = get(konnector, 'data_types', []).includes(
    'bankAccounts'
  )
  const showContactsLink = get(konnector, 'data_types', []).includes('contact')

  const {
    data: { isInMaintenance, messages: maintenanceMessages }
  } = useMaintenanceStatus(client, konnector)

  return (
    <Stack>
      {isInMaintenance && (
        <div className="u-bg-paleGrey u-p-1">
          <KonnectorMaintenance maintenanceMessages={maintenanceMessages} />
        </div>
      )}
      {konnectorsModel.hasNewVersionAvailable(konnector) && (
        <KonnectorUpdateInfos
          konnector={konnector}
          isBlocking={hasTermsVersionMismatchError}
        />
      )}
      {shouldDisplayError && hasGenericError && (
        <TriggerErrorInfo error={error} konnector={konnector} />
      )}
      <LaunchTriggerCard initialTrigger={trigger} disabled={isInMaintenance} />
      {folderToSaveId && (
        <AppLinkCard
          slug="drive"
          path={`/files/${folderToSaveId}`}
          icon="file"
          iconColor="puertoRico"
        />
      )}
      {showBanksLink && (
        <AppLinkCard slug="banks" icon="bank" iconColor="weirdGreen" />
      )}
      {showContactsLink && (
        <AppLinkCard slug="contacts" icon="team" iconColor="brightSun" />
      )}
    </Stack>
  )
}

DataTab.propTypes = {
  konnector: PropTypes.object.isRequired,
  trigger: PropTypes.object.isRequired,
  error: PropTypes.object,
  shouldDisplayError: PropTypes.bool.isRequired,
  hasLoginError: PropTypes.bool.isRequired,
  client: PropTypes.object.isRequired
}

export default withClient(DataTab)
