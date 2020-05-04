/**
 *
 * @param {Object} object Document from Realtime
 * @param {String} type type of the document
 */
export const createFakeInternalObjectFromRealtime = (object, type) => {
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
 * Let's merge together
 * @param {*} fromHTTPRequest
 * @param {*} fromWebsocket
 */
export const mergeObjectFromRealTime = (fromHTTPRequest, fromWebsocket) => {
  return {
    ...fromHTTPRequest,
    meta: {
      rev: fromWebsocket._rev
    },
    attributes: {
      ...fromWebsocket
    }
  }
}
