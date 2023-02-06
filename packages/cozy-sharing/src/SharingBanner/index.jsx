import React from 'react'
import PropTypes from 'prop-types'

import withLocales from '../withLocales'
import { useSharingInfos } from './hooks/useSharingInfos'
import { SharingBanner } from './components/SharingBanner'

const Plugin = ({ previewPath }) => {
  const sharingInfos = useSharingInfos(previewPath)
  return <SharingBanner sharingInfos={sharingInfos} />
}

Plugin.propTypes = {
  previewPath: PropTypes.string
}

export const SharingBannerPlugin = withLocales(Plugin)
