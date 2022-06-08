/* global cozy */
import React, { useState, useRef } from 'react'

import { useClient } from 'cozy-client'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'

import { makeActions } from '../Actions/utils'
import { select } from '../Actions/Items/select'
import ActionMenuWrapper from '../Actions/ActionMenuWrapper'
import { ActionsItems } from '../Actions/ActionsItems'

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
        <CozyTheme>
          <IconButton ref={actionBtnRef} onClick={toggleActionsMenu}>
            <Icon icon="dots" />
          </IconButton>
        </CozyTheme>
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
