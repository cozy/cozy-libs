import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import Icon from 'cozy-ui/transpiled/react/Icon'
import MagnifierIcon from 'cozy-ui/transpiled/react/Icons/Magnifier'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import useExtendI18n from 'cozy-ui/transpiled/react/providers/I18n/useExtendI18n'

import { locales } from '../locales'
import styles from './Search/styles.styl'

export const AssistantMobile = ({ componentsProps }) => {
  const navigate = useNavigate()

  useExtendI18n(locales)

  return (
    <SearchBar
      {...componentsProps?.SearchBar}
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
AssistantMobile.propTypes = {
  componentsProps: PropTypes.shape({
    SearchBar: PropTypes.shape({
      className: PropTypes.string
    })
  })
}

export default AssistantMobile
