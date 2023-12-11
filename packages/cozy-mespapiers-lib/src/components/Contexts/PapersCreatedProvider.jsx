import React, { useMemo, useContext } from 'react'

import { isQueryLoading, useQueryAll } from 'cozy-client'

import { buildFilesQueryWithQualificationLabel } from '../../helpers/queries'

export const PapersCreatedContext = React.createContext()

export const usePapersCreated = () => {
  const context = useContext(PapersCreatedContext)

  if (!context) {
    throw new Error(
      'usePapersCreated must be used within a PapersCreatedProvider'
    )
  }
  return context
}

const PapersCreatedProvider = ({ children }) => {
  const filesQueryByLabels = buildFilesQueryWithQualificationLabel()
  const { data: filesWithQualificationLabel, ...queryResult } = useQueryAll(
    filesQueryByLabels.definition,
    filesQueryByLabels.options
  )
  const isLoading = isQueryLoading(queryResult) || queryResult.hasMore

  const value = useMemo(
    () => ({
      countPaperCreatedByMesPapiers: isLoading
        ? null
        : filesWithQualificationLabel.filter(
            file =>
              file.cozyMetadata?.createdByApp === 'mespapiers' ||
              file.cozyMetadata?.createdByApp === 'notes'
          ).length
    }),
    [filesWithQualificationLabel, isLoading]
  )

  return (
    <PapersCreatedContext.Provider value={value}>
      {children}
    </PapersCreatedContext.Provider>
  )
}

export default React.memo(PapersCreatedProvider)
