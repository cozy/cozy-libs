import PropTypes from 'prop-types'
import React from 'react'

import { withClient } from 'cozy-client'
import { downloadFile } from 'cozy-client/dist/models/file'
import { useWebviewIntent } from 'cozy-intent'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { FileDoctype } from 'cozy-ui/transpiled/react/proptypes'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const DownloadButton = ({ client, file, url }) => {
  const { t } = useI18n()
  const webviewIntent = useWebviewIntent()

  return (
    <Button
      onClick={() => downloadFile({ client, file, url, webviewIntent })}
      label={t('Viewer.download')}
    />
  )
}

DownloadButton.propTypes = {
  client: PropTypes.object.isRequired,
  file: FileDoctype,
  url: PropTypes.string
}

export default withClient(DownloadButton)
