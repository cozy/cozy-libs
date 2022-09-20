import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { FILES_DOCTYPE } from '../../../../doctypes'
import { useCurrentEditInformation } from '../useCurrentEditInformation'
import PageEditMobile from './PageEditMobile'
import PageEditDesktop from './PageEditDesktop'
import PageEditItems from './PageEditItems'

const pageItems = ['front', 'back']

const PageEditWrapper = () => {
  const { fileId } = useParams()
  const client = useClient()
  const { isMobile } = useBreakpoints()
  const navigate = useNavigate()

  const [isBusy, setIsBusy] = useState(false)
  const [value, setValue] = useState('')

  const currentEditInformation = useCurrentEditInformation(fileId, 'page')
  const currentPage = currentEditInformation?.file?.metadata?.page

  useEffect(() => {
    if (!value && currentPage) {
      setValue(currentPage)
    }
  }, [value, currentPage])

  const onClose = () => {
    navigate(currentEditInformation.searchParams.backgroundPath || '/paper')
  }

  const onConfirm = async newValue => {
    setIsBusy(true)
    let newMetadata = {
      ...currentEditInformation.file.metadata,
      page: newValue ?? value
    }

    await client
      .collection(FILES_DOCTYPE)
      .updateMetadataAttribute(fileId, newMetadata)

    onClose()
  }

  const handleChange = newValue => {
    if (value !== newValue) {
      setValue(newValue)
      if (isMobile) onConfirm(newValue)
    }
  }

  if (!currentEditInformation.isLoading && !currentEditInformation.file) {
    return <Navigate to={currentEditInformation.searchParams.backgroundPath} />
  }

  return isMobile ? (
    <PageEditMobile onClose={onClose}>
      <PageEditItems items={pageItems} onChange={handleChange} value={value} />
    </PageEditMobile>
  ) : (
    <PageEditDesktop onClose={onClose} onConfirm={onConfirm} isBusy={isBusy}>
      <PageEditItems items={pageItems} onChange={handleChange} value={value} />
    </PageEditDesktop>
  )
}

export default PageEditWrapper
