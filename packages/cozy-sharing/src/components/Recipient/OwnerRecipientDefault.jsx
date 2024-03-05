import React from 'react'

import { useClient, useQuery, hasQueryBeenLoaded } from 'cozy-client'

import MemberRecipient from './MemberRecipient'
import { buildInstanceSettingsQuery } from '../../queries/queries'

const OwnerRecipientDefault = () => {
  const client = useClient()

  const instanceSettingsQuery = buildInstanceSettingsQuery()
  const instanceSettingsResult = useQuery(
    instanceSettingsQuery.definition,
    instanceSettingsQuery.options
  )

  return (
    hasQueryBeenLoaded(instanceSettingsResult) && (
      <MemberRecipient
        isOwner={true}
        status="owner"
        instance={client.options.uri}
        public_name={instanceSettingsResult?.data?.attributes?.public_name}
      />
    )
  )
}

export default OwnerRecipientDefault
