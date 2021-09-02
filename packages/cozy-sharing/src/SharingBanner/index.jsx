import React from 'react'

import withLocales from '../withLocales'
import { useSharingInfos } from './hooks/useSharingInfos'
import { SharingBanner } from './components/SharingBanner'

const Plugin = () => {
  const sharingInfos = useSharingInfos()

  return <SharingBanner sharingInfos={sharingInfos} />
}

export const SharingBannerPlugin = withLocales(Plugin)
