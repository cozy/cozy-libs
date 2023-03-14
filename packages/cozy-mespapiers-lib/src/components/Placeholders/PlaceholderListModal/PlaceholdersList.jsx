import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import FileIcon from '../../Icons/FileIcon'
import { useScannerI18n } from '../../Hooks/useScannerI18n'
import { usePapersDefinitions } from '../../Hooks/usePapersDefinitions'
import { findPlaceholdersByQualification } from '../../../helpers/findPlaceholders'
import ActionMenuImportDropdown from '../ActionMenuImportDropdown'

const useStyles = makeStyles(() => ({
  placeholderList: {
    minHeight: '15rem',
    margin: '0.5rem 0',
    padding: 0
  },
  actionMenu: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    '& >div:first-child': {
      position: 'relative !important',
      transform: 'none !important'
    }
  }
}))

const PlaceholdersList = ({ currentQualifItems }) => {
  const [isImportDropdownDisplayed, setIsImportDropdownDisplayed] =
    useState(false)
  const [placeholderSelected, setPlaceholderSelected] = useState(null)
  const { papersDefinitions } = usePapersDefinitions()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const styles = useStyles()
  const scannerT = useScannerI18n()

  const allPlaceholders = useMemo(
    () =>
      findPlaceholdersByQualification(papersDefinitions, currentQualifItems),
    [currentQualifItems, papersDefinitions]
  )
  const hideImportDropdown = () => {
    setIsImportDropdownDisplayed(false)
    setPlaceholderSelected(undefined)
  }

  const shouldDisplayImportDropdown = () => {
    return !!isImportDropdownDisplayed && !!placeholderSelected
  }

  const redirectPaperCreation = placeholder => {
    const countrySearchParam = `${
      placeholder.country ? `country=${placeholder.country}` : ''
    }`
    return navigate({
      pathname: `${pathname}/${placeholder.label}`,
      search: `${countrySearchParam}`
    })
  }

  const showImportDropdown = placeholder => {
    if (placeholder.konnectorCriteria) {
      setIsImportDropdownDisplayed(true)
      setPlaceholderSelected(placeholder)
    } else {
      redirectPaperCreation(placeholder)
    }
  }

  return (
    <>
      <List className={styles.placeholderList}>
        {allPlaceholders.map((placeholder, idx) => {
          const validPlaceholder =
            placeholder.acquisitionSteps.length > 0 ||
            placeholder.konnectorCriteria

          return (
            <ListItem
              key={idx}
              button
              disabled={!validPlaceholder}
              onClick={() => showImportDropdown(placeholder)}
              data-testid="PlaceholdersList-ListItem"
            >
              <ListItemIcon>
                <FileIcon icon={placeholder.icon} />
              </ListItemIcon>
              <ListItemText
                primary={scannerT(
                  `items.${placeholder.label}`,
                  placeholder.country
                )}
              />
            </ListItem>
          )
        })}
      </List>
      <ActionMenuImportDropdown
        className={styles.actionMenu}
        isOpened={shouldDisplayImportDropdown()}
        placeholder={placeholderSelected}
        onClose={hideImportDropdown}
        onClick={() => redirectPaperCreation(placeholderSelected)}
      />
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
