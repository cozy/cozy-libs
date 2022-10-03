/* eslint-disable no-console */
const {
  cloneApp,
  getAppDependencies,
  getPackagesToUpdate,
  updatePackages,
  removeTempFolder,
  getLibPackage,
  gitCheckout,
  gitCommit,
  moveToAppFolder,
  moveToLibFolder
} = require('./utils')

/**
 * @param {object} opts
 * @param {string} opts.appUrl
 * @param {string} opts.appName
 * @param {string} opts.libName
 * @param {string} opts.libVersion
 * @param {{ [packageName: string]: string }} opts.libPeerDeps
 * @returns
 */
const process = async ({
  appUrl,
  appName,
  libName,
  libVersion,
  libPeerDeps
}) => {
  try {
    await cloneApp(appUrl, appName)
    moveToAppFolder(appName)
    const appDeps = await getAppDependencies(appName)
    const packagesToUpdate = getPackagesToUpdate({
      libPeerDeps,
      libName,
      libVersion,
      appDeps
    })
    await updatePackages(packagesToUpdate)

    // Versionning
    await gitCheckout(appName)
    await gitCommit(appName)
    // TODO push / PR (see https://cli.github.com/)

    moveToLibFolder()
    return Promise.resolve(packagesToUpdate)
  } catch (error) {
    return Promise.reject({ appName, message: error.message })
  }
}

/**
 * @param {object} opts
 * @param {{ name: string, url, string }[]} opts.apps
 */
const main = async (opts = {}) => {
  try {
    const { apps } = opts
    await removeTempFolder()
    const {
      name: libName,
      version: libVersion,
      peerDependencies: libPeerDeps
    } = await getLibPackage()
    const promises = apps.map(({ url: appUrl, name: appName }) =>
      process({ appUrl, appName, libName, libVersion, libPeerDeps })
    )

    const resultPromises = await Promise.allSettled(promises)
    const promiseRejected = resultPromises.filter(
      res => res.status === 'rejected'
    )
    if (promiseRejected.length > 0) {
      for (const promise of promiseRejected) {
        // TODO Manage promise rejected
        console.log('loop : ', promise)
      }
    }
    await removeTempFolder()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message)
  }
}

const opts = {
  apps: [{ name: 'mespapiers', url: 'https://github.com/cozy/mespapiers.git' }]
}

main(opts)
