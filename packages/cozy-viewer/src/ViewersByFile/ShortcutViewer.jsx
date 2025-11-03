import get from 'lodash/get'
import React from 'react'

import { useClient, useFetchShortcut } from 'cozy-client'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'
import { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'
import { FileDoctype } from 'cozy-ui-plus/dist/proptypes'

import NoViewer from '../NoViewer'
import { withViewerLocales } from '../hoc/withViewerLocales'

const ShortcutViewer = ({ t, file }) => {
  const client = useClient()
  const { shortcutInfos } = useFetchShortcut(client, file.id)
  let url = ''
  if (shortcutInfos) {
    url = new URL(get(shortcutInfos, 'data.attributes.url'))
  }
  return (
    <NoViewer
      file={file}
      renderFallbackExtraContent={() => (
        <ButtonLink
          label={`${t('Viewer.goto', { url: get(url, 'origin', '') })}`}
          icon={OpenwithIcon}
          href={`${get(url, 'origin', '')}`}
          target="_blank"
        />
      )}
    />
  )
}

ShortcutViewer.propTypes = {
  file: FileDoctype.isRequired
}

export default withViewerLocales(ShortcutViewer)
