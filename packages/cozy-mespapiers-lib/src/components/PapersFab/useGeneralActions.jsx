import { useLocation, useParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'

import { createPaper } from '../Actions/Items/createPaper'
import { createPaperByTheme } from '../Actions/Items/createPaperByTheme'

const useGeneralActions = ({
  setShowGeneralMenu,
  setShowKonnectorMenu,
  redirectPaperCreation
}) => {
  const client = useClient()
  const { fileTheme } = useParams()
  const { search } = useLocation()

  const country = new URLSearchParams(search).get('country')

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

  return actions
}

export default useGeneralActions
