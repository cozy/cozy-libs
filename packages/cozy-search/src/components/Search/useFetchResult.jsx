import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { useDataProxy } from 'cozy-dataproxy-lib'
import Minilog from 'cozy-minilog'

import { getIconForSearchResult } from './getIconForSearchResult'

const log = Minilog('🔍 [useFetchResult]')

const searchWithRetry = async (
  dataProxy,
  searchValue,
  { maxRetries = 5, delay = 500 } = {}
) => {
  let currentDelay = delay
  // Make several search attemps in case it is not ready yet
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const searchResults = await dataProxy.search(searchValue)

    if (searchResults) {
      // A successful search will return an array, and null otherwise
      return searchResults
    }
    log.info(
      `Search attempt ${attempt + 1} failed, retrying in ${currentDelay} ms...`
    )
    await new Promise(resolve => setTimeout(resolve, currentDelay))
    currentDelay *= 2 // Exponential backoff
  }

  log.error(`Search failed after ${maxRetries} attempts`)
  return []
}

export const useFetchResult = searchValue => {
  const client = useClient()
  const navigate = useNavigate()
  const [state, setState] = useState({
    isLoading: true,
    results: null,
    searchValue: null
  })
  const dataProxy = useDataProxy()

  useEffect(() => {
    const fetch = async searchValue => {
      if (!dataProxy.dataProxyServicesAvailable) {
        log.log('DataProxy services are not available. Skipping search...')
        return
      }

      setState({ isLoading: true, results: null, searchValue })

      const searchResults = await searchWithRetry(dataProxy, searchValue)

      const results = searchResults.map(r => {
        // Begin Retrocompatibility code, to be removed when following PR is merged: https://github.com/cozy/cozy-web-data-proxy/pull/10
        r.slug = r.slug || r.type
        r.subTitle = r.subTitle || r.name
        // End Retrocompatibility code
        const icon = getIconForSearchResult(r)
        return {
          id: r.doc._id,
          icon: icon,
          slug: r.slug,
          secondaryUrl: r.secondaryUrl,
          primary: r.title,
          secondary: r.subTitle,
          onClick: () => {
            if (r.slug === client.appMetadata.slug) {
              try {
                const url = new URL(r.url)
                const hash = url.hash.replace('#', '')
                navigate(hash)
              } catch {
                window.open(r.url)
              }
            } else {
              window.open(r.url)
            }
          }
        }
      })

      setState({ isLoading: false, results, searchValue })
    }

    if (searchValue) {
      if (searchValue !== state.searchValue) {
        fetch(searchValue)
      }
    } else {
      setState({ isLoading: true, results: null, searchValue: null })
    }
  }, [dataProxy, searchValue, state.searchValue, setState])

  return {
    isLoading: state.isLoading,
    results: state.results
  }
}
