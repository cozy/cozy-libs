import { models, useQuery, isQueryLoading } from 'cozy-client'

import { appsConn } from '../../connections/apps'

const { applications } = models

const useAppLinkWithStoreFallback = (slug, path = '') => {
  const res = useQuery(appsConn.query, appsConn)

  if (!isQueryLoading(res)) {
    const apps = res.data
    const appDocument = { slug }
    const appInstalled = applications.isInstalled(apps, appDocument)

    const url = appInstalled
      ? applications.getUrl(appInstalled) + path
      : applications.getStoreURL(apps, appDocument)

    return {
      fetchStatus: res.fetchStatus,
      isInstalled: !!appInstalled,
      url
    }
  }

  return {
    fetchStatus: 'loading',
    isInstalled: true,
    url: ''
  }
}

export default useAppLinkWithStoreFallback
