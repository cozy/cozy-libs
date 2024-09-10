import PropTypes from 'prop-types'
import React from 'react'

import { FileDoctype } from 'cozy-ui/transpiled/react/proptypes'

import DownloadButton from './DownloadButton'
import FileIcon from './FileIcon'
import styles from '../ViewersByFile/styles.styl'

const NoViewer = ({ file, url, renderFallbackExtraContent }) => (
  <div className={styles['viewer-noviewer']}>
    <FileIcon type={file.class} />
    <p className={styles['viewer-filename']}>{file.name}</p>
    {renderFallbackExtraContent(file, url)}
  </div>
)

NoViewer.propTypes = {
  file: FileDoctype.isRequired,
  renderFallbackExtraContent: PropTypes.func,
  url: PropTypes.string
}

NoViewer.defaultProps = {
  renderFallbackExtraContent: (file, url) => (
    <DownloadButton file={file} url={url} />
  )
}

export default NoViewer
