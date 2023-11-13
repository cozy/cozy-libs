import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import List from 'cozy-ui/transpiled/react/List'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Placeholder from './Placeholder'
import useKonnectorsActions from '../PapersFab/useKonnectorsActions'

const FeaturedPlaceholdersList = ({ featuredPlaceholders }) => {
  const actionBtnRefs = useRef([])
  const actionBtnRef = useRef()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [showActionMenu, setShowActionMenu] = useState(false)
  const [placeholder, setPlaceholder] = useState(null)

  const hideImportDropdown = () => {
    setShowActionMenu(false)
    setPlaceholder(null)
  }

  const redirectPaperCreation = placeholder => {
    hideImportDropdown()
    const countrySearchParam = `${
      placeholder.country ? `country=${placeholder.country}` : ''
    }`
    return navigate({
      pathname: `create/${placeholder.label}`,
      search: `${countrySearchParam}`
    })
  }

  const actions = useKonnectorsActions({
    placeholder,
    redirectPaperCreation
  })

  const showImportDropdown = idx => placeholder => {
    if (placeholder.konnectorCriteria) {
      actionBtnRef.current = actionBtnRefs.current[idx]
      setShowActionMenu(true)
      setPlaceholder(placeholder)
    } else {
      redirectPaperCreation(placeholder)
    }
  }

  return (
    <List
      subheader={
        featuredPlaceholders.length > 0 && (
          <ListSubheader>
            {t('FeaturedPlaceholdersList.subheader')}
          </ListSubheader>
        )
      }
    >
      {featuredPlaceholders.map((placeholder, idx) => (
        <Placeholder
          key={idx}
          ref={el => (actionBtnRefs.current[idx] = el)}
          aria-controls="simple-menu"
          aria-haspopup="true"
          placeholder={placeholder}
          divider={idx !== featuredPlaceholders.length - 1}
          onClick={showImportDropdown(idx)}
        />
      ))}
      {showActionMenu && (
        <ActionsMenu
          open
          ref={actionBtnRef}
          actions={actions}
          onClose={hideImportDropdown}
        />
      )}
    </List>
  )
}

FeaturedPlaceholdersList.propTypes = {
  featuredPlaceholders: PropTypes.arrayOf(PropTypes.object)
}

export default FeaturedPlaceholdersList
