import * as Comlink from 'comlink'
import { PostMessageWithOrigin } from 'comlink/dist/umd/protocol'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Q, useClient } from 'cozy-client'
import { IOCozyContact, IOCozyFile } from 'cozy-client/types/types'
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
  const navigate = useNavigate()
  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
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
        content
      }: {
        docsId: string
        content: string
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
