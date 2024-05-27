import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useQuery, useClient, hasQueryBeenLoaded } from 'cozy-client'
import { SharingProvider } from 'cozy-sharing/dist/SharingProvider'
import 'cozy-sharing/dist/stylesheet.css'

import FileViewerLoading from '../Viewer/FileViewerLoading'
import FilesViewer from '../Viewer/FilesViewer'
import { buildViewerFileQuery } from '../Viewer/queries'

const FilesViewerWithQuery = () => {
  const navigate = useNavigate()
  const { fileId } = useParams()
  const client = useClient()

  const currentFileId = fileId ?? null
  const buildedFilesQuery = buildViewerFileQuery(currentFileId)
  const { data: files, ...filesQuery } = useQuery(
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
        fileId={fileId}
        files={files}
        filesQuery={filesQuery}
        onClose={() => navigate('..')}
      />
    </SharingProvider>
  )
}

export default FilesViewerWithQuery
