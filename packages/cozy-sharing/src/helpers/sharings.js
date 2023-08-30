import { Q } from 'cozy-client'

import { fetchFilesPaths } from './files'
import {
  updateInternalObjectFromRealtime,
  normalizeDocFromRealtime
} from './realtime'
import logger from '../logger'
import { addSharing, updateSharing } from '../state'

export const getSharingObject = (internalSharing, sharing) => {
  if (internalSharing) {
    return updateInternalObjectFromRealtime(internalSharing, sharing)
  } else {
    return normalizeDocFromRealtime(sharing, 'io.cozy.sharings')
  }
}

export const createSharingInStore = async ({
  client,
  doctype,
  dispatch,
  docsId,
  sharing
}) => {
  // TODO Check if we can getByIds to avoid query in map
  await Promise.all(
    docsId.map(async id => {
      try {
        const file =
          doctype === 'io.cozy.files'
            ? await client.query(Q(doctype).getById(id))
            : undefined

        const path =
          file &&
          (file.data.path ||
            (await fetchFilesPaths(client, doctype, [file.data])))

        dispatch(addSharing(sharing, path))
      } catch (e) {
        logger.log(e)
      }
    })
  )
}

export const updateSharingInStore = (dispatch, sharing) => {
  dispatch(updateSharing(sharing))
}
