const FILES_DOCTYPE = 'io.cozy.files'

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
  let response
  try {
    response = await client.collection(FILES_DOCTYPE).statByPath(path)
  } catch (error) {
    if (error && error.status === 404) return null
    throw new Error(error.message)
  }

  return response.data
}

export const filesMutations = client => ({
  createDirectoryByPath: createDirectoryByPath.bind(null, client),
  statDirectoryByPath: statDirectoryByPath.bind(null, client)
})

export default filesMutations
