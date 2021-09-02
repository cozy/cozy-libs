import React from 'react'

import { I18n } from 'cozy-ui/transpiled/react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { useSharingInfos } from './hooks/useSharingInfos'
import { useShouldDisplay } from './hooks/useShouldDisplay'
import { SharingBanner } from './components/SharingBanner'

export const SharingBannerPlugin = () => {
  const sharingInfos = useSharingInfos()
  const { lang } = useI18n()
  const shouldDisplay = useShouldDisplay(window.location)

  return shouldDisplay ? (
    <I18n dictRequire={() => require('./locales/en.json')} lang={lang}>
      <SharingBanner sharingInfos={sharingInfos} />
    </I18n>
  ) : null
}
