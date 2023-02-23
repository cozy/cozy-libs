import React from 'react'
import PropTypes from 'prop-types'

import { useQuery, isQueryLoading } from 'cozy-client'
import { LaunchTriggerCard } from 'cozy-harvest-lib'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import { buildTriggersQueryByConnectorSlug } from '../../helpers/queries'

const HarvestBanner = ({ connector, account }) => {
  const connectorSlug = connector?.slug

  const queryTriggers = buildTriggersQueryByConnectorSlug(
    connectorSlug,
    Boolean(connectorSlug) && Boolean(account)
  )
  const { data: triggers, ...triggersQueryLeft } = useQuery(
    queryTriggers.definition,
    queryTriggers.options
  )
  const isTriggersLoading = isQueryLoading(triggersQueryLeft)

  const trigger = triggers?.find(
    trigger => trigger.message.account === account?._id
  )

  if (!connector || !account || isTriggersLoading) {
    return null
  }

  return (
    <>
      <LaunchTriggerCard
        flowProps={{ initialTrigger: trigger, konnector: connector }}
        konnectorRoot={`harvest/${connectorSlug}`}
      />
      <Divider />
    </>
  )
}

HarvestBanner.propTypes = {
  connector: PropTypes.object,
  account: PropTypes.object
}

export default HarvestBanner
