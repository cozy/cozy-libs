import React from 'react'

import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

const FileViewerLoading = () => (
  <Overlay>
    <Spinner
      size="xxlarge"
      middle
      noMargin
      color={'var(--primaryContrastTextColor)'}
    />
  </Overlay>
)

export default FileViewerLoading
