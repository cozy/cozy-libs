import React, { cloneElement, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'

import { makeActions } from '../Actions/utils'
import { createPaper } from '../Actions/Items/createPaper'
import { select } from '../Actions/Items/select'
import PaperFabUI from './PaperFabUI'

const PapersFabWrapper = ({ children }) => {
  const [showGeneralMenuOptions, setGeneralMenuOptions] = useState(false)
  const actionBtnRef = useRef()
  const client = useClient()

  const hideGeneralMenuOption = () => setGeneralMenuOptions(false)
  const toggleActionsMenu = () => {
    setGeneralMenuOptions(prev => !prev)
  }

  const actions = makeActions([createPaper, select], {
    client,
    hideActionsMenu: hideGeneralMenuOption
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
    }
  }

  return <PaperFabUI {...props} ref={actionBtnRef} />
}

PapersFabWrapper.propTypes = {
  children: PropTypes.node
}

export default PapersFabWrapper
