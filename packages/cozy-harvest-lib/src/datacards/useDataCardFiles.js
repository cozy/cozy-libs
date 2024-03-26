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

const useSourceAccountIdentifierFiles = (sourceAccountIdentifier, slug) =>
  useQuery(
    Q('io.cozy.files')
      .where({
        'cozyMetadata.sourceAccountIdentifier': sourceAccountIdentifier,
        trashed: false,
        'cozyMetadata.createdByApp': slug
      })
      .indexFields([
        'cozyMetadata.sourceAccountIdentifier',
        'cozyMetadata.createdAt'
      ])
      .sortBy([
        { 'cozyMetadata.sourceAccountIdentifier': 'desc' },
        { 'cozyMetadata.createdAt': 'desc' }
      ])
      .limitBy(5),
    {
      as: `fileDataCard_io.cozy.files/sourceAccountIdentifier/${sourceAccountIdentifier}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
    }
  )

const getResponse = (folderToSaveFiles, sourceAccountIdentifierFiles) => {
  const loaded = Boolean(
    hasQueryBeenLoaded(folderToSaveFiles) &&
      hasQueryBeenLoaded(sourceAccountIdentifierFiles)
  )

  if (
    folderToSaveFiles.fetchStatus === 'failed' &&
    sourceAccountIdentifierFiles === 'failed'
  )
    return { fetchStatus: 'failed' }

  if (
    loaded &&
    folderToSaveFiles.data.length === 0 &&
    sourceAccountIdentifierFiles.data.length === 0
  )
    return { fetchStatus: 'empty' }

  if (loaded)
    return {
      data: sortBy(
        uniq(
          [...folderToSaveFiles.data, ...sourceAccountIdentifierFiles.data],
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

export const useDataCardFiles = (
  sourceAccountIdentifier,
  folderToSaveId,
  slug
) => {
  if (!sourceAccountIdentifier || !folderToSaveId)
    throw new Error('Missing arguments in useDataCardFiles, cannot fetch files')

  const folderToSaveFiles = useFolderToSaveFiles(folderToSaveId)
  const sourceAccountIdentifierFiles = useSourceAccountIdentifierFiles(
    sourceAccountIdentifier,
    slug
  )

  return useMemo(
    () => getResponse(folderToSaveFiles, sourceAccountIdentifierFiles),
    [folderToSaveFiles, sourceAccountIdentifierFiles]
  )
}
