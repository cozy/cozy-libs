import PropTypes from 'prop-types'
import React, { cloneElement, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionMenu/Actions/helpers'

import PaperFabUI from './PaperFabUI'
import { findPlaceholderByLabelAndCountry } from '../../helpers/findPlaceholders'
import { createPaper } from '../Actions/Items/createPaper'
import { createPaperByTheme } from '../Actions/Items/createPaperByTheme'
import { select } from '../Actions/Items/select'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'

const PapersFabWrapper = ({ children }) => {
  const [showGeneralMenu, setShowGeneralMenu] = useState(false)
  const [showKonnectorMenu, setShowKonnectorMenu] = useState(false)
  const actionBtnRef = useRef()
  const client = useClient()
  const { fileTheme } = useParams()
  const navigate = useNavigate()
  const { search, pathname } = useLocation()
  const country = new URLSearchParams(search).get('country')

  const hideGeneralMenu = () => setShowGeneralMenu(false)
  const toggleGeneralMenu = () => {
    setShowGeneralMenu(prev => !prev)
  }

  const { papersDefinitions: paperDefinitionsList } = usePapersDefinitions()
  const paperDefinition = findPlaceholderByLabelAndCountry(
    paperDefinitionsList,
    fileTheme,
    country
  )[0]

  const redirectPaperCreation = placeholder => {
    setShowKonnectorMenu(false)
    const countrySearchParam = `${
      placeholder.country ? `country=${placeholder.country}` : ''
    }`
    return navigate({
      pathname: `${pathname}/create/${placeholder.label}`,
      search: `${countrySearchParam}`
    })
  }

  const showImportDropdown = paperDefinition => {
    if (paperDefinition.konnectorCriteria) {
      setShowKonnectorMenu(true)
    } else {
      redirectPaperCreation(paperDefinition)
    }
    hideGeneralMenu()
  }

  const actionList = [createPaper, select]
  if (fileTheme) actionList.unshift(createPaperByTheme)

  const actions = makeActions(actionList, {
    client,
    hideActionsMenu: hideGeneralMenu,
    showImportDropdown,
    fileTheme,
    country
  })

  if (!children) return null

  const PapersFabOverrided = cloneElement(children, {
    onClick: toggleGeneralMenu,
    innerRef: actionBtnRef
  })

  const props = {
    PapersFabOverrided,
    generalMenuProps: {
      show: showGeneralMenu,
      actions,
      onClose: hideGeneralMenu
    },
    konnectorMenuProps: {
      show: showKonnectorMenu,
      placeholder: paperDefinition,
      onClose: () => setShowKonnectorMenu(false),
      onClick: () => redirectPaperCreation(paperDefinition)
    }
  }

  return <PaperFabUI {...props} ref={actionBtnRef} />
}

PapersFabWrapper.propTypes = {
  children: PropTypes.node
}

export default PapersFabWrapper
