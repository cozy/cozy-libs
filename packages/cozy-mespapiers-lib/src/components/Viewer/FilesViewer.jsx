import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Q, useClient } from 'cozy-client'
import { isIOSApp } from 'cozy-device-helper'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import FooterActionButtons from 'cozy-ui/transpiled/react/Viewer/Footer/FooterActionButtons'
import ForwardButton from 'cozy-ui/transpiled/react/Viewer/Footer/ForwardButton'

import FileViewerLoading from './FileViewerLoading'
import SelectFileButton from './SelectFileButton'
import { useFileSharing } from '../Contexts/FileSharingProvider'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const styleStatusBar = switcher => {
  if (window.StatusBar && isIOSApp()) {
    if (switcher) {
      window.StatusBar.backgroundColorByHexString('var(--primaryTextColor)')
      window.StatusBar.styleLightContent()
    } else {
      window.StatusBar.backgroundColorByHexString(
        'var(--primaryContrastTextColor)'
      )
      window.StatusBar.styleDefault()
    }
  }
}

const FilesViewer = ({ filesQuery, files, fileId, onClose, onChange }) => {
  const [currentFile, setCurrentFile] = useState(null)
  const [fetchingMore, setFetchingMore] = useState(false)
  const client = useClient()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isFileSharingAvailable } = useFileSharing()
  const { isMultiSelectionActive } = useMultiSelection()

  const editPathByModelProps = {
    information: `#${pathname}/edit/information?metadata=__NAME__`,
    page: `#${pathname}/edit/page`,
    contact: `#${pathname}/edit/contact`
  }

  const handleOnClose = () => {
    if (onClose) onClose()
  }

  const handleOnChange = nextFile => {
    if (onChange) onChange(nextFile.id)
  }

  const currentIndex = files.findIndex(f => f.id === fileId)
  const hasCurrentIndex = () => currentIndex != -1
  const viewerFiles = hasCurrentIndex ? files : [currentFile]
  const viewerIndex = hasCurrentIndex ? currentIndex : 0

  useEffect(() => {
    styleStatusBar(true)

    return () => {
      styleStatusBar(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    // If we can't find the file in the loaded files, that's probably because the user
    // is trying to open a direct link to a file that wasn't in the first 50 files of
    // the containing folder (it comes from a fetchMore...) ; we load the file attributes
    // directly as a contingency measure
    const fetchFileIfNecessary = async () => {
      if (currentIndex !== -1) return
      if (currentFile && isMounted) {
        setCurrentFile(null)
      }

      try {
        const { data } = await client.query(Q('io.cozy.files').getById(fileId))
        isMounted && setCurrentFile(data)
      } catch (e) {
        onClose && onClose()
      }
    }

    fetchFileIfNecessary()

    return () => {
      isMounted = false
    }
  }, [client, currentFile, fileId, currentIndex, onClose])

  useEffect(() => {
    let isMounted = true

    // If we get close of the last file fetched, but we know there are more in the folder
    // (it shouldn't happen in /recent), we fetch more files
    const fetchMoreIfNecessary = async () => {
      if (fetchingMore) return

      setFetchingMore(true)
      try {
        const fileCount = filesQuery.count

        const currentIndex = files.findIndex(f => f.id === fileId)

        if (
          files.length !== fileCount &&
          files.length - currentIndex <= 5 &&
          isMounted
        ) {
          await filesQuery.fetchMore()
        }
      } finally {
        setFetchingMore(false)
      }
    }

    fetchMoreIfNecessary()

    return () => {
      isMounted = false
    }
  }, [fetchingMore, filesQuery.count, files.length, fileId, filesQuery, files])

  // If we can't find the file, we fallback to the (potentially loading)
  // direct stat made by the viewer
  if (currentIndex === -1 && !currentFile) {
    return <FileViewerLoading />
  }

  return (
    <Viewer
      files={viewerFiles}
      currentIndex={viewerIndex}
      onChangeRequest={handleOnChange}
      onCloseRequest={handleOnClose}
      editPathByModelProps={editPathByModelProps}
    >
      {!isMultiSelectionActive && (
        <FooterActionButtons>
          <ForwardButton
            file={viewerFiles[viewerIndex]}
            onClick={() => {
              const fileId = viewerFiles[viewerIndex]._id
              if (isFileSharingAvailable) {
                navigate(`${pathname}/share`, {
                  state: { fileId }
                })
              } else {
                navigate(`${pathname}/forward/${fileId}`)
              }
            }}
          />
          <SelectFileButton file={viewerFiles[viewerIndex]} />
        </FooterActionButtons>
      )}
    </Viewer>
  )
}

export default FilesViewer
