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

const makeCurrentStep = (currentPaperDef, model, metadataName) => {
  switch (model) {
    case 'information':
      return makeCurrentInformationStep(currentPaperDef, metadataName)
    case 'page':
      return null
  }
}

/**
 * @param {string} fileId
 * @param {'information'|'page'|'contact'} model
 * @returns {{ file: IOCozyFile, paperDef: object, currentStep: object, searchParams: { backgroundPath: string, metadataName: string }, isLoading: boolean }}
 */
export const useCurrentEditInformation = (fileId, model) => {
  const location = useLocation()

  const { papersDefinitions } = usePapersDefinitions()
  const backgroundPath = new URLSearchParams(location.search).get(
    'backgroundPath'
  )
  const metadataName = new URLSearchParams(location.search).get('metadata')

  const isFilesQueryByIdEnabled = !!fileId
  const buildedFilesQuery =
    isFilesQueryByIdEnabled && buildFilesQueryById(fileId)
  const { data: files, ...filesQueryResult } = useQuery(
    buildedFilesQuery.definition,
    {
      ...buildedFilesQuery.options,
      enabled: isFilesQueryByIdEnabled
    }
  )
  const isLoadingFiles = !!(
    isFilesQueryByIdEnabled &&
    (isQueryLoading(filesQueryResult) || filesQueryResult.hasMore)
  )

  const paperDef =
    (!isLoadingFiles &&
      papersDefinitions.find(
        paper => paper.label === files?.[0]?.metadata?.qualification?.label
      )) ||
    null

  const currentStep = makeCurrentStep(paperDef, model, metadataName)

  return {
    file: files?.[0],
    paperDef,
    currentStep,
    searchParams: { backgroundPath, metadataName },
    isLoading: isLoadingFiles
  }
}
