import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'

import MultiselectBackdrop from './MultiselectBackdrop'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import useActions from '../SearchResult/useActions'

const MultiselectViewActions = () => {
  const { allMultiSelectionFiles } = useMultiSelection()
  const [isBackdropOpen, setIsBackdropOpen] = useState(false)
  const navigate = useNavigate()

  const actions = useActions(allMultiSelectionFiles, {
    isActionBar: true,
    actionsOptions: { navigate, setIsBackdropOpen }
  })

  return (
    <>
      {isBackdropOpen && <MultiselectBackdrop />}

      <ActionsBar actions={actions} docs={allMultiSelectionFiles} />
    </>
  )
}

export default MultiselectViewActions
