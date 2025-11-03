import PropTypes from 'prop-types'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { FileDoctype } from 'cozy-ui-plus/dist/proptypes'

import NoViewer from '../NoViewer'
import { withViewerLocales } from '../hoc/withViewerLocales'

const OnlyOfficeViewer = ({ file, onlyOfficeOpener, t }) => {
  return (
    <NoViewer
      file={file}
      renderFallbackExtraContent={() => (
        <Button
          label={t('Viewer.openInOnlyOffice')}
          onClick={() => onlyOfficeOpener(file)}
        />
      )}
    />
  )
}

OnlyOfficeViewer.propTypes = {
  file: FileDoctype,
  onlyOfficeOpener: PropTypes.func.isRequired
}

export default withViewerLocales(OnlyOfficeViewer)
