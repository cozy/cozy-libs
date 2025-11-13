import * as Comlink from 'comlink'
import { PostMessageWithOrigin } from 'comlink/dist/umd/protocol'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Q, useClient } from 'cozy-client'
import { IOCozyContact, IOCozyFile } from 'cozy-client/types/types'
import { useDataProxy } from 'cozy-dataproxy-lib'
import flag from 'cozy-flags'
import Minilog from 'cozy-minilog'

import { BRIDGE_ROUTE_PREFIX } from './constants'
import { getIframe, extractUrl } from './helpers'

const log = Minilog('🌉 [Container bridge]')

interface UseListenBridgeRequestsReturnType {
  isReady: boolean
}

export const useListenBridgeRequests = (
  origin: string
): UseListenBridgeRequestsReturnType => {
  const client = useClient()
  const dataProxy = useDataProxy() as {
    search: (searchQuery: string) => Promise<object[]>
  }
  const navigate = useNavigate()
  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
    if (isReady) return

    if (!client) return

    const exposedMethods = {
      // Proof of concepts of Twake <-> Cozy communication
      getContacts: async (): Promise<IOCozyContact> => {
        const { data } = (await client.query(Q('io.cozy.contacts'))) as {
          data: Promise<IOCozyContact>
        }

        return data
      },
      getLang: (): string => {
        const lang = document.documentElement.getAttribute('lang') || 'en'

        return lang
      },
      createDocs: async ({
        dirId,
        externalId
      }: {
        dirId: string
        externalId: string
      }): Promise<object> => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const { data: createdFile } = (await client
          .collection('io.cozy.files')
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .createFile('', {
            name: `New Docs ${new Date().toISOString()}.docs-note`,
            dirId,
            metadata: { externalId },
            contentType: 'text/markdown'
          })) as {
          data: Promise<object>
        }

        return createdFile
      },
      updateDocs: async ({
        docsId,
        content,
        name
      }: {
        docsId: string
        content: string | undefined
        name: string | undefined
      }): Promise<object | undefined> => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { data: files } = (await client.query(
          Q('io.cozy.files')
            .where({ 'metadata.externalId': docsId })
            .indexFields(['metadata.externalId'])
            .limitBy(1),
          { as: `io.cozy.files/${docsId}` }
        )) as {
          data: IOCozyFile[] | undefined
        }

        if (!files || files.length < 1) return

        const file = files[0]
        if (name) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const { data: updatedFile } = (await client
            .collection('io.cozy.files')
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            .update({
              id: file._id,
              metadata: file.metadata,
              name: `${name}.docs-note`,
              contentType: 'text/markdown'
            })) as {
            data: Promise<object>
          }

          return updatedFile
        }

        // An undefined file content will throw on cozy-client side
        const dataContent = content === undefined ? '' : content
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const { data: uploadedFile } = (await client
          .collection('io.cozy.files')
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          .updateFile(dataContent, {
            fileId: file._id,
            name: file.name,
            metadata: file.metadata
          })) as {
          data: Promise<object>
        }
        return uploadedFile
      },
      search: async (searchQuery: string): Promise<object[]> => {
        return await dataProxy.search(searchQuery)
      },
      getFlag: (key: string): string | boolean => {
        return flag(key)
      },
      // Proof of concepts of Twake <-> Cozy URL synchronization
      updateHistory: (newUrl: string): void => {
        const url = extractUrl(newUrl)
        log.debug(
          `Navigating to ${url} because received ${newUrl} from embedded app`
        )
        navigate(BRIDGE_ROUTE_PREFIX + url, { replace: true })
      },
      requestNotificationPermission:
        async (): Promise<NotificationPermission> => {
          return await Notification.requestPermission()
        },
      sendNotification: ({
        title,
        body
      }: {
        title: string
        body: string
      }): void => {
        new Notification(title, { body })
      }
    }

    Comlink.expose(
      exposedMethods,
      Comlink.windowEndpoint(
        getIframe().contentWindow as PostMessageWithOrigin,
        self,
        origin
      )
    )

    log.debug('Listening to bridge requests')

    setIsReady(true)
  }, [navigate, client, origin])

  return { isReady }
}
