/**
 * When we receive a sharing from the realtime
 * we need to format it in the same way we store
 * the sharing in the redux store
 *
 * @param {Object} object Document from Realtime
 * @param {String} type type of the document
 */
export const normalizeDocFromRealtime = (object, type) => {
  const fakedSharing = {
    id: object._id,
    ...object,
    attributes: { id: object._id, ...object },
    type
  }
  return fakedSharing
}

/**
 * When we receive a sharing event from
 * the realtime, the message is not formatted as
 * the response of the api endpoint.
 *
 * Let's merge together to update an existing sharing
 * from the one coming from the realtime
 *
 * @param {*} internalSharingFromStore
 * @param {*} sharingFromRealtime
 */
export const updateInternalObjectFromRealtime = (
  internalSharingFromStore,
  sharingFromRealtime
) => {
  return {
    ...internalSharingFromStore,
    meta: {
      rev: sharingFromRealtime._rev
    },
    attributes: {
      ...sharingFromRealtime
    }
  }
}
