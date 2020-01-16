import { addSharingLink } from './state'
/**
 * Fetch paginated permissions if needed and dispatch it to
 * the store
 * @param {Object} permissions
 * @param {Function} dispatch
 * @param {Object} client
 */
export const fetchNextPermissions = async (permissions, dispatch, client) => {
  if (permissions.links && permissions.links.next) {
    const resp = await client
      .getStackClient()
      .fetchJSON('GET', permissions.links.next)
    dispatch(addSharingLink(resp.data))
    return fetchNextPermissions(resp, dispatch, client)
  }
}
