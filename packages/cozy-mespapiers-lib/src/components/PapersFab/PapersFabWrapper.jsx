import PropTypes from 'prop-types'
import React, { cloneElement, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions/helpers'

import PaperFabUI from './PaperFabUI'
import { findPlaceholderByLabelAndCountry } from '../../helpers/findPlaceholders'
import { createPaper } from '../Actions/Items/createPaper'
import { createPaperByTheme } from '../Actions/Items/createPaperByTheme'
import { importAuto } from '../Actions/Items/importAuto'
import { scanPicture } from '../Actions/Items/scanPicture'
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

  let actionList
  if (flag('mespapiers.fabExtended.enabled')) {
    actionList = fileTheme ? [createPaperByTheme, createPaper] : []
  } else {
    actionList = fileTheme
      ? [createPaperByTheme, createPaper, select]
      : [createPaper, select]
  }

  const actions = makeActions(actionList, {
    client,
    hideActionsMenu: hideGeneralMenu,
    showImportDropdown,
    fileTheme,
    country
  })

  const handleClick = () => {
    return actions.length === 0 ? navigate('create') : toggleGeneralMenu()
  }

  if (!children) return null

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
      onClose: hideGeneralMenu
    },
    konnectorMenuProps: {
      show: showKonnectorMenu,
      actions: makeActions([importAuto, scanPicture], {
        paperDefinition,
        scanPictureOnclick: () => redirectPaperCreation(paperDefinition)
      }),
      onClose: () => setShowKonnectorMenu(false)
    }
  }

  return <PaperFabUI {...props} ref={actionBtnRef} />
}

PapersFabWrapper.propTypes = {
  children: PropTypes.node
}

export default PapersFabWrapper
