import { useLocation } from 'react-router-dom'
import { isQueryLoading, useQuery } from 'cozy-client'

import { buildFilesQueryById } from '../../../helpers/queries'
import { usePapersDefinitions } from '../../Hooks/usePapersDefinitions'
import { getPaperDefinitionByFile, makeCurrentStep } from './helpers'

/**
 * @param {string} fileId
 * @param {'information'|'page'|'contact'} model
 * @returns {{ file: IOCozyFile, paperDef: object, currentStep: object, searchParams: { backgroundPath: string, metadataName: string }, isLoading: boolean }}
 */
export const useCurrentEditInformations = (fileId, model) => {
  const location = useLocation()

  const { papersDefinitions } = usePapersDefinitions()
  const backgroundPath = new URLSearchParams(location.search).get(
    'backgroundPath'
  )
  const metadataName = new URLSearchParams(location.search).get('metadata')

  const buildedFilesQuery = buildFilesQueryById(fileId)
  const { data: files, ...filesQueryResult } = useQuery(
    buildedFilesQuery.definition,
    buildedFilesQuery.options
  )
  const isLoadingFiles =
    isQueryLoading(filesQueryResult) || filesQueryResult.hasMore

  const paperDef =
    (!isLoadingFiles &&
      getPaperDefinitionByFile(papersDefinitions, files[0])) ||
    null

  const currentStep = makeCurrentStep({ paperDef, model, metadataName })

  return {
    file: files?.[0],
    paperDef,
    currentStep,
    searchParams: { backgroundPath, metadataName },
    isLoading: isLoadingFiles
  }
}
