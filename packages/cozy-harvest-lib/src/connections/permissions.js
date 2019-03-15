const PERMISSIONS_DOCTYPE = 'io.cozy.permissions'

/**
 * Add the given permisison to the given subject
 * @param {Object} client     CozyClient
 * @param {Object} target     Target document, could have doctype io.cozy.apps,
 * io.cozy.konnectors or io.cozy.permissions
 * @param {{ type, values, verbs}} A permission objects
 */
const addPermission = async (client, target, permission) => {
  const { data } = await client
    .collection(PERMISSIONS_DOCTYPE)
    .add(target, permission)
  return data
}

export const permissionsMutations = client => ({
  addPermission: addPermission.bind(null, client)
})

export default permissionsMutations
