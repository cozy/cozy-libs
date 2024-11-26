import React from 'react'

import { useQuery, isQueryLoading } from 'cozy-client'

import ChatConversation from './ChatConversation'
import { buildMyselfQuery } from '../queries'

const Conversation = ({ id }) => {
  const myselfQuery = buildMyselfQuery()
  const { data: myselves, ...queryMyselfResult } = useQuery(
    myselfQuery.definition,
    myselfQuery.options
  )

  const isLoading = isQueryLoading(queryMyselfResult)

  if (isLoading) return null

  return (
    <div className="u-maw-7 u-mh-auto">
      <ChatConversation id={id} myself={myselves[0]} />
    </div>
  )
}

export default Conversation
