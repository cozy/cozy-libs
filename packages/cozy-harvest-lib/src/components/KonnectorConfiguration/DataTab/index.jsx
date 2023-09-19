import PropTypes from 'prop-types'
import React from 'react'

import { withClient } from 'cozy-client'
import flag from 'cozy-flags'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Stack from 'cozy-ui/transpiled/react/Stack'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import appLinksProps from '../../../components/KonnectorConfiguration/DataTab/appLinksProps'
import KonnectorMaintenance from '../../../components/Maintenance'
import AppLinkCard from '../../../components/cards/AppLinkCard'
import { InformationsCard } from '../../../components/cards/InformationsCard'
import LaunchTriggerCard from '../../../components/cards/LaunchTriggerCard'
import { useTrackPage } from '../../../components/hoc/tracking'
import useMaintenanceStatus from '../../../components/hooks/useMaintenanceStatus'
import KonnectorUpdateInfos from '../../../components/infos/KonnectorUpdateInfos'
import * as konnectorsModel from '../../../helpers/konnectors'
import { intentsApiProptype } from '../../../helpers/proptypes'
import getRelatedAppsSlugs from '../../../models/getRelatedAppsSlugs'
import Datacards from '../../Datacards'

const styles = {
  divider: {
    height: '12px',
    backgroundColor: 'var(--defaultBackgroundColor)'
  }
}

export const DataTab = ({
  konnector,
  konnectorRoot,
  trigger,
  client,
  flow,
  intentsApi,
  account
}) => {
  const { isMobile } = useBreakpoints()
  const flowState = flow.getState()
  const { error } = flowState

  useTrackPage('donnees')

  const hasTermsVersionMismatchError =
    !!error && error.isTermsVersionMismatchError()
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
    <div>
      {flag('harvest.inappconnectors.enabled') && (
        <>
          <LaunchTriggerCard
            konnectorRoot={konnectorRoot}
            flow={flow}
            intentsApi={intentsApi}
            account={account}
            withMaintenanceDescription
          />
          {isMobile && <Divider style={styles.divider} />}
        </>
      )}
      <div className={isMobile ? 'u-p-1' : 'u-pt-1 u-pb-1-half'}>
        <Stack>
          {!flag('harvest.inappconnectors.enabled') && isInMaintenance && (
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
          {!flag('harvest.inappconnectors.enabled') && (
            <LaunchTriggerCard flow={flow} disabled={isInMaintenance} />
          )}
          {appLinks.map(({ slug, ...otherProps }) => (
            <AppLinkCard key={slug} slug={slug} {...otherProps} />
          ))}
          <Datacards
            account={account}
            trigger={trigger}
            konnector={konnector}
          />
          {konnector.vendor_link && (
            <InformationsCard link={konnector.vendor_link} />
          )}
        </Stack>
      </div>
    </div>
  )
}

DataTab.propTypes = {
  konnector: PropTypes.object.isRequired,
  konnectorRoot: PropTypes.string,
  trigger: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  flow: PropTypes.object,
  intentsApi: intentsApiProptype,
  account: PropTypes.object
}

DataTab.displayName = 'DataTab'

export default withClient(DataTab)
