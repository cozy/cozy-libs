import React, { useCallback, useEffect, useState, useMemo } from 'react'

import { Q, useClient } from 'cozy-client'
import { isIOSApp } from 'cozy-device-helper'
import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Viewer from 'cozy-ui/transpiled/react/Viewer'

import FileViewerLoading from './FileViewerLoading'

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

  const handleOnClose = useCallback(() => {
    if (onClose) onClose()
  }, [onClose])

  const handleOnChange = useCallback(
    nextFile => {
      if (onChange) onChange(nextFile.id)
    },
    [onChange]
  )

  const currentIndex = useMemo(
    () => files.findIndex(f => f.id === fileId),
    [files, fileId]
  )
  const hasCurrentIndex = useMemo(() => currentIndex != -1, [currentIndex])

  const viewerFiles = useMemo(
    () => (hasCurrentIndex ? files : [currentFile]),
    [hasCurrentIndex, files, currentFile]
  )

  const viewerIndex = useMemo(
    () => (hasCurrentIndex ? currentIndex : 0),
    [hasCurrentIndex, currentIndex]
  )

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
        handleOnClose()
      }
    }

    fetchFileIfNecessary()

    return () => {
      isMounted = false
    }
  }, [client, currentFile, fileId, currentIndex, handleOnClose])

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
    <Overlay>
      <Viewer
        files={viewerFiles}
        currentIndex={viewerIndex}
        onChangeRequest={handleOnChange}
        disableSharing={true}
        onCloseRequest={handleOnClose}
      />
    </Overlay>
  )
}

export default FilesViewer
