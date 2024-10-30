import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'

import { models, useQuery } from 'cozy-client'
import Overlay from 'cozy-ui/transpiled/react/deprecated/Overlay'
import Viewer from 'cozy-viewer'

import { useDataCardFiles } from './useDataCardFiles'
import { MountPointContext } from '../components/MountPointContext'
import { buildAccountQueryById } from '../helpers/queries'

export const ViewerModal = () => {
  const { accountId, folderToSaveId, fileIndex } = useParams()

  const buildAccountQuery = buildAccountQueryById(accountId)
  const accountResult = useQuery(
    buildAccountQuery.definition,
    buildAccountQuery.options
  )

  const sourceAccountIdentifier = models.account.getAccountName(
    accountResult.data
  )
  const konnectorSlug = accountResult.data?.account_type

  if (!sourceAccountIdentifier || !konnectorSlug) return <Overlay />

  return (
    <ViewerModalContent
      sourceAccountIdentifier={sourceAccountIdentifier}
      folderToSaveId={folderToSaveId}
      konnectorSlug={konnectorSlug}
      accountId={accountId}
      fileIndex={fileIndex}
    />
  )
}

const ViewerModalContent = ({
  sourceAccountIdentifier,
  folderToSaveId,
  konnectorSlug,
  accountId,
  fileIndex
}) => {
  const { pushHistory, replaceHistory } = useContext(MountPointContext)
  const { data, fetchStatus } = useDataCardFiles(
    sourceAccountIdentifier,
    folderToSaveId,
    konnectorSlug
  )
  const handleCloseViewer = () => replaceHistory(`/accounts/${accountId}`)
  const handleFileChange = (_file, newIndex) =>
    pushHistory(`/viewer/${accountId}/${folderToSaveId}/${newIndex}`)

  if (
    fetchStatus === 'empty' ||
    fetchStatus === 'failed' ||
    (fetchStatus === 'loaded' && fileIndex > data.length)
  ) {
    handleCloseViewer()

    return null
  }

  if (fetchStatus === 'loading') return <Overlay />

  return (
    <Overlay>
      <Viewer
        files={data}
        currentIndex={Number(fileIndex)}
        onCloseRequest={handleCloseViewer}
        onChangeRequest={handleFileChange}
      />
    </Overlay>
  )
}
