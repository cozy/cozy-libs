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
