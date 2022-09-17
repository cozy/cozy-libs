import { useLocation } from 'react-router-dom'
import { isQueryLoading, useQuery } from 'cozy-client'

import { buildFilesQueryById } from '../../../helpers/queries'
import { usePapersDefinitions } from '../../Hooks/usePapersDefinitions'

const makeCurrentInformationStep = (currentPaperDef, metadataName) => {
  return currentPaperDef?.acquisitionSteps
    ?.filter(
      step =>
        step.model === 'information' &&
        step.attributes.some(attr => attr.name === metadataName)
    )
    ?.map(step => {
      return {
        ...step,
        attributes: step.attributes.filter(attr => attr.name === metadataName)
      }
    })[0]
}

export const useCurrentEditInformation = fileId => {
  const location = useLocation()
  const { papersDefinitions } = usePapersDefinitions()
  const backgroundPath = new URLSearchParams(location.search).get(
    'backgroundPath'
  )
  const metadataName = new URLSearchParams(location.search).get('metadata')

  const isFilesQueryByIdEnabled = !!fileId
  const buildedFilesQuery = buildFilesQueryById(fileId)
  const { data: files, ...filesQueryResult } = useQuery(
    buildedFilesQuery.definition,
    {
      ...buildedFilesQuery.options,
      enabled: isFilesQueryByIdEnabled
    }
  )
  const isLoadingFiles =
    isFilesQueryByIdEnabled &&
    (isQueryLoading(filesQueryResult) || filesQueryResult.hasMore)

  const currentPaperDef =
    !isLoadingFiles &&
    papersDefinitions.find(
      paper => paper.label === files?.[0]?.metadata?.qualification?.label
    )

  const currentInformationStep = makeCurrentInformationStep(
    currentPaperDef,
    metadataName
  )

  return {
    file: files?.[0],
    paperDef: currentPaperDef,
    currentStep: currentInformationStep,
    searchParams: { backgroundPath, metadataName },
    isLoading: isLoadingFiles
  }
}
