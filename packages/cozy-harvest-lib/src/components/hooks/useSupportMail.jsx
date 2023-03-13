import { useState, useEffect } from 'react'

import { fetchSupportMail } from '../../helpers/konnectors'

const useSupportMail = client => {
  const [fetchStatus, setFetchStatus] = useState('loading')
  const [supportMail, setSupportMail] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const supportMail = await fetchSupportMail(client)
        setSupportMail(supportMail)
        setFetchStatus('loaded')
      } catch {
        setFetchStatus('errored')
      }
    }
    load()
  }, [client])

  return {
    fetchStatus,
    supportMail
  }
}

export default useSupportMail
