import { useState, useEffect } from 'react'

import { fetchFilesPaths } from '../helpers/files'

export const useFetchDocumentPath = (client, document) => {
  const [documentPath, setDocumentPath] = useState(
    document.path ? document.path : null
  )
  useEffect(() => {
    ;(async () => {
      try {
        const path = await fetchFilesPaths(client, document._type, [document])
        setDocumentPath(path[0])
        // eslint-disable-next-line
      } catch {}
    })()
  }, [client, document])
  return documentPath
}
