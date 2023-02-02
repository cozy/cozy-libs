import React from 'react'
import { useQuery } from 'cozy-client'
import { LaunchTriggerCard } from 'cozy-harvest-lib'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import {
  buildTriggersQueryByConnectorSlug,
  buildConnectorsQueryById
} from '../../helpers/queries'

const HarvestBanner = ({ papers }) => {
  const { createdByApp: connectorSlug, sourceAccount: connectorAccount } =
    papers?.list?.[0]?.cozyMetadata || {}
  const queryTriggers = buildTriggersQueryByConnectorSlug(
    connectorSlug,
    Boolean(connectorSlug)
  )
  const { data: triggers } = useQuery(
    queryTriggers.definition,
    queryTriggers.options
  )
  const trigger = triggers?.find(
    trigger => trigger.message.account === connectorAccount
  )

  const queryKonnector = buildConnectorsQueryById(
    `io.cozy.konnectors/${connectorSlug}`,
    Boolean(trigger)
  )

  const { data: konnectors } = useQuery(
    queryKonnector.definition,
    queryKonnector.options
  )
  const konnector = konnectors?.[0]

  if (!konnector) return null

  return (
    <>
      <LaunchTriggerCard
        flowProps={{ initialTrigger: trigger, konnector }}
        konnectorRoot={`harvest/${connectorSlug}/accounts/${connectorAccount}`}
      />
      <Divider />
    </>
  )
}

export default HarvestBanner
