const STORE_SLUG = 'store'

/**
 * Return Store URL where an app/konnector can be installed / updated
 * @param  {Array}  [appData=[]]   Apps data, as returned by endpoint /apps/ or
 * /konnectors/
 * @param  {Object} [app={}] KonnectorObject
 * @return {String}                URL as string
 */
export const getStoreUrltoInstallAnApp = (appData = [], app = {}) => {
  if (!app.slug) {
    throw new Error('Expected app / konnector with defined slug')
  }

  const storeApp = appData.find(
    app => app.attributes && app.attributes.slug === STORE_SLUG
  )
  if (!storeApp) return null

  const storeUrl = storeApp.links && storeApp.links.related

  if (!storeUrl) return null

  return `${storeUrl}#/discover/${app.slug}/install`
}

export default {
  getStoreUrltoInstallAnApp
}
