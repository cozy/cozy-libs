import get from 'lodash/get'
import { useEffect, useState } from 'react'

import { useClient, Q } from 'cozy-client'

const TRIGGERS_DOCTYPE = 'io.cozy.triggers'
const KONNECTORS_DOCTYPE = 'io.cozy.konnectors'

export const useKonnectorWithTriggers = (slug, injectedKonnector) => {
  const client = useClient()
  const [isFetching, setIsFetching] = useState(true)
  const [triggers, setTriggers] = useState({ data: [] })
  const [konnector, setKonnector] = useState({})

  useEffect(() => {
    async function load() {
      if (injectedKonnector) {
        setKonnector(injectedKonnector)
        setTriggers(injectedKonnector.triggers)
      } else {
        const [konnector, triggers] = await Promise.all([
          getKonnector(client, slug),
          getTriggers(client, slug)
        ])
        setKonnector(konnector)
        setTriggers({ data: triggers })
      }
      setIsFetching(false)
    }

    load()
  }, [client, injectedKonnector, slug])

  useEffect(() => {
    const realtime = client.plugins.realtime
    realtime.subscribe('created', TRIGGERS_DOCTYPE, onTriggerCreated)
    function onTriggerCreated(trigger) {
      if (get(trigger, 'message.konnector') === slug) {
        setTriggers({ data: [...triggers.data, trigger] })
      }
    }
    return function cleanUp() {
      if (realtime) {
        realtime.unsubscribe('created', TRIGGERS_DOCTYPE, onTriggerCreated)
      }
    }
  }, [client, slug, triggers])

  const konnectorWithTriggers = {
    ...konnector,
    triggers
  }
  return {
    konnectorWithTriggers,
    fetching: isFetching,
    notFoundError: !isFetching && !konnector
  }
}

function isKonnectorTrigger(doc) {
  return (
    doc._type === TRIGGERS_DOCTYPE && !!doc.message && !!doc.message.konnector
  )
}

async function getKonnector(client, slug) {
  const result = await client.query(Q(KONNECTORS_DOCTYPE).where({ slug: slug }))
  return result.data[0]
}

async function getTriggers(client, slug) {
  const { data: allTriggers } = await client.query(
    Q(TRIGGERS_DOCTYPE).where({
      worker: {
        $in: ['client', 'konnector']
      }
    })
  )
  return allTriggers.filter(
    trigger =>
      isKonnectorTrigger(trigger) && get(trigger, 'message.konnector') === slug
  )
}
