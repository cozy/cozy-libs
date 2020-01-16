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
    let resp = { links: { next: true } }
    while (resp && resp.links.next) {
      resp = await client
        .getStackClient()
        .fetchJSON('GET', permissions.links.next)
      dispatch(addSharingLink(resp.data))
    }
  }
}
