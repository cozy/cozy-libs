import fs from 'fs'
import path from 'path'

/**
 * Retrieves the entries for services target in the specified application path.
 *
 * This function reads the contents of the 'src/targets/services' directory within the given application path,
 * filters for JavaScript (.js) and TypeScript (.ts) files, and returns an object mapping each service name
 * (derived from the file name) to its relative path.
 *
 * Example:
 * ```
 * {
 *   service1: 'src/targets/services/service1.js',
 *   service2: 'src/targets/services/service2.ts'
 * }
 * ```
 * @param {string} appPath - The root path of the application.
 * @returns {Object} An object where the keys are service names and the values are the relative paths to the service files.
 */
export const getServicesEntries = appPath => {
  const servicesDir = path.resolve(appPath, 'src', 'targets', 'services')

  return fs
    .readdirSync(servicesDir)
    .filter(file => file.endsWith('.js') || file.endsWith('.ts'))
    .reduce(
      (current, file) => ({
        ...current,
        [file.slice(0, -3)]: `./src/targets/services/${file}`
      }),
      {}
    )
}
