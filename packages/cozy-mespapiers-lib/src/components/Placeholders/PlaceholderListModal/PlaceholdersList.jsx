import PropTypes from 'prop-types'
import React, { useState, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { findPlaceholdersByQualification } from '../../../helpers/findPlaceholders'
import { usePapersDefinitions } from '../../Hooks/usePapersDefinitions'
import { useScannerI18n } from '../../Hooks/useScannerI18n'
import FileIcon from '../../Icons/FileIcon'
import useKonnectorsActions from '../../PapersFab/useKonnectorsActions'

const PlaceholdersList = ({ currentQualifItems }) => {
  const [isImportDropdownDisplayed, setIsImportDropdownDisplayed] =
    useState(false)
  const [placeholderSelected, setPlaceholderSelected] = useState(null)
  const { papersDefinitions } = usePapersDefinitions()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const scannerT = useScannerI18n()
  const anchorRefs = useRef([])
  const anchorRef = useRef()

  const allPlaceholders = useMemo(
    () =>
      findPlaceholdersByQualification(papersDefinitions, currentQualifItems),
    [currentQualifItems, papersDefinitions]
  )
  const hideImportDropdown = () => {
    setIsImportDropdownDisplayed(false)
    setPlaceholderSelected(undefined)
  }

  const showActionMenu = isImportDropdownDisplayed && !!placeholderSelected

  const redirectPaperCreation = placeholder => {
    const countrySearchParam = `${
      placeholder.country ? `country=${placeholder.country}` : ''
    }`
    return navigate({
      pathname: `${pathname}/${placeholder.label}`,
      search: `${countrySearchParam}`
    })
  }

  const actions = useKonnectorsActions({
    placeholder: placeholderSelected,
    redirectPaperCreation
  })

  const showImportDropdown = (idx, placeholder) => {
    if (placeholder.konnectorCriteria) {
      anchorRef.current = anchorRefs.current[idx]
      setIsImportDropdownDisplayed(true)
      setPlaceholderSelected(placeholder)
    } else {
      redirectPaperCreation(placeholder)
    }
  }

  return (
    <>
      <List>
        {allPlaceholders.map((placeholder, idx) => {
          const validPlaceholder =
            placeholder.acquisitionSteps.length > 0 ||
            placeholder.konnectorCriteria

          return (
            <ListItem
              key={idx}
              ref={el => (anchorRefs.current[idx] = el)}
              button
              disabled={!validPlaceholder}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={() => showImportDropdown(idx, placeholder)}
              data-testid="PlaceholdersList-ListItem"
            >
              <ListItemIcon>
                <FileIcon icon={placeholder.icon} />
              </ListItemIcon>
              <ListItemText
                primary={scannerT(`items.${placeholder.label}`, {
                  country: placeholder.country
                })}
              />
            </ListItem>
          )
        })}
      </List>
      {showActionMenu && (
        <ActionsMenu
          ref={anchorRef}
          open
          actions={actions}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          onClose={hideImportDropdown}
        />
      )}
    </>
  )
}

PlaceholdersList.propTypes = {
  currentQualifItems: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string,
      subjects: PropTypes.arrayOf(PropTypes.string),
      purpose: PropTypes.string,
      sourceCategory: PropTypes.string,
      sourceSubCategory: PropTypes.string
    })
  ).isRequired
}

export default PlaceholdersList
