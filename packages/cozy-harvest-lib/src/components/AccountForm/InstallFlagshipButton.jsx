import React from 'react'
import { useI18n } from 'twake-i18n'

import { getFlagshipDownloadLink } from 'cozy-client/dist/models/utils'
import Buttons from 'cozy-ui/transpiled/react/Buttons'

const InstallFlagshipButton = ({ className }) => {
  const { t, lang } = useI18n()

  const handleClick = () => {
    let downloadLink = getFlagshipDownloadLink(lang)
    window.open(downloadLink, '_blank')
  }

  return (
    <Buttons
      className={className}
      fullWidth
      label={t('accountForm.installFlagship.label')}
      onClick={handleClick}
    />
  )
}

export { InstallFlagshipButton }
