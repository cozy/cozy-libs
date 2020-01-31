import React from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'

import Stack from 'cozy-ui/transpiled/react/Stack'

import * as konnectorsModel from '../../../helpers/konnectors'
import KonnectorUpdateInfos from '../../../components/infos/KonnectorUpdateInfos'
import LaunchTriggerCard from '../../../components/cards/LaunchTriggerCard'
import KonnectorMaintenance from '../../../components/Maintenance'
import AppLinkCard from '../../../components/cards/AppLinkCard'
import TriggerErrorInfo from '../../../components/infos/TriggerErrorInfo'
import useMaintenanceStatus from '../../../components/hooks/useMaintenanceStatus'
import getRelatedAppsSlugs from '../../../models/getRelatedAppsSlugs'
import appLinksProps from '../../../components/KonnectorConfiguration/DataTab/appLinksProps'

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

  const appLinks = getRelatedAppsSlugs({
    konnectorManifest: konnector,
    trigger
  })
    .map(slug => appLinksProps[slug] && appLinksProps[slug]({ trigger }))
    .filter(Boolean)

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
      {appLinks.map(({ slug, ...otherProps }) => (
        <AppLinkCard key={slug} slug={slug} {...otherProps} />
      ))}
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
