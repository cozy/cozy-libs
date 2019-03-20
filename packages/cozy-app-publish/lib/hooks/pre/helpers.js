const tar = require('tar')
const { spawn } = require('child_process')
const fs = require('fs-extra')
const path = require('path')

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

const deleteArchive = async archivePath => {
  try {
    await fs.remove(archivePath)
  } catch (error) {
    console.error(`↳ ⚠️  Unable to delete the previous archive.`)
  }
}

const sshCommand = async (cmd, hostString) => {
  console.log('Launching', cmd, 'on', hostString)
  return launchCmd('ssh', ['-o', 'StrictHostKeyChecking=no', hostString, cmd])
}

const rsync = async (src, dest, opts) => {
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
    opts
  )
}

const pushArchive = async (archiveFileName, options) => {
  const { appSlug, appVersion, buildCommit, buildDir } = options
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

  await rsync(archiveFileName, uploadDir, { cwd: buildDir })

  console.log(`↳ ℹ️  Upload to downcloud complete.`)
  return {
    ...options,
    appBuildUrl: `https://${HOST}/upload/${folder}${archiveFileName}`
  }
}

const getArchiveFileName = slug => {
  return `${slug}.tar.gz`
}

const createArchive = async archivePath => {
  console.log(`↳ ℹ️  Creating archive ${archivePath}`)
  const cwd = path.resolve(path.dirname(archivePath))
  const fileList = await fs.readdir(path.dirname(archivePath))
  const options = {
    gzip: true,
    cwd,
    file: archivePath
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

module.exports = {
  deleteArchive,
  createArchive,
  getArchiveFileName,
  pushArchive,
  sshCommand,
  rsync
}
