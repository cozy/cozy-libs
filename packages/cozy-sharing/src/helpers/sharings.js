import { Q } from 'cozy-client'
import CloudPlusOutlinedIcon from 'cozy-ui/transpiled/react/Icons/CloudPlusOutlined'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import ToTheCloudIcon from 'cozy-ui/transpiled/react/Icons/ToTheCloud'

import { fetchFilesPaths } from './files'
import {
  updateInternalObjectFromRealtime,
  normalizeDocFromRealtime
} from './realtime'
import logger from '../logger'
import { addSharing, updateSharing } from '../state'

const CREATE_COZY_HREF = 'https://manager.cozycloud.cc/cozy/create'

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

/**
 * Open the link in a new tab
 * @param {string} url
 */
export const openExternalLink = url => {
  window.open(url, '_blank')
}

/**
 * Get the icon and label to display in the button
 * @param {object} params
 * @param {string} params.link
 * @param {boolean} params.isSharingShortcutCreated
 * @param {object} params.t
 * @returns {{ icon: React.Component, label: string }}
 */
export const getIconWithlabel = ({ link, isSharingShortcutCreated, t }) => {
  if (link === CREATE_COZY_HREF) {
    return { icon: ToTheCloudIcon, label: t('Share.create-cozy') }
  }
  if (!isSharingShortcutCreated) {
    return { icon: CloudPlusOutlinedIcon, label: t('toolbar.add_to_mine') }
  }
  return { icon: SyncIcon, label: t('toolbar.menu_sync_cozy') }
}
