import AssistantIcon from 'assets/icons/icon-assistant.png'
import cx from 'classnames'
// import { useWallpaperContext } from 'hooks/useWallpaperContext'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { getFlagshipMetadata } from 'cozy-device-helper'
import flag from 'cozy-flags'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import CozyTheme, {
  useCozyTheme
} from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useExtendI18n from 'cozy-ui/transpiled/react/providers/I18n/useExtendI18n'

import styles from './styles.styl'
import localesEn from '../locales/en.json'
import localesFr from '../locales/fr.json'

export const AssistantWrapperMobile = () => {
  const { type } = useCozyTheme()
  // const {
  //   data: { isCustomWallpaper }
  // } = useWallpaperContext()
  const { t } = useI18n()
  const navigate = useNavigate()

  const locales = { fr: localesFr, en: localesEn }
  useExtendI18n(locales)

  return (
    <CozyTheme variant="normal">
      <div
        className={cx(styles['assistantWrapper-mobile'], {
          [styles[`assistantWrapper-mobile--${type}`]]: true, // !isCustomWallpaper,
          [styles['assistantWrapper-mobile--offset']]: flag(
            'home.fab.button.enabled'
          ),
          [styles['assistantWrapper-mobile--immersive']]:
            getFlagshipMetadata().immersive
        })}
      >
        <SearchBar
          size="medium"
          icon={
            <Icon className="u-ml-1 u-mr-half" icon={AssistantIcon} size={24} />
          }
          type="button"
          label={t('assistant.search.placeholder')}
          onClick={() => navigate('connected/search')} // FIXME
        />
      </div>
    </CozyTheme>
  )
}

export default AssistantWrapperMobile
