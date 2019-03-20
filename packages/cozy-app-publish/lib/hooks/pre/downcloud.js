#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const {
  getArchiveFileName,
  deleteArchive,
  createArchive,
  pushArchive
} = require('./helpers')

module.exports = async options => {
  if (!fs.existsSync(options.buildDir)) {
    console.error('↳ ❌  Build folder does not exist. Run `yarn build`.')
    throw new Error('Missing build folder')
  }

  const { appSlug } = options

  const archiveFileName = getArchiveFileName(appSlug)
  const archivePath = path.join(options.buildDir, archiveFileName)
  await deleteArchive(archivePath)
  await createArchive(archivePath)

  let downcloudOptions = options

  try {
    downcloudOptions = await pushArchive(archiveFileName, downcloudOptions)
  } catch (error) {
    console.error(`↳ ❌  Error while uploading: ${error.message}`)
    throw new Error('Downcloud publishing error')
  }

  return downcloudOptions
}
