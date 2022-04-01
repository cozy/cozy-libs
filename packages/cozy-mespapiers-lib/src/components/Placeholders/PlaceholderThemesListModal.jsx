import React from 'react'

import { useHistory } from 'react-router-dom'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import PlaceholderThemesList from '../Placeholders/PlaceholderThemesList'

const PlaceholderThemesListModal = () => {
  const { t } = useI18n()
  const history = useHistory()

  return (
    <PlaceholderThemesList
      title={t('PlaceholdersList.title', { name: '' })}
      onClose={history.goBack}
    />
  )
}

export default PlaceholderThemesListModal
