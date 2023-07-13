import { useLocation, useParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'

import { createPaper } from '../Actions/Items/createPaper'
import { createPaperByQualificationLabel } from '../Actions/Items/createPaperByQualificationLabel'

const useGeneralActions = ({
  setShowGeneralMenu,
  setShowKonnectorMenu,
  redirectPaperCreation
}) => {
  const client = useClient()
  const { qualificationLabel } = useParams()
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

  const actionList = qualificationLabel
    ? [createPaperByQualificationLabel, createPaper]
    : []
  const actionOptions = {
    client,
    hideActionsMenu: () => setShowGeneralMenu(false),
    showImportDropdown,
    qualificationLabel,
    country
  }

  const actions = makeActions(actionList, actionOptions)

  return actions
}

export default useGeneralActions
