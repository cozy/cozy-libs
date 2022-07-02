import React, { useMemo } from 'react'
import get from 'lodash/get'

import { useQuery, useClient } from 'cozy-client'
import { SharingProvider } from 'cozy-sharing/dist/SharingProvider'

import { buildViewerFileQuery } from './queries'
import FileViewerLoading from './FileViewerLoading'
import FilesViewer from './FilesViewer'

import 'cozy-sharing/dist/stylesheet.css'

const FilesViewerWithQuery = props => {
  const { history, match } = props
  const client = useClient()

  const currentFileId = useMemo(
    () => get(match, 'params.fileId', null),
    [match]
  )
  const buildedFilesQuery = useMemo(
    () => buildViewerFileQuery(currentFileId),
    [currentFileId]
  )
  const filesQuery = useQuery(
    buildedFilesQuery.definition,
    buildedFilesQuery.options
  )

  if (filesQuery.data?.length > 0) {
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
          onClose={() => history.goBack()}
          onChange={fileId =>
            history.push({
              pathname: `/paper/file/${fileId}`
            })
          }
        />
      </SharingProvider>
    )
  } else {
    return <FileViewerLoading />
  }
}

export default FilesViewerWithQuery
