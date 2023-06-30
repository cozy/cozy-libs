import React from 'react'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Overlay from 'cozy-ui/transpiled/react/deprecated/Overlay'

const FileViewerLoading = () => (
  <Overlay>
    <Spinner
      size="xxlarge"
      middle
      noMargin
      color="var(--primaryContrastTextColor)"
    />
  </Overlay>
)

export default FileViewerLoading
