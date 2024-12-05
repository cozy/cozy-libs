import React from 'react'

import { useClient, useQuery, hasQueryBeenLoaded } from 'cozy-client'

import MemberRecipientLite from './MemberRecipientLite'
import withLocales from '../../hoc/withLocales'
import { buildInstanceSettingsQuery } from '../../queries/queries'

const OwnerRecipientDefaultLite = () => {
  const client = useClient()

  const instanceSettingsQuery = buildInstanceSettingsQuery()
  const instanceSettingsResult = useQuery(
    instanceSettingsQuery.definition,
    instanceSettingsQuery.options
  )

  return (
    hasQueryBeenLoaded(instanceSettingsResult) && (
      <MemberRecipientLite
        recipient={{
          status: 'owner',
          instance: client.options.uri,
          public_name: instanceSettingsResult?.data?.attributes?.public_name
        }}
        isOwner={true}
      />
    )
  )
}

export default withLocales(OwnerRecipientDefaultLite)
