const STORE_SLUG = 'store'

/**
 * Return Store URL where a konnector can be updated
 * @param  {Array}  [appData=[]]   Apps data, as returned by endpoint /apps/ or
 * /konnectors/
 * @param  {Object} [konnector={}] KonnectorObject
 * @return {String}                URL as string
 */
export const getStoreUrltoUpdateKonnector = (appData = [], konnector = {}) => {
  if (!konnector.slug) {
    throw new Error('Expected Konnector with defined slug')
  }

  const storeApp = appData.find(
    app => app.attributes && app.attributes.slug === STORE_SLUG
  )
  if (!storeApp) return null

  const storeUrl = storeApp.links && storeApp.links.related

  if (!storeUrl) return null

  return `${storeUrl}#/discover/${konnector.slug}/install`
}

export default {
  getStoreUrltoUpdateKonnector
}
