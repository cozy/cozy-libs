import React, { cloneElement, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'

import ActionMenuWrapper from '../Actions/ActionMenuWrapper'
import { ActionsItems } from '../Actions/ActionsItems'
import { makeActions } from '../Actions/utils'
import { createPaper } from '../Actions/Items/createPaper'
import { select } from '../Actions/Items/select'

const PapersFabWrapper = ({ children }) => {
  const [generalOptions, setGeneralOptions] = useState(false)
  const actionBtnRef = useRef()
  const client = useClient()

  const hideActionsMenu = () => setGeneralOptions(false)
  const toggleActionsMenu = () => {
    setGeneralOptions(prev => !prev)
  }
  const actions = makeActions([createPaper, select], {
    client,
    hideActionsMenu
  })

  if (!children) return null

  const PapersFabOverrided = cloneElement(children, {
    onClick: toggleActionsMenu
  })

  return (
    <>
      {PapersFabOverrided}

      {generalOptions && (
        <ActionMenuWrapper onClose={hideActionsMenu} ref={actionBtnRef}>
          <ActionsItems actions={actions} />
        </ActionMenuWrapper>
      )}
    </>
  )
}

PapersFabWrapper.propTypes = {
  children: PropTypes.node
}

export default PapersFabWrapper
