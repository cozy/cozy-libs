import cx from 'classnames'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import Icon from 'cozy-ui/transpiled/react/Icon'
import MagnifierIcon from 'cozy-ui/transpiled/react/Icons/Magnifier'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useExtendI18n from 'cozy-ui/transpiled/react/providers/I18n/useExtendI18n'

import { locales } from '../locales'
import styles from './Search/styles.styl'
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
          className={cx('u-ml-1 u-mr-half', styles['search-bar-icon'])}
          icon={MagnifierIcon}
          size={16}
        />
      }
      type="button"
      onClick={() => navigate('connected/search')} // FIXME this route is related to home app
    />
  )
}

export default AssistantMobile
