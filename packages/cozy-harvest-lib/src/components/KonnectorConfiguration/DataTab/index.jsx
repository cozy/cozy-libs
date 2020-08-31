import React from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'

import Stack from 'cozy-ui/transpiled/react/Stack'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import * as konnectorsModel from '../../../helpers/konnectors'
import KonnectorUpdateInfos from '../../../components/infos/KonnectorUpdateInfos'
import LaunchTriggerCard from '../../../components/cards/LaunchTriggerCard'
import KonnectorMaintenance from '../../../components/Maintenance'
import AppLinkCard from '../../../components/cards/AppLinkCard'
import WebsiteLinkCard from '../../../components/cards/WebsiteLinkCard'
import TriggerErrorInfo from '../../../components/infos/TriggerErrorInfo'
import useMaintenanceStatus from '../../../components/hooks/useMaintenanceStatus'
import getRelatedAppsSlugs from '../../../models/getRelatedAppsSlugs'
import appLinksProps from '../../../components/KonnectorConfiguration/DataTab/appLinksProps'
import tabSpecs from '../tabSpecs'

export const DataTab = ({ konnector, trigger, client, flow }) => {
  const { isMobile } = useBreakpoints()
  const flowState = flow.getState()
  const { error } = flowState
  const hasLoginError = hasError && error.isLoginError()
  const hasError = !!error

  const shouldDisplayError = tabSpecs.data.errorShouldBeDisplayed(
    error,
    flowState
  )
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
    .filter(app => client.appMetadata.slug !== app.slug)

  const {
    data: { isInMaintenance, messages: maintenanceMessages }
  } = useMaintenanceStatus(client, konnector)

  return (
    <ModalContent className={isMobile ? null : 'u-p-0'}>
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
        <LaunchTriggerCard flow={flow} disabled={isInMaintenance} />
        {appLinks.map(({ slug, ...otherProps }) => (
          <AppLinkCard key={slug} slug={slug} {...otherProps} />
        ))}
        {konnector.vendor_link && (
          <WebsiteLinkCard link={konnector.vendor_link} />
        )}
      </Stack>
    </ModalContent>
  )
}

DataTab.propTypes = {
  konnector: PropTypes.object.isRequired,
  trigger: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired
}

export default withClient(DataTab)
