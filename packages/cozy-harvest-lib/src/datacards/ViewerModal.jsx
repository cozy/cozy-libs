import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'

import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Viewer from 'cozy-ui/transpiled/react/Viewer'

import { useDataCardFiles } from './useDataCardFiles'
import { MountPointContext } from '../components/MountPointContext'

export const ViewerModal = () => {
  const { pushHistory, replaceHistory } = useContext(MountPointContext)
  const { data, fetchStatus } = useDataCardFiles(accountId, folderToSaveId)
  const { accountId, folderToSaveId, fileIndex } = useParams()

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
