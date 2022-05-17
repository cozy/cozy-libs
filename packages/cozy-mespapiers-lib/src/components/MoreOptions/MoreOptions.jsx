/* global cozy */
import React, { useState, useRef } from 'react'

import { useClient } from 'cozy-client'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { makeActions } from '../ActionMenuOptions/utils'
import { select } from '../Actions/Items/select'
import ActionMenuWrapper from '../ActionMenuOptions/ActionMenuWrapper'
import { ActionsItems } from '../ActionMenuOptions/ActionsItems'

const MoreOptions = () => {
  const [generalOptions, setGeneralOptions] = useState(false)
  const actionBtnRef = useRef()
  const client = useClient()
  const { BarRight } = cozy.bar

  const hideActionsMenu = () => setGeneralOptions(false)
  const toggleActionsMenu = () => setGeneralOptions(prev => !prev)

  const actions = makeActions([select], {
    client,
    hideActionsMenu
  })

  return (
    <>
      <BarRight>
        <IconButton
          ref={actionBtnRef}
          onClick={toggleActionsMenu}
          style={{ paddingRight: 0 }}
        >
          <Icon icon={'dots'} />
        </IconButton>
      </BarRight>

      {generalOptions && (
        <ActionMenuWrapper onClose={hideActionsMenu} ref={actionBtnRef}>
          <ActionsItems actions={actions} />
        </ActionMenuWrapper>
      )}
    </>
  )
}

export default MoreOptions
