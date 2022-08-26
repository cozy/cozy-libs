import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useQuery, useClient, hasQueryBeenLoaded } from 'cozy-client'
import { SharingProvider } from 'cozy-sharing/dist/SharingProvider'

import { buildViewerFileQuery } from './queries'
import FileViewerLoading from './FileViewerLoading'
import FilesViewer from './FilesViewer'

import 'cozy-sharing/dist/stylesheet.css'

const FilesViewerWithQuery = () => {
  const navigate = useNavigate()
  const params = useParams()
  const client = useClient()

  const currentFileId = params?.fileId ?? null
  const buildedFilesQuery = buildViewerFileQuery(currentFileId)
  const filesQuery = useQuery(
    buildedFilesQuery.definition,
    buildedFilesQuery.options
  )

  if (!hasQueryBeenLoaded(filesQuery)) {
    return <FileViewerLoading />
  }

  return (
    <SharingProvider
      client={client}
      doctype="io.cozy.files"
      documentType="Files"
    >
      <FilesViewer
        fileId={currentFileId}
        files={filesQuery.data}
        filesQuery={filesQuery}
        onClose={() => navigate(-1)}
        onChange={fileId => navigate(`/paper/file/${fileId}`)}
      />
    </SharingProvider>
  )
}

export default FilesViewerWithQuery
