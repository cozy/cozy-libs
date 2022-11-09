import { addSharingLink } from './state'
/**
 * Fetch paginated permissions if needed and dispatch it to
 * the store
 * @param {Object} permissions
 * @param {Function} dispatch
 * @param {Object} client
 */
export const fetchNextPermissions = async (
  permissions,
  dispatch,
  permissionCol
) => {
  if (permissions.links && permissions.links.next) {
    const resp = await permissionCol.fetchPermissionsByLink(permissions)
    dispatch(addSharingLink(resp.data))
    return fetchNextPermissions(resp, dispatch, permissionCol)
  }
}
