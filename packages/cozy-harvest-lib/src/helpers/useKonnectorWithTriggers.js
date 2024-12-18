import get from 'lodash/get'
import { useEffect, useState } from 'react'

import { useClient, Q } from 'cozy-client'

const TRIGGERS_DOCTYPE = 'io.cozy.triggers'
const KONNECTORS_DOCTYPE = 'io.cozy.konnectors'

export const useKonnectorWithTriggers = (slug, injectedKonnector) => {
  const client = useClient()
  const [isFetchingKonnector, setIsFetchingKonnector] = useState(true)
  const [isFetchingTriggers, setIsFetchingTriggers] = useState(true)
  const [triggers, setTriggers] = useState({ data: [] })
  const [konnector, setKonnector] = useState({})

  useEffect(() => {
    async function _getKonnector() {
      // need to do getKonnector anyway to force the update of the konnector to be
      // sure to have updated konnector fields
      const konnector = await getKonnector(client, slug)
      setKonnector(konnector)
      setIsFetchingKonnector(false)
    }

    _getKonnector()
  }, [client, slug])

  useEffect(() => {
    async function _getTriggers() {
      if (injectedKonnector) {
        setTriggers(injectedKonnector.triggers)
      } else {
        const triggers = await getTriggers(client, slug)
        setTriggers({ data: triggers })
      }
      setIsFetchingTriggers(false)
    }

    _getTriggers()
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
    fetching: isFetchingKonnector || isFetchingTriggers,
    notFoundError: !(isFetchingKonnector || isFetchingTriggers) && !konnector
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
