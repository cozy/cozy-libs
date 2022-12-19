import React from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { useQuery, useClient, hasQueryBeenLoaded } from 'cozy-client'
import { SharingProvider } from 'cozy-sharing/dist/SharingProvider'

import { buildViewerFileQuery } from '../Viewer/queries'
import FileViewerLoading from '../Viewer/FileViewerLoading'
import FilesViewer from '../Viewer/FilesViewer'

import 'cozy-sharing/dist/stylesheet.css'

const FilesViewerWithQuery = () => {
  const navigate = useNavigate()
  const { fileId } = useParams()
  const client = useClient()

  const currentFileId = fileId ?? null
  const buildedFilesQuery = buildViewerFileQuery(currentFileId)
  const filesQuery = useQuery(
    buildedFilesQuery.definition,
    buildedFilesQuery.options
  )

  if (!hasQueryBeenLoaded(filesQuery)) {
    return <FileViewerLoading />
  }

  return (
    <>
      <SharingProvider
        client={client}
        doctype="io.cozy.files"
        documentType="Files"
      >
        <FilesViewer
          fileId={currentFileId}
          files={filesQuery.data}
          filesQuery={filesQuery}
          onClose={() => navigate('..')}
        />
      </SharingProvider>
      <Outlet />
    </>
  )
}

export default FilesViewerWithQuery
