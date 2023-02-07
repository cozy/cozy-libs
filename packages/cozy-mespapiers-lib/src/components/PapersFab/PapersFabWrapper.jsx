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
  const [showGeneralMenuOptions, setGeneralMenuOptions] = useState(false)
  const [showConnectorActionMenu, setShowConnectorActionMenu] = useState(false)
  const actionBtnRef = useRef()
  const client = useClient()
  const { fileTheme } = useParams()
  const navigate = useNavigate()
  const { search, pathname } = useLocation()
  const country = new URLSearchParams(search).get('country')

  const hideGeneralMenuOption = () => setGeneralMenuOptions(false)
  const toggleActionsMenu = () => {
    setGeneralMenuOptions(prev => !prev)
  }

  const { papersDefinitions: paperDefinitionsList } = usePapersDefinitions()
  const paperDefinition = findPlaceholderByLabelAndCountry(
    paperDefinitionsList,
    fileTheme,
    country
  )[0]

  const redirectPaperCreation = placeholder => {
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
      setShowConnectorActionMenu(true)
    } else {
      redirectPaperCreation(paperDefinition)
    }
    hideGeneralMenuOption()
  }

  const actionList = []
  if (fileTheme) actionList.push(createPaperByTheme)
  actionList.push(createPaper, select)

  const actions = makeActions(actionList, {
    client,
    hideActionsMenu: hideGeneralMenuOption,
    showImportDropdown,
    fileTheme,
    country
  })

  if (!children) return null

  const PapersFabOverrided = cloneElement(children, {
    onClick: toggleActionsMenu,
    innerRef: actionBtnRef
  })

  const props = {
    PapersFabOverrided,
    generalMenuOptions: {
      showGeneralMenuOptions,
      actions,
      hideGeneralMenuOption
    },
    connectorActionMenuOptions: {
      showConnectorActionMenu,
      paperDefinition,
      hideConnectorActionMenu: () => setShowConnectorActionMenu(false),
      onClickConnectorActionMenu: () => redirectPaperCreation(paperDefinition)
    }
  }

  return <PaperFabUI {...props} ref={actionBtnRef} />
}

PapersFabWrapper.propTypes = {
  children: PropTypes.node
}

export default PapersFabWrapper
