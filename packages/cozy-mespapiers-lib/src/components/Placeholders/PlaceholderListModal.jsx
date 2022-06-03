import React from 'react'

import { useHistory } from 'react-router-dom'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import PlaceholderThemesList from './PlaceholderThemesList'

const PlaceholderListModal = () => {
  const { t } = useI18n()
  const history = useHistory()

  return (
    <PlaceholderThemesList
      title={t('PlaceholdersList.title', { name: '' })}
      onClose={history.goBack}
    />
  )
}

export default PlaceholderListModal
