import { useState, useEffect } from 'react'

import { useClient, models } from 'cozy-client'

import logger from '../../../logger'
import { buildSharingsByIdQuery } from '../../../queries/queries'
import getQueryParameter from '../helpers/QueryParameter'

const getSharingId = permission => {
  const sourceId = permission.data.attributes.source_id
  const sharingId = sourceId.split('/')[1]
  return sharingId
}

const CREATE_COZY_LINK = 'https://manager.cozycloud.cc/cozy/create'

export const useSharingInfos = (previewPath = '/preview') => {
  const client = useClient()

  const [addSharingLink, setAddSharingLink] = useState()
  const [syncSharingLink, setSyncSharingLink] = useState()
  const [isSharingShortcutCreated, setIsSharingSharingcutCreated] =
    useState(false)
  const [sharing, setSharing] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSharingDiscoveryLink = async () => {
      setLoading(true)
      try {
        const response = await client
          .collection('io.cozy.permissions')
          .fetchOwnPermissions()

        const isSharingShortcutCreated =
          models.permission.isShortcutCreatedOnTheRecipientCozy(response)
        const sharingId = getSharingId(response)
        const { sharecode } = getQueryParameter()

        const link = client
          .collection('io.cozy.sharings')
          .getDiscoveryLink(sharingId, sharecode, { shortcut: true })
        const linkSync = client
          .collection('io.cozy.sharings')
          .getDiscoveryLink(sharingId, sharecode)
        const sharingsByIdQuery = buildSharingsByIdQuery(sharingId)
        const { data: sharing } = await client.query(
          sharingsByIdQuery.definition
        )

        setAddSharingLink(link)
        setSyncSharingLink(linkSync)
        setIsSharingSharingcutCreated(isSharingShortcutCreated)
        setSharing(sharing)
      } catch (e) {
        logger.warn('Failed to load sharing discovery link', e)
      } finally {
        setLoading(false)
      }
    }

    if (window.location.pathname === previewPath) {
      loadSharingDiscoveryLink()
    } else {
      setLoading(false)
    }
  }, [client, previewPath])

  return {
    sharing,
    loading,
    addSharingLink,
    syncSharingLink,
    createCozyLink: CREATE_COZY_LINK,
    isSharingShortcutCreated
  }
}
