import React from 'react'
import { useQuery, isQueryLoading } from 'cozy-client'
import { LaunchTriggerCard } from 'cozy-harvest-lib'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import {
  buildTriggersQueryByConnectorSlug,
  buildConnectorsQueryById,
  buildAccountsQueryByLoginAndSlug
} from '../../helpers/queries'

const HarvestBanner = ({ papers }) => {
  const {
    createdByApp: connectorSlug,
    sourceAccountIdentifier: connectorAccountIdentifier
  } = papers?.list?.[0]?.cozyMetadata || {}

  const queryAccounts = buildAccountsQueryByLoginAndSlug({
    login: connectorAccountIdentifier,
    slug: connectorSlug,
    enabled: Boolean(connectorSlug)
  })
  const { data: accounts, ...accountsQueryLeft } = useQuery(
    queryAccounts.definition,
    queryAccounts.options
  )
  const isAccountsLoading = isQueryLoading(accountsQueryLeft)
  const account = accounts?.[0]

  const queryTriggers = buildTriggersQueryByConnectorSlug(
    connectorSlug,
    Boolean(connectorSlug)
  )
  const { data: triggers, ...triggersQueryLeft } = useQuery(
    queryTriggers.definition,
    queryTriggers.options
  )
  const isTriggersLoading = isQueryLoading(triggersQueryLeft)
  const trigger = triggers?.find(
    trigger => trigger.message.account === account?._id
  )

  const queryKonnector = buildConnectorsQueryById(
    `io.cozy.konnectors/${connectorSlug}`
  )
  const { data: konnectors, ...konnectorsQueryLeft } = useQuery(
    queryKonnector.definition,
    queryKonnector.options
  )
  const isKonnectorsLoading = isQueryLoading(konnectorsQueryLeft)
  const konnector = konnectors?.[0]

  if (
    !konnector ||
    isAccountsLoading ||
    isTriggersLoading ||
    isKonnectorsLoading
  )
    return null

  return (
    <>
      <LaunchTriggerCard
        flowProps={{ initialTrigger: trigger, konnector }}
        konnectorRoot={`harvest/${connectorSlug}`}
      />
      <Divider />
    </>
  )
}

export default HarvestBanner
