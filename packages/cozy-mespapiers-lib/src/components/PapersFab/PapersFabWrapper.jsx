import React, { cloneElement, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useClient } from 'cozy-client'

import { makeActions } from '../Actions/utils'
import { createPaper } from '../Actions/Items/createPaper'
import { select } from '../Actions/Items/select'
import { createPaperByTheme } from '../Actions/Items/createPaperByTheme'
import { findPlaceholderByLabelAndCountry } from '../../helpers/findPlaceholders'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import PaperFabUI from './PaperFabUI'

const PapersFabWrapper = ({ children }) => {
  const [showGeneralMenu, setShowGeneralMenu] = useState(false)
  const [showConnectorMenu, setShowConnectorMenu] = useState(false)
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
    setShowConnectorMenu(false)
    const countrySearchParam = `${
      placeholder.country ? `country=${placeholder.country}` : ''
    }`
    return navigate({
      pathname: `${pathname}/create/${placeholder.label}`,
      search: `${countrySearchParam}`
    })
  }

  const showImportDropdown = paperDefinition => {
    if (paperDefinition.connectorCriteria) {
      setShowConnectorMenu(true)
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
    connectorMenuProps: {
      show: showConnectorMenu,
      placeholder: paperDefinition,
      onClose: () => setShowConnectorMenu(false),
      onClick: () => redirectPaperCreation(paperDefinition)
    }
  }

  return <PaperFabUI {...props} ref={actionBtnRef} />
}

PapersFabWrapper.propTypes = {
  children: PropTypes.node
}

export default PapersFabWrapper
