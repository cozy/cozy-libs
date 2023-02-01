import { useState } from 'react'

import { fetchSupportMail } from '../../helpers/konnectors'

const useSupportMail = client => {
  const [fetchStatus, setFetchStatus] = useState('loading')
  const [supportMail, setSupportMail] = useState(null)

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

  return {
    fetchStatus,
    supportMail
  }
}

export default useSupportMail
