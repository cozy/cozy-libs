#!/usr/bin/env node

const fs = require('fs-extra')
const tar = require('tar')
const { spawn } = require('child_process')
const path = require('path')

const BUILD_FOLDER = './build/'
const UPLOAD_DIR = 'www-upload/'
const USER = 'upload'
const HOST = 'downcloud.cozycloud.cc'
const HOST_STRING = `${USER}@${HOST}`

const launchCmd = (cmd, params, options) => {
  return new Promise((resolve, reject) => {
    const result = { stdout: [], stderr: [] }
    const cmdOptions = { encoding: 'utf8', ...options }
    const process = spawn(cmd, params, cmdOptions)
    process.stdout.on('data', data => result.stdout.push(data.toString()))
    process.stderr.on('data', data => result.stderr.push(data.toString()))
    process.on('error', err => reject(err))
    process.on('close', code => {
      result.code = code
      if (code === 0) {
        resolve(result.stdout.join(''))
      } else {
        reject(new Error(result.stderr.join('')))
      }
    })
  })
}

const deleteArchive = async filename => {
  try {
    await fs.remove(path.join(BUILD_FOLDER, filename))
  } catch (error) {
    console.error(`↳ ⚠️  Unable to delete the previous archive.`)
  }
}

const sshCommand = async (cmd, hostString) => {
  console.log('Launching', cmd, 'on', hostString)
  return launchCmd('ssh', ['-o', 'StrictHostKeyChecking=no', hostString, cmd])
}

const rsync = async (src, dest) => {
  return launchCmd(
    'rsync',
    [
      // to remove host validation question on CI
      '-e',
      'ssh -o StrictHostKeyChecking=no',
      '-a',
      src,
      `${HOST_STRING}:${dest}`
    ],
    { cwd: BUILD_FOLDER }
  )
}

const pushArchive = async (archiveFileName, options) => {
  const { appSlug, appVersion, buildCommit } = options
  console.log(`↳ ℹ️  Sending archive to downcloud`)
  const folder = `${appSlug}/${appVersion}${
    buildCommit ? `-${buildCommit}` : ''
  }/`

  const uploadDir = path.join(UPLOAD_DIR, folder)

  try {
    await sshCommand(`mkdir -p ${uploadDir}`, HOST_STRING)
  } catch (e) {
    throw new Error(
      `Unable to create target directory ${folder} on downcloud server : ${
        e.message
      }`
    )
  }

  await rsync(archiveFileName, uploadDir)

  console.log(`↳ ℹ️  Upload to downcloud complete.`)
  return {
    ...options,
    appBuildUrl: `https://${HOST}/upload/${folder}${archiveFileName}`
  }
}

const getArchiveFileName = slug => {
  return `${slug}.tar.gz`
}

const createArchive = async archiveFileName => {
  console.log(`↳ ℹ️  Creating archive ${archiveFileName}`)
  const fileList = await fs.readdir(BUILD_FOLDER)
  const options = {
    gzip: true,
    cwd: BUILD_FOLDER,
    file: path.join(BUILD_FOLDER, archiveFileName)
  }
  try {
    await tar.c(options, fileList)
  } catch (error) {
    console.error(
      `↳ ❌ Unable to generate app archive. Is tar installed as a dependency ? Error : ${
        error.message
      }`
    )
    throw new Error('Unable to generate archive')
  }
}

module.exports = async options => {
  if (!fs.existsSync(BUILD_FOLDER)) {
    console.error('↳ ❌  Build folder does not exist. Run `yarn build`.')
    throw new Error('Missing build folder')
  }

  const { appSlug } = options

  const archiveFileName = getArchiveFileName(appSlug)
  await deleteArchive(archiveFileName)
  await createArchive(archiveFileName)

  let downcloudOptions = options

  try {
    downcloudOptions = await pushArchive(archiveFileName, downcloudOptions)
  } catch (error) {
    console.error(`↳ ❌  Error while uploading: ${error.message}`)
    throw new Error('Downcloud publishing error')
  }

  return downcloudOptions
}
