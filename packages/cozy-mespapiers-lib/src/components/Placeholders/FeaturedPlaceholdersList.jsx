import React, { useCallback, useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Placeholder from '../Placeholders/Placeholder'
import ActionMenuImportDropdown from '../Placeholders/ActionMenuImportDropdown'

const useStyles = makeStyles({
  root: { textIndent: '1rem' }
})

const FeaturedPlaceholdersList = ({ featuredPlaceholders }) => {
  const [placeholder, setPlaceholder] = useState(null)
  const actionBtnRefs = useRef([])
  const actionBtnRef = useRef()
  const classes = useStyles()
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()
  const [isImportDropdownDisplayed, setIsImportDropdownDisplayed] =
    useState(false)
  const history = useHistory()
  const location = useLocation()
  const hideImportDropdown = useCallback(
    () => setIsImportDropdownDisplayed(false),
    []
  )

  const showImportDropdown = idx => placeholder => {
    actionBtnRef.current = actionBtnRefs.current[idx]
    setIsImportDropdownDisplayed(true)
    setPlaceholder(placeholder)
  }

  return (
    <List>
      {featuredPlaceholders.length > 0 && (
        <ListSubheader classes={isMobile && classes}>
          {t('FeaturedPlaceholdersList.subheader')}
        </ListSubheader>
      )}
      <div className={'u-pv-half'}>
        {featuredPlaceholders.map((placeholder, idx) => (
          <Placeholder
            key={idx}
            ref={el => (actionBtnRefs.current[idx] = el)}
            placeholder={placeholder}
            divider={idx !== featuredPlaceholders.length - 1}
            onClick={showImportDropdown(idx)}
          />
        ))}
        <ActionMenuImportDropdown
          isOpened={isImportDropdownDisplayed}
          placeholder={placeholder}
          onClose={hideImportDropdown}
          anchorElRef={actionBtnRef}
          onClick={() =>
            history.push({
              pathname: `/paper/create/${placeholder.label}`,
              search: `backgroundPath=${location.pathname}`
            })
          }
        />
      </div>
    </List>
  )
}

FeaturedPlaceholdersList.propTypes = {
  featuredPlaceholders: PropTypes.arrayOf(PropTypes.object)
}

export default FeaturedPlaceholdersList
