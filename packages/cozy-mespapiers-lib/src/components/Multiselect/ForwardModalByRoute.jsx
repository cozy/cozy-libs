import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { isQueryLoading, useQuery } from 'cozy-client'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import ForwardModal from './ForwardModal'
import { buildFileQueryById } from '../../helpers/queries'

const useStyles = makeStyles({
  backdropRoot: {
    zIndex: 'var(--zIndex-modal)'
  }
})

const ForwardModalByRoute = () => {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const classes = useStyles()

  const buildedFilesQuery = buildFileQueryById(fileId)
  const { data: file, ...filesQueryResult } = useQuery(
    buildedFilesQuery.definition,
    buildedFilesQuery.options
  )
  const isLoading = isQueryLoading(filesQueryResult)

  if (isLoading) {
    return (
      <Backdrop open classes={{ root: classes.backdropRoot }}>
        <Spinner size="xxlarge" color="var(--primaryContrastTextColor)" />
      </Backdrop>
    )
  }

  return <ForwardModal onClose={() => navigate('..')} file={file} />
}

export default ForwardModalByRoute
