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
          .createFile('Empty content', {
            name: `New Docs ${new Date().toISOString()}.md`,
            dirId,
            metadata: { externalId }
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

        if (content) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const { data: uploadedFile } = (await client
            .collection('io.cozy.files')
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            .updateFile(content, {
              fileId: file._id,
              name: file.name,
              metadata: file.metadata
            })) as {
            data: Promise<object>
          }

          return uploadedFile
        } else if (name) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const { data: updatedFile } = (await client
            .collection('io.cozy.files')
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            .update({
              id: file._id,
              metadata: file.metadata,
              name: `${name}.md`
            })) as {
            data: Promise<object>
          }

          return updatedFile
        }
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
