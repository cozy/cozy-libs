import { useLocation, useParams } from 'react-router-dom'

import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'

import { findPlaceholderByLabelAndCountry } from '../../helpers/findPlaceholders'
import { importAuto } from '../Actions/Items/importAuto'
import { scanPicture } from '../Actions/Items/scanPicture'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'

const useKonnectorsActions = ({
  placeholder,
  redirectPaperCreation,
  setShowKonnectorMenu
}) => {
  const { search } = useLocation()
  const { qualificationLabel } = useParams()
  const { papersDefinitions } = usePapersDefinitions()

  const country = new URLSearchParams(search).get('country')
  const paperDefinition =
    placeholder ||
    findPlaceholderByLabelAndCountry(
      papersDefinitions,
      qualificationLabel,
      country
    )[0]

  const actions = makeActions([importAuto, scanPicture], {
    paperDefinition,
    scanPictureOnclick: () => redirectPaperCreation(paperDefinition),
    importAutoOnclick: () => setShowKonnectorMenu(false)
  })

  return actions
}

export default useKonnectorsActions
