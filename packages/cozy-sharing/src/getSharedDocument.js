import { isReadOnly } from 'cozy-client/dist/models/permission'

/**
 * Get the first shared document for the current shared token
 *
 * @param {CozyClient} client
 * @returns {{id, isReadOnly}} id of the document and the readOnly status
 */
const getSharedDocument = async client => {
  const { data: permissionsData } = await client
    .collection('io.cozy.permissions')
    .getOwnPermissions()

  const permissions = Object.values(permissionsData.attributes.permissions)
  // permissions contains several named keys, but the one to use depends on the situation. Using the first one is what we want in all known cases.
  const perm = permissions[0]
  return {
    id: perm.values[0],
    isReadOnly: isReadOnly(perm)
  }
}

export default getSharedDocument
