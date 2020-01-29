import React from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'

import Stack from 'cozy-ui/transpiled/react/Stack'
import get from 'lodash/get'
import has from 'lodash/has'

import * as konnectorsModel from '../../helpers/konnectors'
import KonnectorUpdateInfos from '../infos/KonnectorUpdateInfos'
import LaunchTriggerCard from '../cards/LaunchTriggerCard'
import KonnectorMaintenance from '../Maintenance'
import DocumentsLinkCard from '../cards/DocumentsLinkCard'
import TriggerErrorInfo from '../infos/TriggerErrorInfo'
import useMaintenanceStatus from '../hooks/useMaintenanceStatus'

const DataTab = ({
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
      {has(trigger, 'message.folder_to_save') && (
        <DocumentsLinkCard folderId={get(trigger, 'message.folder_to_save')} />
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
