import React, { useContext } from 'react'

import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Viewer from 'cozy-ui/transpiled/react/Viewer'

import { MountPointContext } from '../components/MountPointContext'
import { useDataCardFiles } from './useDataCardFiles'

export const ViewerModal = ({
  match: {
    params: { accountId, folderToSaveId, fileIndex }
  }
}) => {
  const { pushHistory, replaceHistory } = useContext(MountPointContext)
  const { data, fetchStatus } = useDataCardFiles(accountId, folderToSaveId)

  const handleCloseViewer = () => replaceHistory(`/accounts`)
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
