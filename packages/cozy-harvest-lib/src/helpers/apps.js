const STORE_SLUG = 'store'

/**
 * Return Store URL where an app/konnector can be installed / updated
 * @param  {Array}  [appData=[]]   Apps data, as returned by endpoint /apps/ or
 * /konnectors/
 * @param  {Object} [app={}] AppObject
 * @return {String}                URL as string
 */
export const getStoreUrltoInstallAnApp = (appData = [], app = {}) => {
  if (!app.slug) {
    throw new Error('Expected app / konnector with defined slug')
  }

  const storeApp = isAppInstalled(appData, { slug: STORE_SLUG })
  if (!storeApp) return null

  const storeUrl = storeApp.links && storeApp.links.related

  if (!storeUrl) return null

  return `${storeUrl}#/discover/${app.slug}/install`
}

/**
 *
 * @param {Array} apps Array of apps returned by /apps /konnectors
 * @param {Object} wantedApp io.cozy.app with at least a slug
 * @return {Object} The io.cozy.app is installed or undefined if not
 */
export const isAppInstalled = (apps = [], wantedApp = {}) => {
  return apps.find(
    app => app.attributes && app.attributes.slug === wantedApp.slug
  )
}
/**
 *
 * @param {Object} app io.cozy.app object
 * @return {String} url to the app
 */
export const getUrlForApp = app => {
  return app.links && app.links.related
}
export default {
  getStoreUrltoInstallAnApp
}
