import throttle from 'lodash/throttle'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef, useMemo } from 'react'

import { useClient } from 'cozy-client'
import { downloadFile } from 'cozy-client/dist/models/file'
import { useWebviewIntent } from 'cozy-intent'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import FileImageLoader from 'cozy-ui-plus/dist/FileImageLoader'
import { FileDoctype } from 'cozy-ui-plus/dist/proptypes'

import styles from './styles.styl'
import NoViewer from '../NoViewer'
import DownloadButton from '../NoViewer/DownloadButton'
import { withViewerLocales } from '../hoc/withViewerLocales'

export const PdfMobileViewer = ({ file, url, t, gestures }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)
  const { showAlert } = useAlert()

  const client = useClient()
  const webviewIntent = useWebviewIntent()

  const onImageError = () => {
    setLoading(false)
    setError(true)
  }

  const onImageLoad = () => {
    setLoading(false)
  }

  const handleOnClick = useMemo(
    () =>
      throttle(
        async file => {
          try {
            await downloadFile({ client, file, webviewIntent })
          } catch (error) {
            showAlert({
              message: t('Viewer.error.generic'),
              severity: 'error',
              variant: 'filled',
              icon: false
            })
          }
        },
        1000,
        { trailing: false }
      ),
    [client, showAlert, t, webviewIntent]
  )

  useEffect(() => {
    if (gestures) {
      gestures.get('pinch').set({ enable: true })
      gestures.get('press').set({ time: 1 })
      gestures.on('pinchend press', evt => {
        if (
          (evt.type === 'pinchend' || evt.type === 'press') &&
          evt.target === imgRef.current
        ) {
          handleOnClick(file)
        }
      })

      return () => {
        gestures.off('pinchend press')
      }
    }
  }, [client, gestures, file, handleOnClick])

  if (error) {
    return (
      <NoViewer
        file={file}
        renderFallbackExtraContent={file => <DownloadButton file={file} />}
      />
    )
  }

  return (
    <div className={styles['viewer-pdfMobile']}>
      {loading && <Spinner size="xxlarge" middle noMargin />}
      {file && (
        <FileImageLoader
          file={file}
          url={url}
          linkType="medium"
          onError={onImageError}
          key={file.id}
          render={src => (
            <img
              ref={imgRef}
              className={styles['viewer-pdfMobile--image']}
              alt={file.name}
              src={src}
              onLoad={onImageLoad}
            />
          )}
        />
      )}
    </div>
  )
}

PdfMobileViewer.prototype = {
  file: FileDoctype.isRequired,
  url: PropTypes.string,
  gestures: PropTypes.object
}

export default withViewerLocales(PdfMobileViewer)
