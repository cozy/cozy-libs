const FILES_DOCTYPE = 'io.cozy.files'

/**
 * Add references to given files into given documents
 * @param  {Object}  client    CozyClient
 * @param  {Object}  document  Target document
 * @param  {[type]}  files     Files to reference
 * @return {Object}           Updated document
 */
export const addReferencesTo = async (client, document, files) => {
  const { data } = await client
    .collection(FILES_DOCTYPE)
    .addReferencesTo(document, files)
  return data
}

/**
 * Creates a directory from a given path
 * @param  {Object}  client CozyClient
 * @param  {string}  path   Directory path
 * @return {Object}         Directory attributes
 */
export const createDirectoryByPath = async (client, path) => {
  const { data } = await client
    .collection(FILES_DOCTYPE)
    .createDirectoryByPath(path)
  return data
}

/**
 * Retrieves a directory from its path
 * @param  {Object}  client CozyClient
 * @param  {string}  path   Directory path
 * @return {Object}        Created io.cozy.files document
 */
export const statDirectoryByPath = async (client, path) => {
  try {
    const response = await client.collection(FILES_DOCTYPE).statByPath(path)
    return response.data
  } catch (error) {
    if (error && error.status === 404) return null
    throw new Error(error.message)
  }
}

export const filesMutations = client => ({
  addReferencesTo: addReferencesTo.bind(null, client),
  createDirectoryByPath: createDirectoryByPath.bind(null, client),
  statDirectoryByPath: statDirectoryByPath.bind(null, client)
})

export default filesMutations
