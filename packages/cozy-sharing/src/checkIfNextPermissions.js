import { addSharingLink } from './state'
export const loadNextPermissions = async (permissions, dispatch, client) => {
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
