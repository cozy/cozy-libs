/* eslint-disable no-console */
const { satisfies } = require('compare-versions')
const { resolve } = require('path')
const { promisify } = require('util')
const { exec } = require('child_process')
const execPromise = promisify(exec)
const {
  promises: { readFile }
} = require('fs')
const tempFolderName = 'temp'

// TODO
/*
  Improve DX with chalk & ora packages
  In makeUpdatePackagesCommand, For each package to upgrade, create a line in the logs
    ex: "Upgrade <pck>@<newVersion> (old: <oldVersion>)"
*/

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
const getFileContent = path => {
  return readFile(resolve(path), { encoding: 'utf8' })
}

/**
 * @param {string} dependencie
 * @returns {string}
 */
const getNormalizedDep = dependency => {
  return dependency.replace(/[\^|>|<|=]/g, '')
}

/**
 * @param {string} name
 * @returns {boolean}
 */
const isCozyPackage = name => {
  return name.match(/cozy-/)
}

/**
 * @param {string} appName
 */
const moveToAppFolder = appName => {
  process.chdir(resolve(tempFolderName, appName))
}

const moveToLibFolder = () => {
  process.chdir(resolve(__dirname, '..'))
}

/**
 * @param {{ name: string, appDepVersion: string, requiredDepVersion: string, needUpdate: boolean }[]} packagesToUpdate
 * @returns {string}
 */
const makeUpdatePackagesCommand = packagesToUpdate => {
  const packageWithVersion = packagesToUpdate.map(pck => {
    const { name, requiredDepVersion } = pck
    const requiredDepVersionNormalized = getNormalizedDep(requiredDepVersion)
    return `${name}@${
      isCozyPackage(name) ? '^' : ''
    }${requiredDepVersionNormalized}`
  })
  console.log(`Upgrade packages ${packageWithVersion.join(', ')}.`)
  return `yarn upgrade ${packageWithVersion.join(' ')}`
}

/**
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
const removeTempFolder = async () => {
  console.log(`Remove ${tempFolderName} folder...`)
  return execPromise(`rm -rf ${tempFolderName}`)
}

/**
 * @returns {Promise<{ name: string, version: string, peerDependencies: { [packageName: string]: string } }>}
 */
const getLibPackage = async () => {
  console.log(`Get package.json of cozy-mespapiers-lib...`)
  const packageContent = await getFileContent('package.json')
  return JSON.parse(packageContent)
}

/**
 * @param {string} appURL
 * @param {string} appName
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
const cloneApp = async (appURL, appName) => {
  console.log(`Cloning ${appName} app...`)
  return execPromise(`git clone ${appURL} ${tempFolderName}/${appName}`)
}

/**
 * @param {string} appName
 * @returns {Promise<{ [packageName: string]: string }>}
 */
const getAppDependencies = async appName => {
  console.log(`Get dependencies of the ${appName} app...`)
  const packageContent = await getFileContent('package.json')
  return JSON.parse(packageContent).dependencies
}

/**
 * Get all the packages that need to be updated on the app
 * (cozy-mypapers-lib included)
 * @param {{ [packageName: string]: string }} libPeerDeps
 * @param {{ [packageName: string]: string }} appDeps
 * @returns {{ name: string, appDepVersion: string, requiredDepVersion: string, needUpdate: boolean }[]}
 */
const getPackagesToUpdate = ({ libPeerDeps, libName, libVersion, appDeps }) => {
  console.log('Get package to update...')
  const requiredDeps = { ...libPeerDeps, [libName]: libVersion }
  return Object.entries(requiredDeps)
    .map(([requiredDepName, requiredDepVersion]) => {
      const appDepVersion = appDeps[requiredDepName]
      const needUpdate = appDepVersion
        ? !satisfies(appDepVersion, requiredDepVersion)
        : true

      return (
        needUpdate && {
          name: requiredDepName,
          appDepVersion,
          requiredDepVersion,
          needUpdate
        }
      )
    })
    .filter(Boolean)
}

/**
 * @param {{ name: string, appDepVersion: string, requiredDepVersion: string, needUpdate: boolean }[]} packagesToUpdate
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
const updatePackages = async packagesToUpdate => {
  const updatePackagesCommand = makeUpdatePackagesCommand(packagesToUpdate)
  return execPromise(updatePackagesCommand)
}

/**
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
const gitCheckout = async () => {
  console.log(`git checkout...`)
  return execPromise(`git checkout -b feat/Update-cozy-packages_${Date.now()}`)
}

/**
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
const gitCommit = async () => {
  console.log(`git commit...`)
  return execPromise(`git commit -a -m $'feat: Title TODO\n\nBody TODO...'`)
}

module.exports = {
  isCozyPackage,
  getNormalizedDep,
  makeUpdatePackagesCommand,

  moveToAppFolder,
  moveToLibFolder,
  removeTempFolder,
  getLibPackage,
  cloneApp,
  getAppDependencies,
  getPackagesToUpdate,
  updatePackages,
  gitCheckout,
  gitCommit
}
