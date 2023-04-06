import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import { useMemo } from 'react'

import CozyClient, { Q, useQuery, hasQueryBeenLoaded } from 'cozy-client'

const useFolderToSaveFiles = folderToSaveId =>
  useQuery(
    Q('io.cozy.files')
      .where({
        dir_id: folderToSaveId,
        trashed: false
      })
      .indexFields(['dir_id', 'cozyMetadata.createdAt'])
      .sortBy([{ dir_id: 'desc' }, { 'cozyMetadata.createdAt': 'desc' }])
      .limitBy(5),
    {
      as: `fileDataCard_io.cozy.files/${folderToSaveId}/io.cozy.files`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
    }
  )

const useSourceAccountFiles = accountId =>
  useQuery(
    Q('io.cozy.files')
      .where({ 'cozyMetadata.sourceAccount': accountId, trashed: false })
      .indexFields(['cozyMetadata.sourceAccount', 'cozyMetadata.createdAt'])
      .sortBy([
        { 'cozyMetadata.sourceAccount': 'desc' },
        { 'cozyMetadata.createdAt': 'desc' }
      ])
      .limitBy(5),
    {
      as: `fileDataCard_io.cozy.accounts/${accountId}/io.cozy.files`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
    }
  )

const getResponse = (folderToSaveFiles, sourceAccountFiles) => {
  const loaded = Boolean(
    hasQueryBeenLoaded(folderToSaveFiles) &&
      hasQueryBeenLoaded(sourceAccountFiles)
  )

  if (
    folderToSaveFiles.fetchStatus === 'failed' &&
    sourceAccountFiles === 'failed'
  )
    return { fetchStatus: 'failed' }

  if (
    loaded &&
    folderToSaveFiles.data.length === 0 &&
    sourceAccountFiles.data.length === 0
  )
    return { fetchStatus: 'empty' }

  if (loaded)
    return {
      data: sortBy(
        uniq(
          [...folderToSaveFiles.data, ...sourceAccountFiles.data],
          x => x._id
        ),
        x => get(x, 'cozyMetadata.createdAt')
      )
        .reverse()
        .slice(0, 5),
      fetchStatus: 'loaded'
    }

  return { fetchStatus: 'loading' }
}

export const useDataCardFiles = (accountId, folderToSaveId) => {
  if (!accountId || !folderToSaveId)
    throw new Error('Missing arguments in useDataCardFiles, cannot fetch files')

  const folderToSaveFiles = useFolderToSaveFiles(folderToSaveId)
  const sourceAccountFiles = useSourceAccountFiles(accountId)

  return useMemo(
    () => getResponse(folderToSaveFiles, sourceAccountFiles),
    [folderToSaveFiles, sourceAccountFiles]
  )
}
