import { Q } from 'cozy-client'

import {
  updateInternalObjectFromRealtime,
  normalizeDocFromRealtime
} from './realtime'

import { addSharing, updateSharing } from '../state'
import { fetchFilesPaths } from './files'

export const getSharingObject = (internalSharing, sharing) => {
  if (internalSharing) {
    return updateInternalObjectFromRealtime(internalSharing, sharing)
  } else {
    return normalizeDocFromRealtime(sharing, 'io.cozy.sharings')
  }
}

export const createSharingInStore = (
  client,
  doctype,
  dispatch,
  docsId,
  sharing
) => {
  // TODO Check if we can getByIds to avoid query in map
  docsId.map(async id => {
    const file = await client.query(Q('io.cozy.files').getById(id))
    dispatch(
      addSharing(
        sharing,
        file.data.path || (await fetchFilesPaths(client, doctype, [file.data]))
      )
    )
  })
}

export const updateSharingInStore = (dispatch, sharing) => {
  dispatch(updateSharing(sharing))
}
