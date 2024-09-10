import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import FileTypeAudioIcon from 'cozy-ui/transpiled/react/Icons/FileTypeAudio'
import isTesting from 'cozy-ui/transpiled/react/helpers/isTesting'

import styles from './styles.styl'
import withFileUrl from '../hoc/withFileUrl'

const AudioViewer = ({ file, url }) => (
  <div className={styles['viewer-audioviewer']}>
    <Icon icon={FileTypeAudioIcon} width={160} height={140} />
    <p className={styles['viewer-filename']}>{file.name}</p>
    <audio
      src={url}
      controls="controls"
      preload={isTesting() ? 'none' : 'auto'}
    />
  </div>
)

export default withFileUrl(AudioViewer)
