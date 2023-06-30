import PropTypes from 'prop-types'
import React from 'react'

import { useQuery, isQueryLoading } from 'cozy-client'
import { LaunchTriggerCard } from 'cozy-harvest-lib'
import Divider from 'cozy-ui/transpiled/react/Divider'

import { buildTriggersQueryByKonnectorSlug } from '../../helpers/queries'

const HarvestBanner = ({ konnector, account }) => {
  const konnectorSlug = konnector?.slug

  const queryTriggers = buildTriggersQueryByKonnectorSlug(
    konnectorSlug,
    Boolean(konnectorSlug)
  )
  const { data: triggers, ...triggersQueryLeft } = useQuery(
    queryTriggers.definition,
    queryTriggers.options
  )
  const isTriggersLoading = isQueryLoading(triggersQueryLeft)

  const trigger = triggers?.find(
    trigger => trigger.message.account === account?._id
  )

  if (!konnector || isTriggersLoading) {
    return null
  }

  return (
    <>
      <LaunchTriggerCard
        flowProps={{ initialTrigger: trigger, konnector }}
        konnectorRoot={`harvest/${konnectorSlug}`}
      />
      <Divider />
    </>
  )
}

HarvestBanner.propTypes = {
  konnector: PropTypes.object,
  account: PropTypes.object
}

export default HarvestBanner
