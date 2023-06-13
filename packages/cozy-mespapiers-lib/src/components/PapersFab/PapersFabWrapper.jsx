import PropTypes from 'prop-types'
import React, { cloneElement, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import PaperFabUI from './PaperFabUI'
import useGeneralActions from './useGeneralActions'
import useKonnectorsActions from './useKonnectorsActions'

const PapersFabWrapper = ({ children }) => {
  const navigate = useNavigate()
  const actionBtnRef = useRef()
  const { pathname } = useLocation()
  const [showGeneralMenu, setShowGeneralMenu] = useState(false)
  const [showKonnectorMenu, setShowKonnectorMenu] = useState(false)

  const redirectPaperCreation = paperDefinition => {
    setShowKonnectorMenu(false)
    const countrySearchParam = `${
      paperDefinition.country ? `country=${paperDefinition.country}` : ''
    }`

    return navigate({
      pathname: `${pathname}/create/${paperDefinition.label}`,
      search: `${countrySearchParam}`
    })
  }

  const generalActions = useGeneralActions({
    setShowGeneralMenu,
    setShowKonnectorMenu,
    redirectPaperCreation
  })

  const konnectorsActions = useKonnectorsActions({ redirectPaperCreation })

  if (!children) return null

  const handleClick = () => {
    return generalActions.length === 0
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
      actions: generalActions,
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
