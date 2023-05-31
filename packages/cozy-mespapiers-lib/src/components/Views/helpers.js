import { getAccountName } from 'cozy-client/dist/models/account'

import { filterWithRemaining } from '../../helpers/filterWithRemaining'

export const makePapers = (
  papersDefinitionsLabels,
  filesWithQualificationLabel
) =>
  filesWithQualificationLabel?.filter(file =>
    papersDefinitionsLabels.includes(file?.metadata?.qualification?.label)
  ) || []

export const makeQualificationLabelWithoutFiles = (
  papersDefinitionsLabels,
  papers
) =>
  papersDefinitionsLabels.filter(
    paperDefinitionLabel =>
      !papers.some(
        paper => paper.metadata?.qualification?.label === paperDefinitionLabel
      )
  )

export const makeKonnectorsAndQualificationLabelWithoutFiles = (
  konnectors,
  qualificationLabelWithoutFiles
) =>
  konnectors.map(konnector => ({
    konnector,
    konnectorQualifLabelsWithoutFile:
      konnector.qualification_labels?.filter(qualificationLabel =>
        qualificationLabelWithoutFiles.includes(qualificationLabel)
      ) || []
  }))

/**
 * Groups together accounts that have files and those that don't
 * @param {import('cozy-client/types/types').AccountsDocument[]} accounts - Array of accounts
 * @param {import('cozy-client/types/types').IOCozyFile[]} files - Array of IOCozyFile
 * @returns {{ accountsWithFiles: import('cozy-client/types/types').AccountsDocument[], accountsWithoutFiles: import('cozy-client/types/types').AccountsDocument[] }} - Accounts with files and accounts without files
 */
export const makeAccountsByFiles = (accounts, files) => {
  const hasFile = account => {
    return files?.some(
      file =>
        file.cozyMetadata.sourceAccountIdentifier === getAccountName(account)
    )
  }

  // if (!accounts) return { accountsWithFiles: [], accountsWithoutFiles: [] }

  const {
    itemsFound: accountsWithFiles,
    remainingItems: accountsWithoutFiles
  } = filterWithRemaining(accounts, hasFile)

  return { accountsWithFiles, accountsWithoutFiles }
}
