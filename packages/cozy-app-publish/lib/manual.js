const path = require('path')
const fs = require('fs-extra')
const getManifestAsObject = require('../utils/getManifestAsObject')
const tags = require('./tags')
const publisher = require('./publisher')

const getManifestManual = ctx => {
  return getManifestAsObject(
    path.join(fs.realpathSync(process.cwd()), ctx.buildDir)
  )
}

const getAppVersionManual = async ctx => {
  let autoVersion
  if (!ctx.manualVersion) {
    autoVersion = await tags.getAutoVersion()
  }
  return autoVersion || ctx.manualVersion || ctx.appManifestObj.version
}

const manualPublish = publisher({
  getManifest: getManifestManual,
  getAppVersion: getAppVersionManual,
  showConfirmation: true
})

const manualPublishCLI = function() {
  return manualPublish.apply(this, arguments).catch(e => {
    console.error(e)
    console.error(e.message)
    process.exit(1)
  })
}

manualPublishCLI.manualPublish = manualPublish

module.exports = manualPublishCLI
