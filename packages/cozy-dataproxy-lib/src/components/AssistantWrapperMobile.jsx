import AssistantIcon from 'assets/icons/icon-assistant.png'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import Icon from 'cozy-ui/transpiled/react/Icon'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useExtendI18n from 'cozy-ui/transpiled/react/providers/I18n/useExtendI18n'

import localesEn from '../locales/en.json'
import localesFr from '../locales/fr.json'

const locales = { fr: localesFr, en: localesEn }

export const AssistantWrapperMobile = () => {
  const { t } = useI18n()
  const navigate = useNavigate()

  useExtendI18n(locales)

  return (
    <SearchBar
      size="medium"
      icon={
        <Icon className="u-ml-1 u-mr-half" icon={AssistantIcon} size={24} />
      }
      type="button"
      label={t('assistant.search.placeholder')}
      onClick={() => navigate('connected/search')} // FIXME
    />
  )
}

export default AssistantWrapperMobile
