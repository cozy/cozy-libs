import PropTypes from 'prop-types'
import React, { cloneElement, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'

import PaperFabUI from './PaperFabUI'
import { findPlaceholderByLabelAndCountry } from '../../helpers/findPlaceholders'
import { createPaper } from '../Actions/Items/createPaper'
import { createPaperByTheme } from '../Actions/Items/createPaperByTheme'
import { importAuto } from '../Actions/Items/importAuto'
import { scanPicture } from '../Actions/Items/scanPicture'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'

const PapersFabWrapper = ({ children }) => {
  const [showGeneralMenu, setShowGeneralMenu] = useState(false)
  const [showKonnectorMenu, setShowKonnectorMenu] = useState(false)
  const actionBtnRef = useRef()
  const client = useClient()
  const { fileTheme } = useParams()
  const navigate = useNavigate()
  const { search, pathname } = useLocation()
  const { papersDefinitions: paperDefinitionsList } = usePapersDefinitions()

  if (!children) return null

  const country = new URLSearchParams(search).get('country')

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
    setShowGeneralMenu(false)
  }

  const actionList = fileTheme ? [createPaperByTheme, createPaper] : []
  const actionOptions = {
    client,
    hideActionsMenu: () => setShowGeneralMenu(false),
    showImportDropdown,
    fileTheme,
    country
  }
  const actions = makeActions(actionList, actionOptions)

  const konnectorsActions = makeActions([importAuto, scanPicture], {
    paperDefinition,
    scanPictureOnclick: () => redirectPaperCreation(paperDefinition)
  })

  const handleClick = () => {
    return actions.length === 0
      ? navigate('create')
      : setShowGeneralMenu(prev => !prev)
  }

  const PapersFabOverrided = cloneElement(children, {
    onClick: handleClick,
    innerRef: actionBtnRef,
    a11y: {
      'aria-controls':
        showGeneralMenu || showKonnectorMenu ? 'fab-menu' : undefined,
      'aria-haspopup': true,
      'aria-expanded': showGeneralMenu || showKonnectorMenu ? true : undefined
    }
  })

  const props = {
    PapersFabOverrided,
    generalMenuProps: {
      show: showGeneralMenu,
      actions,
      onClose: () => setShowGeneralMenu(false)
    },
    konnectorMenuProps: {
      show: showKonnectorMenu,
      actions: konnectorsActions,
      onClose: () => setShowKonnectorMenu(false)
    }
  }

  return <PaperFabUI {...props} ref={actionBtnRef} />
}

PapersFabWrapper.propTypes = {
  children: PropTypes.node
}

export default PapersFabWrapper
