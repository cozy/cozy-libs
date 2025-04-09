import React from 'react'
import { useNavigate } from 'react-router-dom'

import Icon from 'cozy-ui/transpiled/react/Icon'
import MagnifierIcon from 'cozy-ui/transpiled/react/Icons/Magnifier'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useExtendI18n from 'cozy-ui/transpiled/react/providers/I18n/useExtendI18n'

import { locales } from '../locales'
import { AssistantIcon } from './AssistantIcon/AssistantIcon'
import { isAssistantEnabled } from './helpers'

export const AssistantMobile = () => {
  const { t } = useI18n()
  const navigate = useNavigate()

  useExtendI18n(locales)

  return (
    <SearchBar
      size="medium"
      icon={
        <Icon
          className="u-ml-1 u-mr-half"
          icon={isTwakeTheme() ? MagnifierIcon : AssistantIcon}
          size={isTwakeTheme() ? 16 : 24}
        />
      }
      type="button"
      label={
        isAssistantEnabled() ? t('assistant.search.placeholder') : undefined // fallback on SearchBar default
      }
      onClick={() => navigate('connected/search')} // FIXME this route is related to home app
    />
  )
}

export default AssistantMobile
