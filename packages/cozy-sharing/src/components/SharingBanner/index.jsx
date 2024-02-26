import PropTypes from 'prop-types'
import React from 'react'

import { SharingBanner } from './components/SharingBanner'
import { useSharingInfos } from './hooks/useSharingInfos'
import withLocales from '../../hoc/withLocales'

const Plugin = ({ previewPath }) => {
  const sharingInfos = useSharingInfos(previewPath)
  return <SharingBanner sharingInfos={sharingInfos} />
}

Plugin.propTypes = {
  previewPath: PropTypes.string
}

export const SharingBannerPlugin = withLocales(Plugin)
